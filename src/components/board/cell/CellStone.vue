<script setup lang="ts">
import { IStoneProps, STONE_COLOR } from "../../definitions";
import { computed } from "vue";

const props = defineProps<IStoneProps>();

const stoneColor = computed(() => {
  if (props.number != undefined) {
    console.log(props.number);
    return props.number % 2 === 0 ? STONE_COLOR.white : STONE_COLOR.black;
  } else {
    return undefined;
  }
});

const textColor = computed(() => {
  if (stoneColor.value === STONE_COLOR.white) {
    return STONE_COLOR.black;
  } else if (stoneColor.value === STONE_COLOR.black) {
    return STONE_COLOR.white;
  } else {
    return undefined;
  }
});
</script>

<template>
  <circle :cx="0" :cy="0" :r="props.size" :fill="stoneColor"></circle>
  <text
    :fill="textColor"
    :font-size="textFontSize"
    font-family="Verdana"
    text-anchor="middle"
    alignment-baseline="middle"
    :x="0"
    :y="0"
  >
    {{ props.number }}
  </text>
</template>
