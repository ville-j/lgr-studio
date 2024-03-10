import styled from "styled-components";
import { PictureData } from "elmajs";
import { AppState } from "../types";
import PCXThumbnail from "./PCXThumbnail";

const ListItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  &:focus {
    background: rgba(255, 255, 255, 0.05);
  }
  ${({ selected }) =>
    selected &&
    `background: rgba(255, 255, 255, 0.1) !important; color: #d3d3d3`}
`;

const PCXList = ({
  pcxData,
  selectPicture,
  appState,
}: {
  pcxData: PictureData[];
  selectPicture: (name: string) => void;
  appState: AppState;
}) => {
  return (
    <div>
      {pcxData.map((pcx) => (
        <ListItem
          role="button"
          tabIndex={0}
          key={pcx.name}
          onClick={(e) => {
            e.currentTarget.focus();
            selectPicture(pcx.name);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              selectPicture(pcx.name);
            }
          }}
          selected={appState.selectedImage === pcx.name}
        >
          <PCXThumbnail pictureData={pcx} />
          <div style={{ padding: "4px 8px" }}>{pcx.name}</div>
        </ListItem>
      ))}
    </div>
  );
};

export default PCXList;
