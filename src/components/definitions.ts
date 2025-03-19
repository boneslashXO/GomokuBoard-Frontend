//here lies all the definitions (enums / consts / props, etc.)

export enum STONE_COLOR {
  black = "black",
  white = "white",
}

export enum COMMAND_TYPE {
  start = "start_ai",
  analyse = "analyze_position",
  stop = "stop_ai"
}

export enum BORDER_STYLE {
  right = "right",
  down = "down",
  up = "up",
}

export interface ICellBoardProps {
  column: number;
  row: number;
  number?: number;
  size: number;
}

export interface IBorderProps {
  size: number;
  borderStyle: BORDER_STYLE;
}

export interface IStoneProps {
  size: number;
  number?: number;
  textFontSize: number;
}

export interface IEngineOutput {
  output : string;
  commandType: COMMAND_TYPE
}

export interface IDecoratorsProps {
  column : number;
  row : number;
  size: number;
  isLastBestMove: boolean
}
