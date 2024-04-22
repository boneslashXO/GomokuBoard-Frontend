<script setup lang="ts">

import { defineEmits, computed } from 'vue';
import { useEngineStore } from '../../stores/engineStore';
import { useGomokuBoardStore } from '../../stores/gomokuBoardStore';
//Component which has simple controls for controlling the state of the board

const emit = defineEmits(['startEngine', 'playMove', 'stopEngine', 'changeEval']);

const analysisText = computed(() => useEngineStore().isEngineOnline ? "Analysis ON" : "Analysis OFF");
const analyseMoveText = computed(() => useGomokuBoardStore().lastBestMove == undefined ? "Analyse best move" : "Stop analysis");


function handleStartEngine() {
    if(!useEngineStore().isEngineOnline)
    {
        emit('startEngine');
    }
    
}

function handleMove() {
    !useGomokuBoardStore().lastBestMove ? handlePlayMove() : handleStopEngine();
}

function handlePlayMove() {
    emit('playMove');
}

function handleStopEngine() {
    emit('stopEngine');
}

</script>

<template>
    <div class="game-controls">
        <button class="button" @click="handleStartEngine">{{ analysisText }}</button>
        <button class="button" style="min-width:200px;max-width: 200px;" @click="handleMove">{{
            analyseMoveText }}</button>
    </div>
</template>

<style scoped>
.button {
    background-color: white;
    /* Green */
    border: none;
    color: black;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out;
}
</style>
