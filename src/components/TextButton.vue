<template>
    <button class="block text-center text-white font-medium hover:underline cursor-pointer">
        <slot/>
    </button>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const TextButton = defineComponent({
});

export default TextButton;
</script>

<style>

</style>