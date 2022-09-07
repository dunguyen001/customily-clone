import Konva from "konva";
import React, { useEffect } from "react";
import canvasStore, { ACTIONS } from "../stores/Canvas";
import ImageViewer from "./ImageViewer";

interface IProps {
  // children: React.ReactNode;
}

const Background: React.FC<IProps> = (props) => {
  const WIDTH = 400;
  const HEIGHT = 485;
  useEffect(() => {
    canvasStore.dispatch(ACTIONS.RENDER_STAGE, {
      container: "container",
      width: 180,
      height: 250,
    });
  }, []);
  return (
    <div
      id="product-background"
      className="w-full h-full flex justify-center items-center bg-gray-200 relative"
      style={{
        backgroundImage: "url('/gildan-ultra-cotton-t-shirt-irish-green-front-1658247198.jpeg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: WIDTH,
        height: HEIGHT,
      }}
    >
      <ImageViewer imageBuffer={""}/>
    </div>
  );
};

export default Background;
