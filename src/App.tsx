import { ChangeEvent } from "react";
import Background from "./component/Background";
import canvasStore, { ACTIONS } from "./stores/Canvas";

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
  const handlerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        canvasStore.dispatch(ACTIONS.UPLOAD_ASSET, {
          buffer: event.target.result,
          width: 100,
          height: 100,
          x: 10,
          y: 10,
          name: "asset",
        });
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="p-2">
      <div className="flex">
        <div className="w-3/5" style={{ height: "60vh" }}>
          <Background />
        </div>
        <div className="w-2/5">
          <input onChange={handlerUpload} type={"file"} />
        </div>
      </div>
    </div>
  );
}

export default App;
