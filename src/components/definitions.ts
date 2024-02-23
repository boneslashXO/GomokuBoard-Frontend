export enum STONE_COLOR {
  black = "black",
  white = "white",
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
