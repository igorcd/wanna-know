<template>
    <hr class="bg-white border-none" :class="vertical ? 'h-8 w-px' : 'h-px'">
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const Divider = defineComponent({
    props: {
        vertical: {
            type: Boolean,
            default: false
        }
    }
});

export default Divider;
</script>

<style>

</style>