import "./App.css";
import Panel from "./components/Panel";
import Main, { Content, SideBar, TopBar, View } from "./layouts/Main";
import { useMemo, useState } from "react";
import { AppState, LGRFile, PCXData } from "./types.js";
import Palette from "./components/Palette.js";
import { downloadData } from "./utils.js";
import PCXList from "./components/PCXList.js";
import Landing from "./layouts/Landing.js";
// @ts-expect-error there are no type declarations for this lib
import PCX from "pcx-js";
import PCXEditor from "./components/PCXEditor.js";
import Button from "./components/Button.js";

const initialState: AppState = {
  lgrs: [],
  selectedLgr: "",
  selectedImage: "",
};

function App() {
  const [appState, setAppState] = useState(initialState);

  const loadLGR = (lgr: LGRFile) => {
    setAppState((state) => ({ ...state, lgrs: [...state.lgrs, lgr] }));
  };

  const selectLGR = (id: string) => {
    setAppState((state) => ({ ...state, selectedLgr: id }));
  };

  const selectPicture = (name: string) => {
    setAppState((state) => ({ ...state, selectedImage: name }));
  };

  const getSelectedLGR = () =>
    appState.lgrs.find((lgr) => lgr.id === appState.selectedLgr);

  const setPictureData = (name: string, data: Buffer) => {
    setAppState((state) => {
      const lgr = getSelectedLGR();
      const picture = lgr?.data.pictureData.find((p) => p.name === name);

      if (picture) {
        picture.data = data;
      }
      return { ...state };
    });
  };

  const deletePicture = (name: string) => {
    setAppState((state) => {
      const lgr = getSelectedLGR();
      if (lgr) {
        lgr.data.pictureData = lgr.data.pictureData.filter(
          (p) => p.name !== name
        );
        lgr.data.pictureList = lgr.data.pictureList.filter(
          (p) => p.name !== name
        );
      }
      return { ...state, selectedImage: "" };
    });
  };

  const getLGRPalette = (lgr?: LGRFile) => {
    if (!lgr) return;

    const bikePcx = lgr?.data.pictureData.find((p) => p.name === "Q1BIKE.pcx");

    if (!bikePcx) return;

    const p = new PCX(bikePcx.data);
    const pp = p.decode() as PCXData;
    return pp.palette;
  };

  const lgr = getSelectedLGR();
  const palette = useMemo(() => getLGRPalette(lgr), [lgr]);

  const topBar = (
    <TopBar>
      <Button
        style={{
          padding: "0 16px",
          textTransform: "uppercase",
          fontSize: "1rem",
          fontWeight: 800,
          color: "rgb(210, 255, 90)",
        }}
        onClick={() => {
          selectLGR("");
          selectPicture("");
        }}
      >
        <span>LGR</span> <span style={{ color: "#fff" }}>Studio</span>
      </Button>
      {lgr && (
        <>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              padding: "0 16px",
            }}
          >
            {lgr.name}
          </div>
          <Button
            onClick={() => {
              const buffer = lgr.data.toBuffer();
              downloadData(buffer, lgr.name);
            }}
            style={{
              padding: "0 16px",
            }}
          >
            Export LGR
          </Button>
          <Button
            style={{
              padding: "0 16px",
            }}
            onClick={() => {
              const data = lgr.data.pictureData.map((p) => p.data);
              const filenames = lgr.data.pictureData.map((p) => p.name);
              downloadData(data, lgr.name + ".zip", filenames);
            }}
          >
            Export as ZIP
          </Button>
        </>
      )}
    </TopBar>
  );

  if (!lgr) {
    return (
      <Main>
        {topBar}
        <Content>
          <Landing
            loadLGR={loadLGR}
            appState={appState}
            selectLGR={selectLGR}
          />
        </Content>
      </Main>
    );
  }

  const picture = lgr.data.pictureData.find(
    (p) => p.name === appState.selectedImage
  );

  if (appState.selectedImage && !picture) return <div>404</div>;

  const data = picture ? new PCX(picture.data) : null;
  const pcx =
    data && picture
      ? ({
          ...data.decode(),
          rawData: picture.data,
          filename: picture.name,
        } as PCXData)
      : null;

  return (
    <Main>
      {topBar}
      <Content>
        <SideBar>
          <Panel title="LGR palette" height={300}>
            {palette && <Palette palette={palette}></Palette>}
          </Panel>
          <Panel title="Picture palette" height={300}>
            {pcx ? (
              <Palette palette={pcx?.palette}></Palette>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No picture selected
              </div>
            )}
          </Panel>
          <Panel title="Pictures" open>
            {lgr && (
              <PCXList
                pcxData={lgr.data.pictureData}
                selectPicture={selectPicture}
                appState={appState}
              />
            )}
          </Panel>
        </SideBar>
        <View>
          {pcx && (
            <PCXEditor
              data={pcx}
              setPictureData={setPictureData}
              selectPicture={selectPicture}
              deletePicture={deletePicture}
            />
          )}
        </View>
      </Content>
    </Main>
  );
}

export default App;
