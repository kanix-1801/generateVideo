import React, { useState } from 'react';

const VideoSetting = ({ setCurrentStep }) => {
    const [quality, setQuality] = useState('hd');
    const [format, setFormat] = useState('mp4');
    const [language, setLanguage] = useState('english');
    const [voice, setVoice] = useState('male');

    const VideoSettingHandler = () => {

        // call api and generate video
        const chipsCount = 3;
        if (chipsCount > 1) {
            // send the chips to next one
            setCurrentStep(3);
        } else {
            // first get the video and then send it to the next one
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
                                value="hd">HD</option>
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
                            {/* <option value="mov">MOV</option>
                            <option value="avi">AVI</option> */}
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