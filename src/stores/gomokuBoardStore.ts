import { defineStore } from "pinia";
import { ICellBoardProps } from "../components/definitions";

type LastBestMoveCoords = undefined | { row: number; column: number };

// This store is managing the entire state of the Gomoku board
export const useGomokuBoardStore = defineStore("board", {
  state: () => ({
    gomokuBoard: [] as ICellBoardProps[],
    totalSizeInPixels: 0,
    boardSize: 0,
    cellSize: 0,
    numberOfMoves: 0,
    evaluationScore: 50,
    lastBestMoveCoords: undefined as LastBestMoveCoords,
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
    updateEvaluationScore(newScore: number) {
      this.evaluationScore = newScore;
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
    resetLastBestMoveCoords()
    {
      this.lastBestMoveCoords = undefined;
    },
    deleteLastMove() {
      const cell = this.getCellByLastMove;
      if (cell) {
        cell.number = undefined;
        this.numberOfMoves--;
      }
    },
    stopCurrentAnalysis() {
      if (this.lastBestMove) {
        this.addMoveNumber({ x: this.lastBestMove.row, y: this.lastBestMove.column })
        this.resetLastBestMoveCoords();
      }
    },
    normalizeEvalValue(evalValue: string) {
      // Directly return for "+M" and "-M" cases, else parse and normalize
      const normalizedValue = evalValue.includes("+M") ? 100 :
        evalValue.includes("-M") ? 0 :
          (() => {
            let numericValue = parseInt(evalValue, 10);
            numericValue = Math.max(-700, Math.min(700, numericValue)); // Ensure within range
            return ((numericValue + 700) / 1400) * 100; // Normalize to 0-100 scale
          })();

      // Reverse the score for white's move
      return this.numberOfMoves % 2 !== 0 ? 100 - normalizedValue : normalizedValue;
    },
    // Processes a match from the evaluation regex
    processEvaluationMatch(evaluationMatch : RegExpMatchArray)
    {
      const evalValue = this.normalizeEvalValue(evaluationMatch[1]);
      console.log(evalValue);
      this.updateEvaluationScore(evalValue);
    },
    // Processes a match from the coordinates regex
    processBestMoveMatch(coordinatesMatch : RegExpMatchArray)
    {
      // Convert the column letter ('A'-'O') to a numeric index (0-14)
      const firstIndex = coordinatesMatch[1].charCodeAt(0) - 'A'.charCodeAt(0);
      // Convert the row number to the correct index and reverse it according to game logic
      const secondIndex = this.getReversedIndex((parseInt(coordinatesMatch[2])) - 1)

      this.updateLastBestMoveCoords(firstIndex, secondIndex);
    },
   
    updateBoardBasedOnEngineAnalysis(output: string) {

      const outputSplitted = output.split(" | ");

      const lastValue = outputSplitted.pop();

      //Regexes definition to match the desired output
      const coordinatesMatch = lastValue?.match(/\b([A-O])([0-9]|1[0-4])\b/);

      const evalMatch = output.match(/Eval (\+?-?M?\d*)/);

      if (coordinatesMatch || evalMatch) {

        if(coordinatesMatch)
        {
          this.processBestMoveMatch(coordinatesMatch);
        }

        if(evalMatch)
        {
          this.processEvaluationMatch(evalMatch);
        }

      }
    },
  },

});
