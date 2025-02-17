import { useState } from "react";
import VideoGenerationHeader from "./components/VideoGenerationHeader";
import ScriptInput from "./components/ScriptInput";
import VideoSetting from "./components/VideoSetting";
import CombineClips from "./components/CombineClips";
import PreviewAndDownload from "./components/PreviewAndDownload";

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [script, setScript] = useState("");
  const [VideoList , setVideolist] = useState([]);
  const [MergedVideo , setMergedVideo] = useState("");
  const [ImgFile , setImgFile] = useState("");

  const steps = [
    { label: 'Enter File Or Write Script' },
    { label: 'Video And Audio Setting' },
    { label: 'Combine Clips' },
    { label: 'Preview and Download' }
  ];

  return (<>
    <div className="generate-video-container">
      <VideoGenerationHeader
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        steps={steps}
        processWidth={(currentStep - 1) / (steps.length - 1) * 100}
      />

      {currentStep === 1 && (<>
        <ScriptInput
          setCurrentStep={setCurrentStep}
          setScript={setScript}
          setImgFile={setImgFile}
        />
      </>)}
      {currentStep === 2 && (<>
      <VideoSetting setCurrentStep={setCurrentStep}
      script={script}
      setVideolist={setVideolist}
      setMergedVideo={setMergedVideo}
      ImgFile = {ImgFile}
      />
      </>)}
      {currentStep === 3 && (<><CombineClips setCurrentStep={setCurrentStep} VideoList={VideoList}/></>)}
      {currentStep === 4 && (<><PreviewAndDownload MergedVideo={MergedVideo}/></>)}
    </div>
  </>
  );
};

export default App;
