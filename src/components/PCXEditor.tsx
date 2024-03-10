import { useLayoutEffect, useRef } from "react";
import { PCXData } from "../types";
import { downloadData, imageDataToImage } from "../utils";
import styled from "styled-components";
import Button from "./Button";

const ToolBar = styled.div`
  display: flex;
  height: 36px;
  border-bottom: 1px solid #070708;
  box-sizing: border-box;
  background: #151418;
  > * {
    padding: 8px;
  }
  align-items: stretch;
`;

const scale = 1;

const PCXEditor = ({ data }: { data: PCXData }) => {
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

  const draw = (picture: HTMLImageElement, x = 0, y = 0) => {
    if (!picture || !canvas.current || !context.current)
      throw new Error("no canvas found");

    context.current.clearRect(
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );

    context.current.save();
    context.current.scale(scale, scale);
    context.current.drawImage(picture, Math.round(x), Math.round(y));
    context.current.restore();
  };

  useLayoutEffect(() => {
    initialise();
  }, []);

  useLayoutEffect(() => {
    const fn = () => {
      initialise();

      if (image.current) {
        draw(image.current, offset.current.x, offset.current.y);
      }
    };
    window.addEventListener("resize", fn);
    return () => {
      window.removeEventListener("resize", fn);
    };
  });

  useLayoutEffect(() => {
    // create image from pcx data
    const imgdata = context.current?.createImageData(data.width, data.height);
    if (imgdata) {
      imgdata.data.set(data.pixelArray);
      imageDataToImage(imgdata).then((val) => {
        image.current = val;
        offset.current = {
          x: ((canvas.current?.width ?? 0) * 0.5) / scale - val.width / 2,
          y: ((canvas.current?.height ?? 0) * 0.5) / scale - val.height / 2,
        };
        draw(val, offset.current.x, offset.current.y);
      });
    }
  }, [data]);

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
        <div>{data.filename}</div>
        <Button
          onClick={() => {
            downloadData(data.rawData, data.filename);
          }}
        >
          Export
        </Button>
      </ToolBar>
      <div ref={container} style={{ flex: 1, overflow: "hidden" }}>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};

export default PCXEditor;
