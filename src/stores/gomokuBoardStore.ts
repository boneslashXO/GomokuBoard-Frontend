import {defineStore} from "pinia";
import {ICellBoardProps} from "../components/definitions";

export const useGomokuBoardStore = defineStore("board", {
    state: () => ({
        gomokuBoard: [] as ICellBoardProps[],
        totalSizeInPixels: 0,
        boardSize: 0,
        cellSize: 0,
        numberOfMoves: 0,
    }),
    getters: {
        getCellByLastMove(state) {
            return state.gomokuBoard.find((x) => x.number == state.numberOfMoves);
        },
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
                    const item: ICellBoardProps = {row, column, size: this.cellSize};
                    this.gomokuBoard.push(item);
                }
            }
        },
        getCellByRowAndColumn(coordinations: { x: number; y: number }) {
            return this.gomokuBoard.find(
                (cell) =>
                    cell.column === coordinations.y && cell.row === coordinations.x,
            );
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
        deleteLastMove() {
            const cell = this.getCellByLastMove;
            if (cell) {
                cell.number = undefined;
                this.numberOfMoves--;
            }
        },
    },
});
