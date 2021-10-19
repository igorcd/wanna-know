<template>
    <div class="bg-white dark:bg-gray-600 shadow-lg rounded-xl">
        <slot/>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const Card = defineComponent({
});

export default Card;
</script>

<style>

</style>