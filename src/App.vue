<script setup lang="ts">
import GomokuBoard from "./components/board/GomokuBoard.vue";
import {onBeforeMount} from "vue";
import {useGomokuBoardStore} from "./stores/gomokuBoardStore.ts";

const boardStore = useGomokuBoardStore();

onBeforeMount(() => {
  boardStore.initializeBoard(15, 800);
});
</script>
<template>
  <GomokuBoard/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
