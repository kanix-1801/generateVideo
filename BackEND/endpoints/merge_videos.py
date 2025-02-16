import numpy as np
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_audioclips, concatenate_videoclips
from moviepy.audio.AudioClip import AudioArrayClip


def merge_audio_video(speech_files, video_files):
    merged_files = []

    for segment_number, (audio_path, video_path) in enumerate(zip(speech_files, video_files), start=1):
        # Load clips
        video_clip = VideoFileClip(video_path)
        audio_clip = AudioFileClip(audio_path)

        video_duration = video_clip.duration
        audio_duration = audio_clip.duration

        # Handle audio < video duration: add silence; audio > video duration: trim
        if audio_duration < video_duration:
            silence_duration = video_duration - audio_duration
            # Create silent audio of the needed length
            silence_array = np.zeros((int(silence_duration * audio_clip.fps), 2))
            silence_clip = AudioArrayClip(silence_array, fps=audio_clip.fps)
            final_audio = concatenate_audioclips([audio_clip, silence_clip])
        else:
            final_audio = audio_clip.subclip(0, video_duration)

        # Attach audio to video
        video_with_audio = video_clip.set_audio(final_audio)

        # Write the merged output
        output_filename = f"../Storage/Audio_Video/merged_video_{segment_number}.mp4"
        video_with_audio.write_videofile(output_filename, codec="libx264", audio_codec="aac")

        # Close resources
        video_clip.close()
        audio_clip.close()

        # Store the final merged file path
        merged_files.append(output_filename)
        print(f"Merged segment {segment_number} saved as {output_filename}")

    print("All merged video files:", merged_files)
    return merged_files

def merge_final_videos(merged_files):
    loaded_files = [VideoFileClip(video) for video in merged_files]

    # Concatenate all the video clips into one final video.
    final_video = concatenate_videoclips(loaded_files, method="compose")

    # Write the final concatenated video to a file.
    final_video_path="../Storage/Final_Video/video_final.mp4"
    final_video.write_videofile(final_video_path, codec="libx264", audio_codec="aac")

    # Optionally, close each clip to free resources.
    for clip in loaded_files:
        clip.close()
    return final_video_path

def merge_videos(speech_files, video_files):
    merged_files=merge_audio_video(speech_files, video_files)
    final_video_path=merge_final_videos(merged_files)
    return {"Video_list": merged_files, "Merged_Video": final_video_path}
