<script setup lang="ts">
import CellBoard from "./cell/CellBoard.vue";
import { useGomokuBoardStore } from "../../stores/gomokuBoardStore.ts";
import { computed, onMounted } from "vue";
import { useEngineStore } from "../../stores/engineStore.ts";
import { COMMAND_TYPE } from "../definitions.ts";
import GameControls from "../controls/GameControls.vue"

const gomokuBoardStore = useGomokuBoardStore();
const engineStore = useEngineStore();

const gomokuBoard = computed(() => gomokuBoardStore.gomokuBoard);

onMounted(() => {
  engineStore.connectToSocket();
})

//function for getting the exact position of the mouse on screen
function getThePositionOfTheMouse(event: MouseEvent) {
  if (event.target) {
    const svg = event.target.closest("svg");
    const point = svg.createSVGPoint();
    point.x = event.clientX + gomokuBoardStore.cellSize / 2;
    point.y = event.clientY + gomokuBoardStore.cellSize / 2;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    const x = Math.floor(svgPoint.x / gomokuBoardStore.cellSize);
    const y = Math.floor(svgPoint.y / gomokuBoardStore.cellSize);

    console.log(x);
    console.log(y);

    return { x, y };
  }
}

//adding a the stone to boad
function addStone(event: MouseEvent) {
  const coordinations = getThePositionOfTheMouse(event);
  gomokuBoardStore.addMoveNumber(coordinations);
}

//removes lastly placed stone
function removeLastStone(event: MouseEvent) {
  gomokuBoardStore.deleteLastMove();
  event.stopPropagation();
  event.preventDefault();
}

//analysation of the position with engine
function analyseCurrentPosition() {
  if (engineStore.isEngineOnline) {
    let formattedMoves: string[] = [];

    const boardPosition = gomokuBoardStore.getCurrentPositionForAnalysis;

    boardPosition.forEach((move, index) => {

      const currentPlayerMove = ((index + boardPosition.length) % 2) + 1;
      const reversedColumn = gomokuBoardStore.getReversedColumn(move.column);

      formattedMoves.push(`${move.row},${reversedColumn},${currentPlayerMove}`);
    });

    const analyzeCommand = `BOARD\n${formattedMoves.join('\n')}\nDONE\n`;

    engineStore.sendMessage(COMMAND_TYPE.analyse, analyzeCommand);
  }
}

</script>

<!--Gomoku board uses the svg for good quality and and rect for the background
    and is made by the cells -> component Cellboard 
-->
<template>
  <div class="board-container">

    <svg :width="gomokuBoardStore.totalSizeInPixels" :height="gomokuBoardStore.totalSizeInPixels" overflow="visible"
      @mousedown.left="(ev) => addStone(ev)" @contextmenu="(ev) => removeLastStone(ev)">
      <rect :x="-gomokuBoardStore.cellSize / 2" :y="-gomokuBoardStore.cellSize / 2"
        :width="gomokuBoardStore.totalSizeInPixels - gomokuBoardStore.cellSize"
        :height="gomokuBoardStore.totalSizeInPixels - gomokuBoardStore.cellSize" fill="grey" pointer-events="none" />

      <CellBoard v-for="(cellBoard, index) in gomokuBoard" :key="index" :row="cellBoard.row" :column="cellBoard.column"
        :size="cellBoard.size" :number="cellBoard.number"></CellBoard>
    </svg>

    <GameControls class="gameControls"
      @startEngine="engineStore.sendMessage(COMMAND_TYPE.start, `info rule 1 START 15\n`)"
      @playMove="analyseCurrentPosition" @stopEngine="engineStore.sendMessage(COMMAND_TYPE.stop, `YXSTOP\n`)" />

  </div>
</template>

<style scoped>

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
