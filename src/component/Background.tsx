import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Background: React.FC<IProps> = (props) => {
  return (
    <div
      id="product-background"
      className="w-full h-full flex justify-center items-center bg-gray-200 relative"
    >
      {props.children}
    </div>
  );
};

export default Background;
