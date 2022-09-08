import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import Background from "./component/Background";
import { ACTIONS, CanvasContext } from "./stores/CanvasContext";

// const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
//   const byteCharacters = b64Data;
//   const byteArrays = [];

//   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     const slice = byteCharacters.slice(offset, offset + sliceSize);

//     const byteNumbers = new Array(slice.length);
//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }

//   const blob = new Blob(byteArrays, {type: contentType});
//   return blob;
// }

function App() {
  const [stageOpts, setStageOpts] = useState({
    container: 'container',
    width: 180,
    height: 250,
  })
  const [asset, setAsset] = useState<any>()
  const WIDTH = 400;
  const HEIGHT = 485;
  const canvasContext = useContext(CanvasContext);

  useEffect(() => {
    canvasContext.dispatch({
      type: ACTIONS.RENDER_STAGE,
      payload: stageOpts,
    });
  }, []);

  useEffect(() => {
    const { stage } = canvasContext.state;
    stage?.on("click tap", (e: KonvaEventObject<any>) => {
      if (e.target instanceof Konva.Image) {
        if (e.target.name() === 'asset' && !asset) {
          // console.log("OK", e.target)
          setAsset(e.target.toObject().attrs)
        }
      }
    });
    return () => {
      console.log(ACTIONS.RESET)
      canvasContext.dispatch({
        type: ACTIONS.RESET,
      })
    }
  }, [canvasContext.state?.stage]);

  const handlerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        canvasContext.dispatch({
          type: ACTIONS.UPLOAD_ASSET,
          payload: {
            buffer: event.target.result,
            width: 100,
            height: 100,
            x: 10,
            y: 10,
            name: "asset",
            id: Date.now(),
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlerDisableTransformer = () => {
    const { stage, selectionRectangle, transformer } = canvasContext.state;
    // console.log(transformer.nodes());
    // transformer.nodes([]);
    // stage.width(500)
  };

  const handleUpdateAsset = (asset: any) => {
    const { stage, selectionRectangle, transformer } = canvasContext.state;
    const sta = stage as Konva.Stage
    const shape = sta.find('.asset').find(s => s.id() === asset.id);
    console.log(asset)
    shape?.x(asset.x);
    shape?.y(asset.y);
    shape?.scaleX(asset.scaleX);
    shape?.scaleY(asset.scaleY);

    setAsset(asset);
  }
  return (
    <div className="p-2">
      <div className="flex">
        <div className="w-3/5" style={{ height: "60vh" }}>
          <Background width={WIDTH} height={HEIGHT} />
        </div>
        <div className="w-2/5">
          <input onChange={handlerUpload} type={"file"} />

          <div className="flex flex-col">
            <div className="px-2 py-2">Transform:</div>
            <div className="flex flex-col px-2">
              <div className="p-2 border-2 border-gray-300">
                <div>Width:</div>
                <div><input className="border-gray-300 w-full" type='number' value={asset ? asset.width * (asset.scaleX || 1) : 0} onChange={(e) => handleUpdateAsset({...asset, scaleX: Number(e.target.value) / asset.width })}/></div>
              </div>
              <div className="p-2 border-2 border-gray-300">
                <div>Height:</div>
                <div><input className="border-gray-300 w-full" type='number' value={asset ? asset.height * (asset.scaleY || 1) : 0} onChange={(e) => handleUpdateAsset({...asset, scaleY: Number(e.target.value) / asset.height })}/></div>
              </div>
              <div className="p-2 border-2 border-gray-300">
                <div>X:</div>
                <div><input className="border-gray-300 w-full" type='number' value={asset ? asset.x : 0} onChange={(e) => handleUpdateAsset({...asset, x: Number(e.target.value)})}/></div>
              </div>
              <div className="p-2 border-2 border-gray-300">
                <div>Y:</div>
                <div><input className="border-gray-300 w-full" type='number' value={asset ? asset.y : 0} onChange={(e) => handleUpdateAsset({...asset, y: Number(e.target.value)})}/></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
