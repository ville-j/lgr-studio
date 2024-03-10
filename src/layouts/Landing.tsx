import { LGR } from "elmajs";
import { useDragAndDrop } from "../hooks";
import { Buffer } from "buffer/";
import { useRef } from "react";
import { AppState, LGRFile } from "../types";
import { genid } from "../utils";

const Landing = ({
  loadLGR,
  appState,
  selectLGR,
}: {
  loadLGR: (lgr: LGRFile) => void;
  appState: AppState;
  selectLGR: (id: string) => void;
}) => {
  const container = useRef<HTMLDivElement>(null);
  useDragAndDrop(
    (files) => {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
          if (event.target?.result) {
            const lgr = LGR.from(
              Buffer.from(event.target?.result as ArrayBuffer)
            );
            loadLGR({
              id: genid(),
              file: file,
              name: file.name,
              comment: "",
              data: lgr,
              modified: new Date(),
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    container,
    ["lgr"]
  );
  return (
    <div
      ref={container}
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        {appState.lgrs.map((lgr) => (
          <div
            key={lgr.id}
            onClick={() => {
              selectLGR(lgr.id);
            }}
          >
            <div>{lgr.name}</div>
            <div>{lgr.modified.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
