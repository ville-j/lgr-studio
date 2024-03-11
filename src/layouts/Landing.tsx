import { LGR } from "elmajs";
import { useDragAndDrop } from "../hooks";
import { Buffer } from "buffer/";
import { useRef } from "react";
import { AppState, LGRData, LGRFile } from "../types";
import { genid } from "../utils";
import styled from "styled-components";

const LGRLink = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  margin: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

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

            const lgrData: LGRData = {
              pictureData: lgr.pictureData.map((pd) => ({
                name: pd.name,
                data: pd.data,
              })),
              pictureList: lgr.pictureList.map((pl) => ({
                name: pl.name,
                pictureType: pl.pictureType,
                distance: pl.distance,
                clipping: pl.clipping,
                transparency: pl.transparency,
              })),
            };

            loadLGR({
              id: genid(),
              file: file,
              name: file.name,
              comment: "",
              data: lgrData,
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
        flexDirection: "column",
      }}
    >
      {appState.lgrs.length < 1 && (
        <div
          style={{
            fontSize: "3rem",
            opacity: 0.2,
          }}
        >
          Drag and drop LGR files here
        </div>
      )}
      <div style={{ minWidth: 400 }}>
        {appState.lgrs.map((lgr) => (
          <LGRLink
            key={lgr.id}
            onClick={() => {
              selectLGR(lgr.id);
            }}
          >
            <div>{lgr.name}</div>
          </LGRLink>
        ))}
        {appState.lgrs.length > 0 && (
          <div style={{ opacity: 0.5, textAlign: "right", padding: 4 }}>
            Drag and drop more LGR files
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
