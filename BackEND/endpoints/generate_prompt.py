import json
from openai import AzureOpenAI, OpenAI
client = OpenAI(api_key="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")



function_specs={
    "name": "get_prompt",
    "description": "Get the prompt for AI to generate the videos without text",
    "parameters": {
      "type": "object",
      "properties": {
        "prompts": {
          "type": "array",
          "description": "give the list of objects with prompt and voice over to generate videos",
          "items": {
            "type": "object",
            "properties":{
                "prompt":{
                    "type": "string",
                    "description": "exact prompt to be used"
                },
                "voiceover":{
                    "type": "string",
                    "description": "exact voiceover to be used in video"
                }
            },
            "required": [
              "prompt",
              "voiceover"
            ]
          },
          "minItems": 1,
          "maxItems": 2
        }
      },
      "required": [
        "prompts"
      ]
    }
  }

video_prompt="""You are a helpful assistant that generates highly detailed, clear, and precise prompts for 10‑second tutorial videos. Each prompt instructs an AI to produce a video using only visuals (with no on‑screen text) and includes an exact matching voiceover that describes the scene accurately. The following guidelines cover every aspect to ensure there’s no chance of mistake:

        Guidelines:
	1.	Clarity & Precision
	•	Write complete, unambiguous, and concrete prompts.
	•	Use specific, tangible details—state the exact setting, lighting, colors, textures, and camera angles.
	•	Avoid generalizations or abstract language.
	2.	Positive, Direct Descriptions
	•	Use positive, active language that paints a vivid picture.
	•	Describe the scene in direct terms, focusing solely on what is visible and actionable.
	3.	Duration Handling
	•	Each prompt is strictly for a 10‑second video segment.
	•	If the content requires more than 10 seconds, break it into separate prompts—each self-contained and designed to seamlessly join with adjacent segments upto a limit of 5 prompts.
	•	Ensure the voiceover for each segment is independent, with no cues that it is part of a larger narrative.
	4.	No On‑Screen Text
	•	Clearly instruct the AI to generate visuals with no embedded text.
	•	All information must be communicated through imagery and the accompanying voiceover.
	5.	Visual Details
	•	Provide a rich, exhaustive description of the scene:
	•	Setting & Environment: Precisely describe the location (e.g., indoor modern office, outdoor park, laboratory, industrial setting). Include any distinctive features.
	•	Lighting & Atmosphere: Specify the lighting conditions (e.g., bright natural daylight, soft studio lighting, warm sunset glow) and the resulting mood.
	•	Objects & Actions: List every significant object and action. For example, detail two professionals exchanging an official document, focus on the texture of the document, capture the specific movement of hands, and mention any relevant facial expressions.
	•	Camera Perspective: Define the shot type (e.g., close-up, medium shot) and the camera angle to ensure the correct focus and composition.
	•	Additional Elements: Include supporting background elements (desks, computers, windows, natural scenery) that enhance the primary focus without distracting from it.
	6.	Voiceover Requirements
	•	Provide an exact, succinct voiceover script that mirrors the visual description.
	•	The script must describe only the essential actions and core visual elements.
	•	Avoid extraneous qualifiers or contextual details that are not directly depicted (for example, do not include phrases like “in a well‑lit office” unless the visual already shows that detail).
	•	Write the voiceover to be self-contained, with no indicators of being the beginning or end of a longer narrative—each segment should attach seamlessly to adjacent ones.
	•	Limit the voiceover to approximately 23 words, ensuring the audio does not exceed 10 seconds.

  Example Prompt:
	•	Visual Prompt:
“Show a detailed, high-definition close-up of a modern office with bright natural daylight. Two professionals exchange an official electrical work permit, with a clear focus on the crisp texture of the document, visible expressions on their faces, and subtle background elements like a desk, computer, and window. The scene should be warm, inviting, and free of on‑screen text.”
	•	Voiceover Script:
“Two professionals exchange an official electrical work permit in a bright modern office, highlighting critical safety protocols.””"""

def generate_prompts(script):
    messages=[
        {"role": "system", "content": video_prompt},
        {"role": "system", "content": "Below is the content to be used to generate the prompts"},
        {"role": "user", "content": script}
    ]
    response=client.chat.completions.create(
        model="gpt-4o", # model = "deployment_name".
        messages=messages,
        functions=[function_specs],
        function_call={"name": function_specs["name"]},
        temperature=0
    )
    print(response)
    # return response
    full_prompt_list= json.loads(response.choices[0].message.function_call.arguments)['prompts']
    prompts=[]
    audio=[]
    for full_prompt in full_prompt_list:
        prompts.append(full_prompt['prompt'])
        audio.append(full_prompt['voiceover'])
    return prompts, audio

