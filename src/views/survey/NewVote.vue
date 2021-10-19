<template>
    <transition name="fade">

        <div class="fixed" :style="{top: `${state.top}%`, left: `${state.left}%`}" v-show="state.animating">

            <div class=" flex items-center justify-center"
                 :style="{transform: `rotate(${state.rotation}deg)`}">
                <div class="absolute">
                    <Lottie :animation="fireworks" size="250px"/>
                </div>
                <p class="vote-box__text relative z-10">{{ state.text }}</p>
            </div>
        </div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent, onBeforeUnmount, onMounted, reactive } from 'vue';
import { Lottie } from '../../components';
import { fireworks } from '../../assets/lottie';
import { randomInt } from '../../utils/helperFunctions';


interface NewVoteState {
    queue: string[],
    animating: boolean,
    text: string;
    top: number;
    left: number;
    rotation: number;
}
const NewVote = defineComponent({
    components: { Lottie },
    setup() {

        const state = reactive<NewVoteState>({
            queue:[],
            animating: false,
            text: "",
            top: 0,
            left: 0,
            rotation: 0
        });

        /** Mostrar o voto */        
        const showVote = () => {
            state.text = state.queue[0];
            state.top = randomInt(10, 30);
            state.left = randomInt(10, 90);
            state.rotation = randomInt(-10, 10);

            state.animating = true;
            state.queue.shift();

            setTimeout(() => {
                state.animating = false;
            },3500);
        };

        let interval: any;
        const loadQueue = () => {
            interval = setInterval(() => {
                if(state.queue.length > 0 && !state.animating) {
                    showVote();
                }
            }, 1000);
        };

        const addInQueue = (text: string) => state.queue.push(text);

        onBeforeUnmount(() => clearInterval(interval));
        onMounted(() => loadQueue());
        
        return { fireworks, state, addInQueue };
    }
});

export default NewVote;
</script>

<style>
.vote-box__text {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    text-shadow: 3px 3px #5820B8
}
</style>