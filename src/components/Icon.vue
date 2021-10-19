<template>
    <svg :style="[{ 'width': size },
                  { 'height': size },
                  `${type}: ${color}`]">
        <use :href="'#' +icon"></use>
    </svg>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';

const Icon = defineComponent({
    props: {
        icon: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: '1rem'
        },
        color: {
            type: String,
        },
        type: {
            type: String as PropType<'fill'|'stroke'>,
            default: 'fill'
        }
    }
});

export default Icon;
</script>

<style>

</style>