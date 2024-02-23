<script setup lang="ts">
import CellBoard from "./cell/CellBoard.vue";
import { useGomokuBoardStore } from "../../stores/gomokuBoardStore.ts";
import { computed } from "vue";

const gomokuBoardStore = useGomokuBoardStore();

const gomokuBoard = computed(() => gomokuBoardStore.gomokuBoard);

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
</script>

<!--Gomoku board uses the svg for good quality and and rect for the background
    and is made by the cells -> component Cellboard 
-->

<template>
  <svg
    :width="gomokuBoardStore.totalSizeInPixels"
    :height="gomokuBoardStore.totalSizeInPixels"
    overflow="visible"
    fill="grey"
    @mousedown.left="(ev) => addStone(ev)"
    @contextmenu="(ev) => removeLastStone(ev)"
  >
    <rect
      :x="-gomokuBoardStore.cellSize / 2"
      :y="-gomokuBoardStore.cellSize / 2"
      :width="gomokuBoardStore.totalSizeInPixels - gomokuBoardStore.cellSize"
      :height="gomokuBoardStore.totalSizeInPixels - gomokuBoardStore.cellSize"
      fill="grey"
      pointer-events="none"
    />

    <CellBoard
      v-for="(cellBoard, index) in gomokuBoard"
      :key="index"
      :row="cellBoard.row"
      :column="cellBoard.column"
      :size="cellBoard.size"
      :number="cellBoard.number"
    ></CellBoard>
  </svg>
</template>

<style scoped></style>
