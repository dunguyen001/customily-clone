import Konva from "konva";
import React, { useContext, useEffect, useState } from "react";
import { ACTIONS, CanvasContext } from "../stores/CanvasContext";
interface IProps {
  imageBuffer: string | any;
}

const ImageViewer: React.FC<IProps> = (props) => {
  const canvasContext = useContext(CanvasContext);
  
  const handlerDownload = () => {
    const { stage, transformer } = canvasContext.state;
    transformer?.nodes([])
    const dataURL = stage?.toDataURL({ pixelRatio: 9 });

    if (dataURL) {
      downloadURI(dataURL, "image.png");
    }
  };

  function downloadURI(uri: string, name: string) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className="">
      <div
        id="container"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(110px, 120px)`,
          border: "4px dotted red",
        }}
      />
      <button onClick={handlerDownload} className="absolute bottom-0">
        Download image
      </button>
    </div>
  );
};

export default ImageViewer;
