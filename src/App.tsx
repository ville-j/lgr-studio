import "./App.css";
import Panel from "./components/Panel";
import Main, { Content, SideBar, TopBar, View } from "./layouts/Main";
import { useMemo, useState } from "react";
import { AppState, IPCX, LGRFile, PCXData } from "./types.js";
import Palette from "./components/Palette.js";
import { downloadData } from "./utils.js";
import PCXList from "./components/PCXList.js";
import Landing from "./layouts/Landing.js";
// @ts-expect-error there are no type declarations for this lib
import PCX from "pcx-js";
import PCXEditor from "./components/PCXEditor.js";
import Button from "./components/Button.js";
import { Clip, LGR, PictureType, Transparency } from "elmajs";
import { Buffer } from "buffer";

const initialState: AppState = {
  lgrs: [],
  selectedLgr: "",
  selectedPicture: "",
};

function App() {
  const [appState, setAppState] = useState(initialState);

  const loadLGR = (lgr: LGRFile) => {
    setAppState(
      (state): AppState => ({ ...state, lgrs: [...state.lgrs, lgr] })
    );
  };

  const selectLGR = (id: string) => {
    setAppState((state): AppState => ({ ...state, selectedLgr: id }));
  };

  const selectPicture = (name: string) => {
    setAppState((state): AppState => ({ ...state, selectedPicture: name }));
  };

  const getSelectedLGR = () =>
    appState.lgrs.find((lgr) => lgr.id === appState.selectedLgr);

  const setPictureData = (name: string, data: Buffer) => {
    setAppState((state): AppState => {
      return {
        ...state,
        lgrs: state.lgrs.map((lgr) => {
          return lgr.id === state.selectedLgr
            ? {
                ...lgr,
                data: {
                  ...lgr.data,
                  pictureData: lgr.data.pictureData.map((p) => {
                    return p.name === name ? { ...p, data } : p;
                  }),
                },
              }
            : lgr;
        }),
      };
    });
  };

  const deletePicture = (name: string) => {
    setAppState((state): AppState => {
      return {
        ...state,
        selectedPicture: "",
        lgrs: state.lgrs.map((lgr) => {
          return lgr.id === state.selectedLgr
            ? {
                ...lgr,
                data: {
                  pictureData: lgr.data.pictureData.filter(
                    (p) => p.name !== name
                  ),
                  pictureList: lgr.data.pictureList.filter(
                    (p) => p.name !== name
                  ),
                },
              }
            : lgr;
        }),
      };
    });
  };

  const createPicture = (data: Buffer, name: string) => {
    setAppState((state): AppState => {
      return {
        ...state,
        selectedPicture: name,
        lgrs: state.lgrs.map((lgr) => {
          return lgr.id === state.selectedLgr
            ? {
                ...lgr,
                data: {
                  pictureData: [...lgr.data.pictureData, { data, name }],
                  pictureList: [
                    ...lgr.data.pictureList,
                    {
                      name,
                      pictureType: PictureType.Normal,
                      distance: 400,
                      clipping: Clip.Sky,
                      transparency: Transparency.TopLeft,
                    },
                  ],
                },
              }
            : lgr;
        }),
      };
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
              const file = new LGR();
              file.pictureData = lgr.data.pictureData;
              file.pictureList = lgr.data.pictureList;
              const buffer = file.toBuffer();
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
    (p) => p.name === appState.selectedPicture
  );

  if (appState.selectedPicture && !picture) return <div>404</div>;

  const data = picture
    ? ((): IPCX | undefined => {
        try {
          return new PCX(picture.data);
        } catch (err) {
          console.log(err);
        }
      })()
    : undefined;

  const pcx =
    data && picture
      ? ((): PCXData | undefined => {
          try {
            return {
              ...(data.buffer.length > 0
                ? data.decode()
                : {
                    header: data.header,
                    height: 0,
                    width: 0,
                    palette: new Uint8Array(),
                    pixelArray: new Uint8Array(),
                  }),
              rawData: picture.data,
              filename: picture.name,
            };
          } catch (err) {
            console.log(err);
          }
        })()
      : undefined;

  return (
    <Main>
      {topBar}
      <Content>
        <SideBar>
          <Panel title="LGR palette" height={300}>
            {palette && <Palette palette={palette}></Palette>}
          </Panel>
          <Panel title="Picture palette" height={300}>
            {pcx?.palette ? (
              <Palette palette={pcx.palette}></Palette>
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
          <Panel
            title="Pictures"
            buttons={[
              <Button
                key="createImage"
                style={{ padding: 14 }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("create picture");
                  createPicture(Buffer.from([]), "test.pcx");
                }}
              >
                +
              </Button>,
            ]}
            open
          >
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
