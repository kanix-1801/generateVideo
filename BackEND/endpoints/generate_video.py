import time
import base64
import requests
from runwayml import RunwayML
from endpoints.generate_prompt import generate_prompts
from endpoints.merge_videos import merge_videos
from openai import AzureOpenAI, OpenAI
client = OpenAI(api_key="sk-xxx")
client_runway = RunwayML(api_key="key_xxx")


def generate_audio(voiceover, voice, language):
    voice_models={"male": "alloy",
                  "female": "onyx"}
    selected_voice=voice_models.get(voice, "onyx")
    speech_files=[]
    for i, prompt in enumerate(voiceover, start=1):
        speech_file_path = f"../Storage/Audio/speech_{i}.mp3"
        response = client.audio.speech.create(
            model="tts-1",
            voice=selected_voice,
            input=prompt
        )
        with open(speech_file_path, "wb") as f:
            f.write(response.content)
        speech_files.append(speech_file_path)
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
                output_filename = f"../Storage/Video/videorunway_{idx}.mp4"
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
    image_path=event.get('image_path', "../Storage/default/White.png")
    prompt, voiceover=generate_prompts(script)
    speech_files=generate_audio(voiceover, voice, language)
    video_files=_generate_video(prompt, image_path)
    # return speech_files, video_files
    final_response=merge_videos(speech_files, video_files)
    return final_response