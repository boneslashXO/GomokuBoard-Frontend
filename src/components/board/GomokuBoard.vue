<script setup lang="ts">
import CellBoard from "./cell/CellBoard.vue";
import { useGomokuBoardStore } from "../../stores/gomokuBoardStore.ts";
import { onMounted, ref } from 'vue';
import { Socket } from 'phoenix';
import { computed } from "vue";


const engineOutput = ref<string>('');

const gomokuBoardStore = useGomokuBoardStore();

const gomokuBoard = computed(() => gomokuBoardStore.gomokuBoard);

const socket = new Socket("ws://localhost:4000/socket", {});
socket.connect();
const channel = socket.channel('AIgame:lobby', {});


onMounted( () => {
  channel.join()
    .receive('ok', () => console.log('Successfully joined the AI game lobby'))
    .receive('error', (resp) => console.error('Unable to join the AI game lobby', resp));
  console.log(channel);

     // Listen for messages on the "engine_output" event
  channel.on('engine_output', (response) => {
    console.log(response);
    engineOutput.value = response.output;
  });

})

function startGame() {
  channel.push("start_game", {})
    .receive("ok", response => console.log("Game start success:", response))
    .receive("error", response => console.log("Game start failed:", response));
}

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

<button 
    style="width: 100px; height: 100px;"
    @click="startGame" 
    v-text="'Prdelllll'"
  ></button>

</template>

<style scoped></style>
