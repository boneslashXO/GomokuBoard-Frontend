<script setup lang="ts">
import CellBoard from "./cell/CellBoard.vue";
import {useGomokuBoardStore} from "../../stores/gomokuBoardStore.ts";
import {computed} from "vue"; // const fontSize = computed(() => cellSize.value - 15);

//
// const lettersArray = [
//   "A",
//   "B",
//   "C",
//   "D",
//   "E",
//   "F",
//   "G",
//   "H",
//   "I",
//   "J",
//   "K",
//   "L",
//   "M",
//   "N",
//   "O",
// ];

const gomokuBoardStore = useGomokuBoardStore();

const gomokuBoard = computed(() => gomokuBoardStore.gomokuBoard);

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

    return {x, y};
  }
}

function addStone(event: MouseEvent) {
  const coordinations = getThePositionOfTheMouse(event);
  gomokuBoardStore.addMoveNumber(coordinations);
}

function removeStone(event: MouseEvent) {
  gomokuBoardStore.deleteLastMove();
  event.stopPropagation();
  event.preventDefault();
}
</script>

<template>
  <svg
      :width="gomokuBoardStore.totalSizeInPixels"
      :height="gomokuBoardStore.totalSizeInPixels"
      overflow="visible"
      fill="grey"
      @mousedown.left="(ev) => addStone(ev)"
      @contextmenu="(ev) => removeStone(ev)"
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
