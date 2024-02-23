<script setup lang="ts">
import {BORDER_STYLE, ICellBoardProps} from "../../definitions";
import {computed} from "vue";
import CellBorder from "./CellBorder.vue";
import CellStone from "./CellStone.vue";
import {useGomokuBoardStore} from "../../../stores/gomokuBoardStore.ts";

const gomokuBoardStore = useGomokuBoardStore();
const props = defineProps<ICellBoardProps>();

const borderStyles = [BORDER_STYLE.right, BORDER_STYLE.down];

const isBorderVisible = (borderStyle: BORDER_STYLE) => {
  if (borderStyle === BORDER_STYLE.right) {
    return gomokuBoardStore.boardSize - 1 != props.row;
  } else if (borderStyle === BORDER_STYLE.down) {
    return gomokuBoardStore.boardSize - 1 != props.column;
  }
};

const stoneSize = computed(() => props.size / 2.25);

const textFontSize = computed(() => stoneSize.value / 1.25);

</script>
<template>
  <g
      pointer-events="none"
      :transform="`translate(${props.row * props.size},${props.column * props.size})`"
  >
    <g v-for="(borderStyle, index) in borderStyles" :key="index">
      <CellBorder
          v-if="isBorderVisible(borderStyle)"
          :size="props.size"
          :border-style="borderStyle"
      />
    </g>
    <CellStone
        v-if="props.number"
        :size="stoneSize"
        :text-font-size="textFontSize"
        :number="props.number"
    />
  </g>
</template>

<style scoped></style>
