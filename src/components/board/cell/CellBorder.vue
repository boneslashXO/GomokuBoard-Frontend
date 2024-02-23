<script setup lang="ts">
import { computed, defineProps } from "vue";
import { BORDER_STYLE, IBorderProps } from "../../definitions";

const props = defineProps<IBorderProps>();

const sizeX2 = computed(() =>
  props.borderStyle == BORDER_STYLE.right ? props.size : 0,
);

const sizeY2 = computed(() =>
  props.borderStyle == BORDER_STYLE.down ? props.size : 0,
);
</script>

<template>
  <svg :height="props.size" :width="props.size" pointer-events="none">
    <line
      :x1="0"
      :y1="0"
      :x2="sizeX2"
      :y2="sizeY2"
      stroke="black"
      stroke-width="3"
    ></line>
  </svg>
</template>

<style scoped>
/* Component-specific styles here */
</style>
