import { PictureData } from "elmajs";
// @ts-expect-error there are no type declarations for this lib
import PCX from "pcx-js";
import { useLayoutEffect, useRef } from "react";

const PCXThumbnail = ({ pictureData }: { pictureData: PictureData }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (canvas.current) {
      const pcxO = new PCX(pictureData.data);
      const pcx = pcxO.decode();
      canvas.current.width = pcx.width;
      canvas.current.height = pcx.height;
      const context = canvas.current.getContext("2d");
      if (context) {
        const imageData = context.createImageData(pcx.width, pcx.height);
        imageData.data.set(pcx.pixelArray);
        context.putImageData(imageData, 0, 0);
      }
    }
  }, [pictureData]);

  return (
    <div
      style={{
        width: 50,
        height: 50,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvas}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
};

export default PCXThumbnail;
