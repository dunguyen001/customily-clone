import React, { useEffect } from "react";
import ImageViewer from "./ImageViewer";

interface IProps {
  width: number,
  height: number
}

const Background: React.FC<IProps> = ({ height, width }) => {
  return (
    <div
      id="product-background"
      className="w-full h-full flex justify-center items-center bg-gray-200 relative"
      style={{
        backgroundImage: "url('/gildan-ultra-cotton-t-shirt-irish-green-front-1658247198.jpeg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width,
        height,
      }}
    >
      <ImageViewer imageBuffer={""}/>
    </div>
  );
};

export default Background;
