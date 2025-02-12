import React from 'react';
// import { FaArrowLeft } from 'react-icons/fa'; // Import back arrow icon

const VideoGenerationHeader = ({ currentStep, setCurrentStep, steps, progressWidth }) => {
    return (
        <div className="header-container">
            <div className="header-top">
                {currentStep > 1 && (
                    <button
                        // className="back-button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                    >
                        {/* <FaArrowLeft className="back-icon" /> */}
                        back
                    </button>
                )}
                <h1 className="heading">Generate Video</h1>
            </div>

            <p className="subheading">
                Transform Your Documents And Text Into Professional Videos
            </p>

            <div className="status-container">
                <div
                    className="progress-line"
                    style={{ width: `${progressWidth}%` }}
                ></div>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep - 1;
                    const isCurrent = index === currentStep - 1;

                    return (
                        <div
                            key={index}
                            className="status-step"
                            style={{ left: `${(index * 25) + 12.5}%` }}
                        >
                            <div
                                className="step-number"
                                style={{
                                    backgroundColor: isCompleted || isCurrent ? '#315EFF' : '#E2E2E2'
                                }}
                            >
                                <div
                                    className="step-number-inner"
                                    style={{
                                        backgroundColor: isCurrent ? '#E2E2E2' : '#FFFFFF'
                                    }}
                                ></div>
                            </div>
                            <p
                                className="step-label"
                                style={{ opacity: isCurrent ? 1 : 0.5 }}
                            >
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VideoGenerationHeader;
