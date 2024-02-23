<script setup lang="ts">
import { IStoneProps, STONE_COLOR } from "../../definitions";
import { computed } from "vue";

const props = defineProps<IStoneProps>();

//color computation based on number of the stone (could be tightly coupled)
const stoneColor = computed(() => {
  if (props.number != undefined) {
    return props.number % 2 === 0 ? STONE_COLOR.white : STONE_COLOR.black;
  } else {
    return undefined;
  }
});

//text computation based on previously calculated stone color
const textColor = computed(() => {
  if (stoneColor.value !== undefined) {
    return stoneColor.value === STONE_COLOR.white
      ? STONE_COLOR.black
      : STONE_COLOR.white;
  } else {
    return undefined;
  }
});
</script>

<!-- circle for the perfect details used together with the text-->
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
