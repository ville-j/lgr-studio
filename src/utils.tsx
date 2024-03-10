import JSZip from "jszip";
import { Buffer } from "buffer/";

export const downloadData = async (
  data: Uint8Array | Uint8Array[] | Buffer | Buffer[],
  savename: string,
  filenames = [] as string[]
) => {
  const blob =
    data instanceof Uint8Array || data instanceof Buffer
      ? new Blob([data], {
          type: "application/octet-stream",
        })
      : await (async () => {
          const jszip = new JSZip();

          data.forEach((file, i) => {
            jszip.file(filenames[i] ?? "file" + i, file);
          });
          return jszip.generateAsync({ type: "blob" });
        })();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = savename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const genid = (length = 16) => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }
  return randomId;
};

export const imageDataToImage = (
  imagedata: ImageData
): Promise<HTMLImageElement> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imagedata.width;
  canvas.height = imagedata.height;
  ctx?.putImageData(imagedata, 0, 0);

  return new Promise((resolve) => {
    const image = new Image();
    image.src = canvas.toDataURL();
    image.onload = () => {
      resolve(image);
    };
  });
};
