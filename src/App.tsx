import { ChangeEvent, useEffect, useState } from "react";
import Background from "./component/Background";
import ImageViewer from "./component/ImageViewer";

const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
  const byteCharacters = b64Data;
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function App() {
  const [image, setImage] = useState<any>();
  const [imageBlob, setImageBlob] = useState<any>();

  useEffect(() => {}, []);

  const handlerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target);
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        setImage(event.target.result);
        setImageBlob(b64toBlob(event.target.result as string, file.type))
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="p-2">
      <div className="flex">
        <div className="w-3/5" style={{ height: "60vh" }}>
          <Background>
            {imageBlob ? <ImageViewer imageBuffer={image}/> : ''}
          </Background>
        </div>
        <div className="w-2/5">
          <input onChange={handlerUpload} type={"file"} />
          
        </div>
      </div>
    </div>
  );
}

export default App;
