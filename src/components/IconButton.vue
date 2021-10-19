<template>
    <button :style="{ width: size, height: size }"
            class="rounded-full bg-white bg-opacity-0  sm:hover:bg-opacity-25 sm:active:bg-opacity-50 active:bg-opacity-25 transition-all duration-100 outline-none transform active:scale-90  focus:outline-none flex justify-center items-center">
        <Icon :icon="icon" :size="iconSize" :color="color"/>
    </button>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Icon from './Icon.vue';

const IconButton = defineComponent({
    components: { Icon },
    props: {
        size: {
            type: String,
            default: "36px"
        },
        iconSize: {
            type: String,
            default: "18px"
        },
        icon: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: 'white'
        }
    }
});

export default IconButton;
</script>

<style>

</style>