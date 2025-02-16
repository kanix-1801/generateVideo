import React, { useState } from 'react';
import axios from 'axios';

const VideoSetting = ({ setCurrentStep, script }) => {
    const [quality, setQuality] = useState('hd');
    const [format, setFormat] = useState('mp4');
    const [language, setLanguage] = useState('english');
    const [voice, setVoice] = useState('male');

    const VideoSettingHandler = async () => {

        const formData = new FormData();
        formData.append("script", script);
        formData.append("voice", language);
        formData.append("language", voice);

        // call api and generate video
        const response = await axios.post(
            `local/generate-video`,
            formData
            // , {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //         Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            //     },
            // }
        );

        console.log("Video Generation Response:", response.data);

        if (response.data && response.data.videos) {
            const { Merged_Video, Video_list } = response.data.videos;
            console.log("Merged Video:", Merged_Video);
            console.log("Video List:", Video_list);
        }

        const clipsCount = response.data.videos?.Video_list?.length || 1;
        if (clipsCount > 1) {
            setCurrentStep(3);
        } else {
            setCurrentStep(4);
        }
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
                            }} value="english">English</option>
                            <option style={{
                                backgroundColor: '#000927'
                            }} value="spanish">Hindi</option>
                            {/* <option value="french">French</option> */}
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
        </div >
    </>)
}
export default VideoSetting;