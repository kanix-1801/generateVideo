import React, { useState } from "react";

const CombineClips = ({ setCurrentStep , VideoList}) => {
  // const [videoClips, setVideoClips] = useState(VideoList);

  return (
    <div className="combine-container">
      <div className="combine-header">
        <h3 className="combine-heading">Video Clips</h3>
        <button className="combine-button" onClick={() => setCurrentStep(4)}>
          Combine All Clips
        </button>
      </div>

      <div className="clips-grid">
        {VideoList.map((clip) => (
          <div key={clip.id} className="clip-container">
            <video
              className="video-preview"
              controls
              src={clip.videoUrl}
              style={{ width: "100%", height: "auto" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombineClips;
