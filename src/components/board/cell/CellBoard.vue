<script setup lang="ts">
import { BORDER_STYLE, ICellBoardProps } from "../../definitions";
import { computed } from "vue";
import CellBorder from "./CellBorder.vue";
import CellStone from "./CellStone.vue";
import { useGomokuBoardStore } from "../../../stores/gomokuBoardStore.ts";
import CellBoardDecorators from "./CellBoardDecorators.vue";

const props = defineProps<ICellBoardProps>();

const gomokuBoardStore = useGomokuBoardStore();

const borderStyles = [BORDER_STYLE.right, BORDER_STYLE.down];

// based on the actual position of the cell, fill the borders
const isBorderVisible = (borderStyle: BORDER_STYLE) => {
  if (borderStyle === BORDER_STYLE.right) {
    return gomokuBoardStore.boardSize - 1 != props.column;
  } else if (borderStyle === BORDER_STYLE.down) {
    return gomokuBoardStore.boardSize - 1 != props.row;
  }
};

const stoneSize = computed(() => props.size / 2.25);

const textFontSize = computed(() => stoneSize.value / 1.25);

const isLastBestMove = computed(() => {
  return props.column === gomokuBoardStore?.lastBestMoveCoords?.column &&
    props.row === gomokuBoardStore?.lastBestMoveCoords?.row;
});

</script>

<!-- CellBoard is composed by borders around itself (depending which index) and stone (if number is availiable) -->
<template>
  <g pointer-events="none" :transform="`translate(${props.column * props.size},${props.row * props.size})`">
    <g v-for="(borderStyle, index) in borderStyles" :key="index">
      <CellBorder v-if="isBorderVisible(borderStyle)" :size="props.size" :border-style="borderStyle" />
    </g>

    <CellBoardDecorators :column="props.column" :row="props.row" :size="props.size" :is-last-best-move="isLastBestMove">

    </CellBoardDecorators>

    <CellStone v-if="props.number" :size="stoneSize" :text-font-size="textFontSize" :number="props.number" />
  </g>
</template>

<style scoped></style>
