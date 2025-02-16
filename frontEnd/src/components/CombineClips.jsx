import React, { useState } from "react";

const CombineClips = ({ setCurrentStep }) => {
  const [videoClips, setVideoClips] = useState([
    // { id: 1, videoUrl: '.assets' },
    // { id: 1, videoUrl: "Recording 2025-02-01 090617.mp4" },
    // { id: 2, videoUrl: "placeholder-2.mp4" },
    // { id: 3, videoUrl: "placeholder-3.mp4" },
    // { id: 4, videoUrl: "placeholder-3.mp4" },
    // { id: 5, videoUrl: "Recording 2025-02-01 090617.mp4" },
    // { id: 6, videoUrl: "placeholder-3.mp4" },
    // { id: 7, videoUrl: "placeholder-3.mp4" },
  ]);

  return (
    <div className="combine-container">
      <div className="combine-header">
        <h3 className="combine-heading">Video Clips</h3>
        <button className="combine-button" onClick={() => setCurrentStep(4)}>
          Combine All Clips
        </button>
      </div>

      <div className="clips-grid">
        {videoClips.map((clip) => (
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
