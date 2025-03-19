<script setup lang="ts">

import { computed } from 'vue';
import { IDecoratorsProps } from '../../definitions';

const props = defineProps<IDecoratorsProps>();

const letterForColumn = computed(() => String.fromCharCode(64 + props.column+1))

const isKeyPoint = computed(() => {
    return (props.row == 3 && props.column == 3) ||
        (props.row == 3 && props.column == 11) ||
        (props.row == 11 && props.column == 3) ||
        (props.row == 11 && props.column == 11) ||
        (props.row == 7 && props.column == 7)
})

</script>

<template>
    <text v-if="props.row == 14" :x="-5" :y="22" fill="white" font-size="18">
        {{ letterForColumn }}
    </text>

    <text v-if="props.column == 14" :x="15" :y="8" fill="white" font-size="18" text-anchor="middle">
        {{ 15 - props.row }}
    </text>

    <rect v-if="isKeyPoint" :x="-4" :y="-4" :width="10" :height="10" fill="#1a1a1a">

    </rect>

    <circle v-if="isLastBestMove" :x="-4" :y="-4" :cx="0" :cy="0" :r="props.size / 8" fill="red" />

</template>