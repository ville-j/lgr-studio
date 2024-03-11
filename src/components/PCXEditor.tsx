import { useLayoutEffect, useRef } from "react";
import { LGRPictureDeclaration, PCXData } from "../types";
import { downloadData, imageDataToImage } from "../utils";
import styled from "styled-components";
import Button from "./Button";
import { useDragAndDrop } from "../hooks";
import { Buffer } from "buffer";
import Dropdown from "./Dropdown";
import { Clip, PictureType, Transparency } from "elmajs";
import Input from "./Input";

const ToolBar = styled.div`
  display: flex;
  height: 36px;
  border-bottom: 1px solid #070707;
  box-sizing: border-box;
  background: #151418;
  > * {
    padding: 8px;
  }
  align-items: stretch;
`;

const scale = 2;

const PCXEditor = ({
  data,
  setPictureData,
  selectPicture,
  deletePicture,
  setPictureDeclaration,
  renamePicture,
}: {
  data: PCXData;
  setPictureData: (name: string, data: Buffer) => void;
  selectPicture: (name: string) => void;
  deletePicture: (name: string) => void;
  setPictureDeclaration: (
    name: string,
    pictureDeclaration: LGRPictureDeclaration
  ) => void;
  renamePicture: (name: string, newName: string) => void;
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const image = useRef<HTMLImageElement>();
  const offset = useRef({ x: 1, y: 0 });

  const initialise = () => {
    if (!canvas.current || !container.current)
      throw new Error("no canvas found");

    canvas.current.width = container.current.offsetWidth;
    canvas.current.height = container.current.offsetHeight;
    context.current = canvas.current.getContext("2d");

    if (!context.current) throw new Error("no context found");
    context.current.imageSmoothingEnabled = false;
  };

  const clearCanvas = () => {
    if (canvas.current && context.current) {
      context.current.clearRect(
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
    }
  };

  const draw = (picture: HTMLImageElement, x = 0, y = 0) => {
    if (!picture || !canvas.current || !context.current)
      throw new Error("no canvas found");

    context.current.save();
    context.current.scale(scale, scale);
    context.current.drawImage(picture, Math.round(x), Math.round(y));
    context.current.restore();
  };

  useDragAndDrop(
    (files) => {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
          if (event.target?.result) {
            const buff = Buffer.from(event.target?.result as ArrayBuffer);
            setPictureData(data.filename, buff);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    container,
    ["pcx"]
  );

  useLayoutEffect(() => {
    initialise();
  }, []);

  useLayoutEffect(() => {
    const fn = () => {
      initialise();

      if (image.current) {
        clearCanvas();
        draw(image.current, offset.current.x, offset.current.y);
      }
    };
    window.addEventListener("resize", fn);
    return () => {
      window.removeEventListener("resize", fn);
    };
  });

  useLayoutEffect(() => {
    try {
      if (data.pixelArray.length > 0) {
        // create image from pcx data
        const imgdata = context.current?.createImageData(
          data.width,
          data.height
        );
        if (imgdata) {
          imgdata.data.set(data.pixelArray);
          imageDataToImage(imgdata).then((val) => {
            image.current = val;
            offset.current = {
              x: ((canvas.current?.width ?? 0) * 0.5) / scale - val.width / 2,
              y: ((canvas.current?.height ?? 0) * 0.5) / scale - val.height / 2,
            };
            clearCanvas();
            draw(val, offset.current.x, offset.current.y);
          });
        }
      } else {
        clearCanvas();
      }
    } catch (err) {
      console.log(err);
    }
  }, [data.pixelArray.join("")]);

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToolBar>
        <div>
          {data.pictureDeclaration ? (
            <Input
              label="Filename"
              value={data.pictureDeclaration?.name}
              onChange={(val) => {
                if (data.pictureDeclaration) {
                  renamePicture(data.pictureDeclaration?.name, val);
                }
              }}
            />
          ) : (
            data.filename
          )}
        </div>
        <Button
          onClick={() => {
            downloadData(data.rawData, data.filename);
          }}
        >
          Export
        </Button>
        {data.pictureDeclaration && (
          <>
            <Button
              onClick={() => {
                if (data.pictureDeclaration) {
                  deletePicture(data.pictureDeclaration.name);
                }
              }}
            >
              Delete
            </Button>
            <Dropdown
              label="Clip"
              value={data.pictureDeclaration.clipping}
              options={[
                { value: Clip.Ground, label: "Ground" },
                { value: Clip.Sky, label: "Sky" },
                { value: Clip.Unclipped, label: "Undefined" },
              ]}
              onChange={(option) => {
                if (data.pictureDeclaration) {
                  setPictureDeclaration(data.pictureDeclaration.name, {
                    ...data.pictureDeclaration,
                    clipping: option.value as Clip,
                  });
                }
              }}
            />
            <Dropdown
              label="Type"
              value={data.pictureDeclaration.pictureType}
              options={[
                { value: PictureType.Normal, label: "Normal" },
                { value: PictureType.Texture, label: "Texture" },
                { value: PictureType.Mask, label: "Mask" },
              ]}
              onChange={(option) => {
                if (data.pictureDeclaration) {
                  setPictureDeclaration(data.pictureDeclaration.name, {
                    ...data.pictureDeclaration,
                    pictureType: option.value as PictureType,
                  });
                }
              }}
            />
            <Dropdown
              label="Transp"
              value={data.pictureDeclaration.transparency}
              options={[
                { value: Transparency.TopLeft, label: "Top left" },
                { value: Transparency.TopRight, label: "Top right" },
                { value: Transparency.BottomRight, label: "Bottom right" },
                { value: Transparency.BottomLeft, label: "Bottom left" },
                { value: Transparency.Palette, label: "Palette" },
                { value: Transparency.Solid, label: "Solid" },
              ]}
              onChange={(option) => {
                if (data.pictureDeclaration) {
                  setPictureDeclaration(data.pictureDeclaration.name, {
                    ...data.pictureDeclaration,
                    transparency: option.value as Transparency,
                  });
                }
              }}
            />
            <Input
              width={30}
              label="Distance"
              value={data.pictureDeclaration.distance}
              onChange={(val) => {
                if (data.pictureDeclaration) {
                  setPictureDeclaration(data.pictureDeclaration.name, {
                    ...data.pictureDeclaration,
                    distance: parseInt(val || "0", 10),
                  });
                }
              }}
            />
          </>
        )}
        <Button
          style={{ marginLeft: "auto", padding: "0 14px" }}
          onClick={() => {
            selectPicture("");
          }}
        >
          ×
        </Button>
      </ToolBar>
      <div ref={container} style={{ flex: 1, overflow: "hidden" }}>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export default PCXEditor;
