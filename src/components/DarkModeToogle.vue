<template>
    <div>
        <IconButton :icon="darkModeActive ? 'sun' : 'moon'" size="3rem" iconSize="1.5rem"  @click="darkModeActive = !darkModeActive"/>
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue';
import IconButton from './IconButton.vue';

const DarkModeToogle = defineComponent({
    components: { IconButton },
    setup() {
        const darkModeActive = ref(document.documentElement.classList.contains('dark'));

        watch(() => darkModeActive.value, (newValue) => {
            localStorage.setItem('theme', newValue ? 'dark' : 'light');
            newValue
                ? document.documentElement.classList.add('dark')
                : document.documentElement.classList.remove('dark');
        });

        return { darkModeActive };
    }
});

export default DarkModeToogle;
</script>

<style>

</style>