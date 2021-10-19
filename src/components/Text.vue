<template>
    <p :class="type"><slot/></p>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';

type TextTypes = 
    'title' |
    'body' | 
    'caption' | 
    'caption2' |
    'subheader' |
    'headline4' |
    'headline4-accent' |
    'headline3' |
    'headline3-accent' |
    'headline2' |
    'headline2-accent' |
    'headline1';
    
const Text = defineComponent({
    props: {
        type: {
            type: String as PropType<TextTypes>,
            default: 'body'
        }
    },
});

export default Text;
</script>

<style>

</style>