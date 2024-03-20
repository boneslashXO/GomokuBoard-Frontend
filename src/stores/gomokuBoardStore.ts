import { defineStore } from "pinia";
import { ICellBoardProps } from "../components/definitions";

// This store is managing the entire state of the Gomoku board
export const useGomokuBoardStore = defineStore("board", {
  state: () => ({
    gomokuBoard: [] as ICellBoardProps[],
    totalSizeInPixels: 0,
    boardSize: 0,
    cellSize: 0,
    numberOfMoves: 0,
    lastBestMoveCoords: { row: -1, column: -1 },
  }),
  getters: {
    getCellByLastMove(state) {
      return state.gomokuBoard.find((x) => x.number == state.numberOfMoves);
    },
    getCurrentPositionForAnalysis(state) {
      return state.gomokuBoard.filter(x => x.number != undefined).sort((a, b) => a.number! - b.number!);
    },
    lastBestMove(state) {
      // Return the last best move coordinates
      return state.lastBestMoveCoords;
    }
  },
  actions: {
    initializeBoard(boardSize: number, totalSizeInPixels: number) {
      this.boardSize = boardSize;
      this.totalSizeInPixels = totalSizeInPixels;
      this.cellSize = totalSizeInPixels / 16;
      this.gomokuBoard = [];
      // Initialize the board with the specified size and cell size
      for (let row = 0; row < this.boardSize; row++) {
        for (let column = 0; column < this.boardSize; column++) {
          const item: ICellBoardProps = { row, column, size: this.cellSize };
          this.gomokuBoard.push(item);
        }
      }
    },
    getCellByRowAndColumn(coordinations: { x: number; y: number }) {
      return this.gomokuBoard.find(
        (cell) =>
          cell.column === coordinations.y && cell.row === coordinations.x
      );
    },
    getReversedIndex(index: number) {
      return (this.boardSize - 1) - index;
    },
    addMoveNumber(coordinations: { x: number; y: number } | undefined) {
      if (coordinations) {
        const cell = this.getCellByRowAndColumn(coordinations);

        if (cell && !cell.number) {
          cell.number = this.numberOfMoves + 1;
          this.numberOfMoves++;
        }
      }
    },
    updateLastBestMoveCoords(row: number, column: number) {
      this.lastBestMoveCoords = { row, column };
    },
    deleteLastMove() {
      const cell = this.getCellByLastMove;
      if (cell) {
        cell.number = undefined;
        this.numberOfMoves--;
      }
    },
    playCurrentlyBestMove() {
      if (this.lastBestMove.column != -1 && this.lastBestMove.row != -1) {
        this.addMoveNumber({ x: this.lastBestMove.row, y: this.lastBestMove.column })
        this.updateLastBestMoveCoords(-1, -1);
      }
    },
    updateBoardBasedOnEngineOutput(output: string) {

      const outputSplitted = output.split("|");

      const lastValue = outputSplitted[outputSplitted.length - 1];

      const firstCoordinateMatch = lastValue.match(/\b([A-O])([0-9]|1[0-4])\b/);

      if (firstCoordinateMatch) {
        const [_fullMatch, columnLetter, rowString] = firstCoordinateMatch;

        // Convert the column from 'A'-'O' to 0-14
        const firstIndex = columnLetter.charCodeAt(0) - 'A'.charCodeAt(0);

        const secondIndex = this.getReversedIndex((parseInt(rowString)) - 1)

        console.log(firstIndex);

        console.log(secondIndex);

        this.updateLastBestMoveCoords(firstIndex, secondIndex);
      }
      else {
        console.log("MIMO");
      }

    },
  },

});
