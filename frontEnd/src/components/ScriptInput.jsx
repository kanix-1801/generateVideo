import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import axios from 'axios';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ScriptInput = ({ setCurrentStep, setScript , setImgFile }) => {
  const [activeToggle, setActiveToggle] = React.useState("docs");
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = useState([]);
  const [input, setInput] = useState("");
  const [localScript, setlocalScript] = useState("");
  const [loading, setLoading] = useState(false);
  // image
  const [imgFiles, setImgFiles] = useState([]);
  // const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const [isDraggingImg, setIsDraggingImg] = useState(false);

  const handleFilesUpload = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = [...e.dataTransfer.files];
    handleFilesUpload(newFiles);
  };

  const handleDragOverImg = (event) => {
    event.preventDefault();
    setIsDraggingImg(true);
  };

  const handleDragLeaveImg = () => {
    setIsDraggingImg(false);
  };

  const handleDropImg = (event) => {
    event.preventDefault();
    setIsDraggingImg(false);
    setImgFiles([...imgFiles, ...event.dataTransfer.files]);
  };

  const handleFileChange = (e) => {
    const newFiles = [...e.target.files];
    handleFilesUpload(newFiles);
  };

  const handleFileChangeImg = (event) => {
    setImgFiles([...imgFiles, ...event.target.files]);
  };

  // get script from the user
  const handleScriptGenerate = async () => {
    // if (activeToggle === "docs" && files.length === 0 && input.trim() === "") {
    //   console.log("Please upload at least one document or provide instructions");
    //   return;
    // }
    setLoading(true);
    console.log("Files:", files);
    const formData = new FormData();
    formData.append("data", JSON.stringify({ "endpoint": "generate_script", "event": { "instructions": input}}));
    // formData.append("instructions", input);
  if (files[0]) {
    formData.append("file", files[0]);
  }
  console.log("Form Data:", formData);
  console.log("Files:", files);

  try {
    console.log("Sending request...");
    const response = await axios.post("http://127.0.0.1:5000/generate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Response:", response.data);
    setImgFile(imgFiles[0]);
    setlocalScript(response.data.response);
    console.log("Response:", response.data.response);
    setActiveToggle("script");
  }

    // const payload = {
    //   endpoint: "generate_script",
    //   event: {
    //     instructions: input,
    //     pdf_path: files[0],
    //   },
    // };

    // try {
    //   const response = await axios.post("http://127.0.0.1:5000/generate", payload, {
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   setlocalScript(response.data.response);
    //   console.log("Response:", response.data);
    //   setActiveToggle("script");
    // }
     catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };
  

  // sand the script to the next step
  const handleGenerate = () => {
    if (activeToggle === "script" && !localScript.trim()) {
      alert("Please enter a script");
      return;
    }

    setScript(localScript);
    setCurrentStep(2);
  };

  const calculateVideoLength = (text) => {
    const characters = text.length;
    const totalSeconds = Math.floor(characters / 40); // Assuming 15 characters per second
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <>
      <div className="content-container">
        <div className="toggle-container">
          <button
            className="toggle-button"
            onClick={() => setActiveToggle("docs")}
            style={{
              backgroundColor: activeToggle === "docs" ? "#000927" : "#000927",
              color: activeToggle === "docs" ? "#315EFF" : "#E2E2E2",
              border:
                activeToggle === "docs"
                  ? "1px solid #315EFF"
                  : "1px solid #E2E2E2",
            }}
          >
            Upload document & Generate Script
          </button>
          <button
            className="toggle-button"
            onClick={() => setActiveToggle("script")}
            style={{
              backgroundColor:
                activeToggle === "script" ? "#000927" : "#000927",
              color: activeToggle === "script" ? "#315EFF" : "#E2E2E2",
              border:
                activeToggle === "script"
                  ? "1px solid #315EFF"
                  : "1px solid #E2E2E2",
            }}
          >
            Enter Script & Generate Video
          </button>
        </div>

        <div className="input-containers">
          {activeToggle === "docs" ? (
            <div>
              <h1 className="input-containers-heading">
                Upload Documents & Images For Generate Script
              </h1>
              <div className="upload-sections">
                <div
                  className={`upload-container ${isDragging ? "dragging" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="upload-doc"
                    hidden
                    multiple
                    accept=".pdf,.docx,.pptx"
                    onChange={handleFileChange}
                  />
                  {/* <span className="upload-icon"> */}
                  <IoMdCloudUpload size={60} color="#315EFF" />
                  {/* </span> */}
                  <label htmlFor="upload-doc" className="upload-label">
                    {files.length > 0
                      ? `Uploaded ${files.length} file${files.length > 1 ? "s" : ""
                      }`
                      : "Drag and drop documents here, or browse"}
                  </label>
                  <div className="file-list">
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        {file.name}
                      </div>
                    ))}
                  </div>
                  <p className="upload-hint">
                    Supported formats: PDF
                  </p>
                </div>

                {/* Image Upload Section */}
                <div
                  className={`upload-container ${isDraggingImg ? "dragging" : ""
                    }`}
                  onDragOver={handleDragOverImg}
                  onDragLeave={handleDragLeaveImg}
                  onDrop={handleDropImg}
                >
                  <input
                    type="file"
                    id="upload-img"
                    hidden
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChangeImg}
                  />
                  <IoMdCloudUpload size={60} color="#FF5733" />
                  <label htmlFor="upload-img" className="upload-label">
                    {imgFiles.length > 0
                      ? `Uploaded ${imgFiles.length} image${imgFiles.length > 1 ? "s" : ""
                      }`
                      : "Drag and drop reference images here, or browse"}
                  </label>
                  <div className="file-list">
                    {imgFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        {file.name}
                      </div>
                    ))}
                  </div>
                  <p className="upload-hint">Supported: PNG, JPG, JPEG</p>
                </div>
              </div>
              <input
                type="text"
                // value={script}
                onChange={(e) => setInput(e.target.value)}
                className="text-input"
                placeholder="Enter your instructions for the AI..."
              />
              <button
                className="generate-button"
                onClick={handleScriptGenerate}
              >
                Generate Script
              </button>
              {loading &&
            <div className="loader_div">
              <div className="loader"></div>
              </div>
            }
            </div>
          ) : (
            <div>
              <h1 className="input-containers-heading">Script Editor</h1>
              <textarea
                value={localScript}
                onChange={(e) => setlocalScript(e.target.value)}
                placeholder="Your script will appear here..."
                className="script-textarea"
              />
              <div className="script-info-container">
                <span className="character-count">
                  Characters: {localScript.length}/5000
                </span>
                <span className="video-length">
                  Estimated video length: {calculateVideoLength(localScript)}
                </span>

              </div>

              <button className="generate-button" onClick={handleGenerate}>
                submit script
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScriptInput;
