<template>
    <div ref="container" class="flex-shrink-0" :style="{'width': size,'height': size}">
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, onUnmounted } from 'vue';
import LottieWeb, { AnimationItem } from 'lottie-web';

const Lottie = defineComponent({
    props: {
        animation: {
            type: String,
            required: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        loop: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
        }
    },
    setup(props){
        let animation: AnimationItem;

        const container = ref<HTMLElement | null>(null);

        const loadAnimation = () => {
            animation = LottieWeb.loadAnimation({
                container: container.value!, // the dom element
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: `/lottie/${props.animation}.json`,
            });
            if(props.autoPlay) {
                animation.play();
            }
            if(props.loop) {
                animation.loop = true;
            }
        };

        const play = () => {
            animation.goToAndPlay(0);
        };
        const stop = () => animation.stop();

        onMounted(() => loadAnimation());
        onUnmounted(() => {
            setTimeout(() => {
                animation.destroy();
            }, 300);
        });

        return { container, play, stop };
    }
});

export default Lottie;
</script>

<style>

</style>