<template>
    <IconsSprite/>
    
    <div class="w-full min-h-screen bg-primary">
        <RouterView v-slot="{ Component }">
            <transition name="drill" mode="out-in">
                <component :is="Component"/>
            </transition>
        </RouterView>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import IconsSprite from './components/sprites/IconsSprite.vue';

const App = defineComponent({
    components: { IconsSprite },
    setup(){
        const theme = localStorage.getItem('theme');
        if(theme && theme == 'dark') {
            document.documentElement.classList.add('dark');
        }
    }
});

export default App;
</script>

<style>

</style>