import { LGR } from "elmajs";

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
  data: LGR;
  modified: Date;
}

export interface AppState {
  lgrs: LGRFile[];
  selectedLgr: string;
  selectedImage: string;
}
