<template>
    <button :class="type">
        <slot/>
    </button>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const Button = defineComponent({
    props: {
        type: {
            type: String,
            default: 'primary'
        }
    }
});

export default Button;
</script>

<style>

</style>