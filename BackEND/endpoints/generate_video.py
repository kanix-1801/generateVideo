import time
import base64
import requests
import os
from runwayml import RunwayML
from endpoints.generate_prompt import generate_prompts
from endpoints.merge_videos import merge_videos
from openai import AzureOpenAI, OpenAI
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("openai_key"))
client_runway = RunwayML(api_key=os.getenv("runway_key"))

def translate_voiceover(text_list, language):
    transalted_text_list=[]
    for text in text_list:
        messages=[
            {
                "role": "system",
                "content": f"""Read the given sentence and translate it to {language} language ,\nOnly output in {language} language"""
            },
            {
                "role": "system",
                "content": text
            }
        ]
        response = client.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=messages,
                            temperature=0.7,
                            n=1)
        transalted_text_list.append(response.choices[0].message.content)
    return transalted_text_list

def generate_audio(voiceover, voice, language):
    if language.lower!="english":
        voiceover=translate_voiceover(voiceover, language)
    print(1.1)
    voice_models={"male": "alloy",
                  "female": "onyx"}
    print(1.2)
    selected_voice=voice_models.get(voice, "onyx")
    print(1.3)
    speech_files=[]
    print(1.4)
    for i, prompt in enumerate(voiceover, start=1):
        print(f"1.5.1.{i}")
        speech_file_path = f"../frontEnd/Public/Storage/Audio/speech_{i}.mp3"
        print(f"1.5.2.{i}")
        response = client.audio.speech.create(
            model="tts-1",
            voice=selected_voice,
            input=prompt
        )
        print(f"1.5.3.{i}")
        with open(speech_file_path, "wb") as f:
            f.write(response.content)
        print(f"1.5.4.{i}")
        speech_files.append(speech_file_path)
    print(1.6)
    return speech_files

def _generate_video(prompt, image_path):
    with open(image_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")
    video_files = []
    polling_interval = 2
    for idx, prompt_obj in enumerate(prompt, start=1):
        print(f"Processing prompt {idx}...")

        # Create a new image-to-video task using the current prompt text
        task = client_runway.image_to_video.create(
            model='gen3a_turbo',
            prompt_image=f"data:image/png;base64,{base64_image}",
            prompt_text=prompt_obj
        )

        # Simple polling mechanism to wait for the task to finish
        time.sleep(polling_interval)
        task = client_runway.tasks.retrieve(task.id)
        while task.status not in ['SUCCEEDED', 'FAILED']:
            print(f"Waiting {polling_interval} sec...")
            time.sleep(polling_interval)
            task = client_runway.tasks.retrieve(task.id)

        # Check final task status
        if task.status == 'SUCCEEDED':
            video_url = task.output[0]
            if video_url:
                output_filename = f"../frontEnd/Public/Storage/Video/videorunway_{idx}.mp4"
                response = requests.get(video_url)
                with open(output_filename, "wb") as f:
                    f.write(response.content)
                print(f"Video saved as {output_filename}")
                video_files.append(output_filename)
            else:
                print("Video URL not found in task output!")
        else:
            print(f"Task failed with status: {task.status}")

    print("All video files generated:", video_files)
    return video_files

def generate_video(event):
    script=event.get('script')
    voice=event.get('voice', "male")
    language=event.get('language', "English")
    image_path=event.get('file_path', "../frontEnd/Public/Storage/default/White.png")
    prompt, voiceover=generate_prompts(script)
    print(1)
    speech_files=generate_audio(voiceover, voice, language)
    print(2)
    video_files=_generate_video(prompt, image_path)
    print(3)
    # return speech_files, video_files
    final_response=merge_videos(speech_files, video_files)
    print(4)
    return final_response