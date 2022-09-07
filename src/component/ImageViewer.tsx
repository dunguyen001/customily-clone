import React, { useEffect, useState } from "react";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import canvasStore, { ACTIONS } from "../stores/Canvas";

interface IProps {
  imageBuffer: string | any;
}

const ImageViewer: React.FC<IProps> = (props) => {
  // const [stage, setStage] = useState<Stage>();
  // const [layer, setLayer] = useState(new Konva.Layer());
  const canvasState = canvasStore.initialState;
  useEffect(() => {
    console.log("canvasState.stage", canvasState.stage)
  }, [canvasState.stage])

  // useEffect(() => {



  //   const stage = new Konva.Stage({
  //     container: "container",
  //     width: 180,
  //     height: 250,
  //   });

  //   setStage(stage);
  //   return () => {
  //     console.log("Clean up");
  //     setStage(undefined);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (stage) {
  //     stage.add(layer);

  //     addAsset(props.imageBuffer);

  //     const tr = new Konva.Transformer({
  //       // keepRatio: true,
  //     });
  //     layer.add(tr);

  //     var selectionRectangle = new Konva.Rect({
  //       fill: "rgba(0,0,255,0.5)",
  //       visible: false,
  //     });
  //     layer.add(selectionRectangle);

  //     let x1: any, y1: any, x2: any, y2: any;
  //     stage.on("mousedown touchstart", (e) => {
  //       // do nothing if we mousedown on any shape
  //       if (e.target !== stage) {
  //         return;
  //       }
  //       e.evt.preventDefault();
  //       x1 = stage.getPointerPosition()?.x;
  //       y1 = stage.getPointerPosition()?.y;
  //       x2 = stage.getPointerPosition()?.x;
  //       y2 = stage.getPointerPosition()?.y;

  //       selectionRectangle.visible(true);
  //       selectionRectangle.width(0);
  //       selectionRectangle.height(0);
  //     });

  //     stage.on("mousemove touchmove", (e) => {
  //       // do nothing if we didn't start selection
  //       if (!selectionRectangle.visible()) {
  //         return;
  //       }
  //       e.evt.preventDefault();
  //       x2 = stage.getPointerPosition()?.x;
  //       y2 = stage.getPointerPosition()?.y;

  //       selectionRectangle.setAttrs({
  //         x: Math.min(x1, x2),
  //         y: Math.min(y1, y2),
  //         width: Math.abs(x2 - x1),
  //         height: Math.abs(y2 - y1),
  //       });
  //     });

  //     stage.on("mouseup touchend", (e) => {
  //       if (!selectionRectangle.visible()) {
  //         return;
  //       }
  //       e.evt.preventDefault();
  //       setTimeout(() => {
  //         selectionRectangle.visible(false);
  //       });

  //       var shapes = stage.find(".asset");
  //       var box = selectionRectangle.getClientRect();
  //       var selected = shapes.filter((shape) =>
  //         Konva.Util.haveIntersection(box, shape.getClientRect())
  //       );
  //       tr.nodes(selected);
  //     });

  //     stage.on("click tap", function (e) {
  //       if (!e.target.hasName("asset")) {
  //         return;
  //       }
  //       if (selectionRectangle.visible()) {
  //         return;
  //       }
  //       if (e.target === stage) {
  //         tr.nodes([]);
  //         return;
  //       }
  //       const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  //       const isSelected = tr.nodes().indexOf(e.target) >= 0;
  //       if (!metaPressed && !isSelected) {
  //         tr.nodes([e.target]);
  //       } else if (metaPressed && isSelected) {
  //         const nodes = tr.nodes().slice();
  //         nodes.splice(nodes.indexOf(e.target), 1);
  //         tr.nodes(nodes);
  //       } else if (metaPressed && !isSelected) {
  //         // add the node into selection
  //         const nodes = tr.nodes().concat([e.target]);
  //         tr.nodes(nodes);
  //       }
  //     });
  //   }
  //   return () => {
  //     setLayer(new Konva.Layer());
  //   };
  // }, [stage]);

  // const addAsset = (imgBuffer: string) => {
  //   const imageObj1 = new Image();
  //   imageObj1.src = imgBuffer;
  //   console.log(layer.scaleX())
  //   console.log(layer.scaleY())
  //   const layerImg = new Konva.Image({
  //     image: imageObj1,
  //     width: 100,
  //     height: 100,
  //     x: 10,
  //     y: 10,
  //     name: "asset",
  //     draggable: true,
  //   });
  //   layer.add(layerImg);
  // };

  const handlerDownload = () => {
    //scale
    // const stageClone = stage?.clone();
    // const scale = containerWidth / sceneWidth;
    // console.log(scale)
    // console.log(sceneWidth * scale, sceneHeight * scale)
    // stageClone?.width(sceneWidth * scale);
    // stageClone?.height(sceneHeight * scale);
    // stageClone?.scale({ x: scale, y: scale });
    // const dataURL = stageClone?.toDataURL({ pixelRatio: 3 });
    // if (dataURL) {
    //   downloadURI(dataURL, "image.png");
    // }
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
          position: 'absolute',
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
