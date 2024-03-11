import { Clip, PictureType, Transparency } from "elmajs";

export interface PCXHeader {
  bitplanes: number;
  bpp: number;
  bpr: number;
  encoding: number;
  hdpi: number;
  palette: Uint8Array;
  vdpi: number;
  version: number;
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
}

export interface IPCX {
  buffer: Uint8Array;
  byteView: Uint8Array;
  header: PCXHeader;
  width: number;
  height: number;
  palette: Uint8Array;
  pixels: Uint8Array;
  planes: number;
  decode: () => PCXData;
}

export interface PCXData {
  header: PCXHeader;
  height: number;
  width: number;
  palette: Uint8Array;
  pixelArray: Uint8Array;
  rawData: Uint8Array;
  filename: string;
}

export interface LGRFile {
  id: string;
  name: string;
  comment: string;
  file: File;
  data: LGRData;
  modified: Date;
}

export interface LGRPictureData {
  name: string;
  data: Buffer;
}

export interface LGRPictureDeclaration {
  name: string;
  pictureType: PictureType;
  distance: number;
  clipping: Clip;
  transparency: Transparency;
}

export interface LGRData {
  pictureData: LGRPictureData[];
  pictureList: LGRPictureDeclaration[];
}

export interface AppState {
  lgrs: LGRFile[];
  selectedLgr: string;
  selectedPicture: string;
}
