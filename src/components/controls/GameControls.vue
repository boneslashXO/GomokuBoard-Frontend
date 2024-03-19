<script setup lang="ts">

import { defineEmits } from 'vue';

const emit = defineEmits(['startEngine', 'playMove', 'stopEngine']);

function handleStartEngine() {
    emit('startEngine');
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

        <button class="button" @click="handleStartEngine">Analyzing mode</button>
        <button class="button" @click="handlePlayMove">Play something</button>
        <button class="button" @click="handleStopEngine">Stop</button>
    </div>
</template>

<style scoped>

.game-controls {
    margin-top:-75px;
    padding-right:75px;
    display: flex;
    flex-direction: row;
    /* Align items in a row */
    justify-content: center;
    /* Center items horizontally */
    gap: 10px;
    /* Add some space between the buttons */
}

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
