<template>
    <div class="min-h-screen flex items-center justify-center relative p-4 sm:px-20">
        <!-- Imagem de fundo -->
        <BackgroundIllustration class="absolute bottom-0 left-0 w-4/5 z-0 opacity-10 sm:opacity-100 sm:w-2/5 max-w-md 2xl:max-w-xl"/>

        <!-- Dark Mode -->
        <DarkModeToogle class="fixed top-4 right-4"/>
        <!-- Conteúdo -->
        <RouterView #default="{Component}">
            <Transition name="fade" mode="out-in">
                <component :is="Component"/>
            </Transition>
        </RouterView>
        
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import BackgroundIllustration from '../../components/illustrations/BackgroundIllustration.vue';
import { DarkModeToogle } from '../../components';

const LoginMainView = defineComponent({
    components: { BackgroundIllustration, DarkModeToogle }
});

export default LoginMainView;
</script>

<style>

</style>