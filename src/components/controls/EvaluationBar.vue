<script setup>
import { computed } from 'vue';
import { defineProps } from 'vue';

// Define the props the component accepts
const props = defineProps({
    height: Number,
    value: Number
});

// Example computed property to determine some aspect of the evaluation bar,
// like the filled portion's height, based on the value prop.
const filledHeight = computed(() => `${Math.max(0, Math.min(100, props.value))}%`);
</script>


<template>
    <div class="evaluation-bar" :style="{ height: props.height - 50 + 'px' }">
        <div class="score-bar-background" :style="{ height: props.height -50 + 'px' }">
            <div class="score-bar-fill" :style="{ height: filledHeight }"></div>
        </div>
    </div>
</template>

<style scoped>
.evaluation-bar {
    margin-top: -25px;
    margin-left:-45px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.score-bar-background {
    width: 30px;
    background-color: white;
    margin-top: 10px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.score-bar-fill {
    background-color: black;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-radius: 10px;
    transition: height 1.25s ease;
}
</style>