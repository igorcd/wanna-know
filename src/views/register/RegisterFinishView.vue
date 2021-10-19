<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <Lottie :animation="fireworks" class="w-64 sm:w-80 mb-32 absolute"/>

        <div class="w-full max-w-sm text-center pt-32 z-10">
            <Text type="headline1" class="mb-4">Registro concluído!</Text>
            <Text type="subheader" class="mb-10">Agora você pode criar suas próprias enquetes</Text>
            <Button class="mb-14" @click="$router.replace({ name: 'dashboard'})">Continuar</Button>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { Lottie, Text, Button } from '../../components';
import fireworks from '../../assets/lottie/fireworks.json';

const RegisterFinishView = defineComponent({
    components: { Lottie, Text, Button },
    setup() {
        return { fireworks };
    }
});

export default RegisterFinishView;
</script>

<style>

</style>