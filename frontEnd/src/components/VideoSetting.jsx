import React, { useState } from 'react';
import axios from 'axios';

const VideoSetting = ({ setCurrentStep, script, setVideolist, setMergedVideo, ImgFile }) => {
    const [quality, setQuality] = useState('hd');
    const [format, setFormat] = useState('mp4');
    const [language, setLanguage] = useState('English');
    const [voice, setVoice] = useState('male');
    const [loading, setLoading] = useState(false);
    // const [Video_list , setVideo_list] = useState([]);
//   const [Merged_Video , setMerged_Video] = useState("");

    const VideoSettingHandler = async () => {
        console.log("Video Setting Handler");
        // setVideolist([
        //     { id: 1, videoUrl: "Recording 2025-02-01 090617.mp4" },
        //     { id: 2, videoUrl: "Recording 2025-02-01 090617.mp4" },
        // ]);
        // setMergedVideo("Recording 2025-02-01 090617.mp4");
        // setCurrentStep(4);
        setLoading(true);
        const payload = {
            endpoint: "generate_video",
            event: {
                script: script,
                voice : voice,
                language : language,
            },
          };
          console.log("Payload:", payload);
          console.log("ImgFile:", ImgFile);
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));
        formData.append("file", ImgFile);
        console.log("Form Data:", formData);
        
          try {
            const response = await axios.post("http://127.0.0.1:5000/generate", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Response:", response);
            // (response.data.response);
            const Video_list = response.data.response.Video_list;
            const Merged_Video = response.data.response.Merged_Video;
            setVideolist(Video_list);
           
            setMergedVideo(Merged_Video);
            console.log("Response:", response.data);

            if (Video_list.length > 1) {
                setCurrentStep(3);
            } else {
                setCurrentStep(4);
            }
            // console.log("Merged Video:", Merged_Video);
            // console.log("Video List:", Video_list);

          } catch (error) {
            console.error("Error:", error);
          }
          setLoading(false);
    }

    return (<>
        <div className="settings-container">
            <div className="settings-section">
                <h4 className="settings-heading">Video Generation</h4>
                <div className="settings-row">
                    <div className="input-group">
                        <label>Quality</label>
                        <select
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                            className="settings-input"
                        >
                            <option style={{
                                backgroundColor: '#000927'
                            }}
                                value="hd">720p</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="settings-input wide-input"
                        >
                            <option style={{
                                backgroundColor: '#000927'
                            }} value="mp4">MP4</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Audio Generation Section */}
            <div className="settings-section">
                <h4 className="settings-heading">Audio Generation</h4>
                <div className="settings-row">
                    <div className="input-group">
                        <label>Choose Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="settings-input"
                        >
                            <option style={{
                                backgroundColor: '#000927'
                            }} value="English">English</option>
                            <option style={{
                                backgroundColor: '#000927'
                            }} value="Hindi">Hindi</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Audio Voice</label>
                        <select
                            value={voice}
                            onChange={(e) => setVoice(e.target.value)}
                            className="settings-input"
                        >
                            <option style={{
                                backgroundColor: '#000927'
                            }} value="male">Male</option>
                            <option
                                style={{
                                    backgroundColor: '#000927'
                                }} value="female">Female</option>
                            {/* <option value="neutral">Neutral</option> */}
                        </select>
                    </div>
                </div>
            </div>
            <button onClick={VideoSettingHandler} className="generate-button">
                Generate Video
            </button>
            {loading &&
            <div className="loader_div">
              <div className="loader"></div>
              </div>
            }
        </div >
    </>)
}
export default VideoSetting;