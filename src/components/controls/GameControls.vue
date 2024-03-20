<script setup lang="ts">

import { defineEmits } from 'vue';

//Component which has simple controls for controlling the state of the board

const emit = defineEmits(['startEngine', 'playMove', 'stopEngine', 'changeEval']);

function handleStartEngine() {
    emit('startEngine');
}

function handlePlayMove() {
    emit('playMove');
}

function handleStopEngine() {
    emit('stopEngine');
}

function changeEval()
{
    emit('changeEval')
}

</script>

<template>
    <div class="game-controls">
        <button class="button" @click="handleStartEngine">Analyzing mode</button>
        <button class="button" @click="handlePlayMove">Play something</button>
        <button class="button" @click="handleStopEngine">Stop</button>
        <button class="button" @click="changeEval">Change eval</button>
    </div>
</template>

<style scoped>

.button {
    background-color: black;
    /* Green */
    border: none;
    color: white;
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
