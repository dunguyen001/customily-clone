import React, { useEffect, useState } from "react";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";

interface IProps {
  imageBuffer: string | any;
}

const ImageViewer: React.FC<IProps> = (props) => {
  const [stage, setStage] = useState<Stage>();
  const [layer, setLayer] = useState(new Konva.Layer());

  useEffect(() => {
    const stage = new Konva.Stage({
      container: "container",
      width: 400,
      height: 450,
    });
    setStage(stage);
    return () => {
      console.log("Clean up");
      setStage(undefined);
    };
  }, []);

  useEffect(() => {
    if (stage) {
      stage.add(layer);

      // append asset
      addBackground()


      const designArea = new Konva.Group({
        width: 200,
        height: 300,
        x: 100,
        y: 100,
      });
      const designAreaBoder = new Konva.Rect({
        width: 150,
        height: 230,
        x: (200 - 150) / 2,
        y: (300 - 230) / 2.5,
        stroke: 'black',
        strokeWidth: 1,
      })
      const imageObj1 = new Image();
      imageObj1.src = props.imageBuffer;
      const layerImg = new Konva.Image({
        image: imageObj1,
        width: 100,
        height: 100,
        x: (200 - 150) / 2 + 10,
        y: (300 - 230) / 2.5 + 10,
        name: "asset",
        draggable: true,
      });

      layerImg.on('dragmove', (e) => {

        const pos = layerImg.absolutePosition();
        const { x, y } = designAreaBoder.absolutePosition();
        const rad = designAreaBoder.rotation();
        const width = designAreaBoder.width();
        console.log(rad)
        const height = designAreaBoder.height();

        const p1 = getCorner(x, y, 0, 0, rad);
        const p2 = getCorner(x, y, width, 0, rad);
        const p3 = getCorner(x, y, width, height, rad);
        const p4 = getCorner(x, y, 0, height, rad);

        const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
        const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
        const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
        const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
        // console.log(minX, maxX)
        // const isBreakX = (pos.x + layerImg.width()) >= maxX || (pos.x) <= minX;
        // const isBreakY = (pos.y + layerImg.height()) >= maxY || (pos.y) <= minY;
        // console.log(pos.x + layerImg.width())
        if ((pos.x + layerImg.width()) >= maxX) {
          // layerImg.x(maxX - 1)
          console.log(pos.x, maxX)
          // layerImg.x(274)
          // layerImg.x(maxX - 1)
        } else if ((pos.x) <= minX) {
          // layerImg.x(minX + 1)
        }
        if ((pos.y + layerImg.height()) >= maxY) {
          // layerImg.y(maxY - 1)
        } else if ((pos.y) <= minY) {
          // layerImg.y(minY + 1)
        }
      })
      designArea.add(designAreaBoder).add(layerImg);
      layer.add(designArea)
      // addAsset(props.imageBuffer);

      const tr = new Konva.Transformer();
      layer.add(tr);

      var selectionRectangle = new Konva.Rect({
        fill: "rgba(0,0,255,0.5)",
        visible: false,
      });
      layer.add(selectionRectangle);

      let x1: any, y1: any, x2: any, y2: any;
      stage.on("mousedown touchstart", (e) => {
        // do nothing if we mousedown on any shape
        if (e.target !== stage) {
          return;
        }
        e.evt.preventDefault();
        x1 = stage.getPointerPosition()?.x;
        y1 = stage.getPointerPosition()?.y;
        x2 = stage.getPointerPosition()?.x;
        y2 = stage.getPointerPosition()?.y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
      });

      stage.on("mousemove touchmove", (e) => {
        // do nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        e.evt.preventDefault();
        x2 = stage.getPointerPosition()?.x;
        y2 = stage.getPointerPosition()?.y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
      });

      stage.on("mouseup touchend", (e) => {
        if (!selectionRectangle.visible()) {
          return;
        }
        e.evt.preventDefault();
        setTimeout(() => {
          selectionRectangle.visible(false);
        });

        var shapes = stage.find(".asset");
        var box = selectionRectangle.getClientRect();
        var selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr.nodes(selected);
      });

      stage.on("click tap", function (e) {
        if (!e.target.hasName("asset")) {
          return;
        }
        if (selectionRectangle.visible()) {
          return;
        }
        if (e.target === stage) {
          tr.nodes([]);
          return;
        }
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;
        if (!metaPressed && !isSelected) {
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          const nodes = tr.nodes().slice();
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);
        }
      });
    }
    return () => {
      setLayer(new Konva.Layer());
    };
  }, [stage]);

  const addAsset = (imgBuffer: string) => {
    const imageObj1 = new Image();
    imageObj1.src = imgBuffer;
    const layerImg = new Konva.Image({
      image: imageObj1,
      width: 100,
      height: 100,
      x: 10,
      y: 10,
      name: "asset",
      draggable: true,
    });
    layer.add(layerImg);
  };

  const addBackground = () => {
    const imageObj = new Image();
    imageObj.src = '/gildan-ultra-cotton-t-shirt-irish-green-front-1658247198.jpeg';
    const layerImg = new Konva.Image({
      image: imageObj,
      width: 400,
      height: 450,
      x: 0,
      y: 0,
      name: "background",
    });
    layer.add(layerImg)
  }
  const handlerDownload = () => {
    const dataURL = stage?.toDataURL({ pixelRatio: 3 });
    if (dataURL) {
      downloadURI(dataURL, 'image.png');
    }
  }

  function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getCorner(pivotX: number, pivotY: number, diffX: number, diffY: number, angle: number) {
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    /// find angle from pivot to corner
    angle += Math.atan2(diffY, diffX);

    /// get new x and y and round it off to integer
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);

    return { x: x, y: y };
  }
  return (
    <div>
      <div id="container"/>
      <button onClick={handlerDownload} className="absolute bottom-0">Download image</button>
    </div>
  );
};

export default ImageViewer;
