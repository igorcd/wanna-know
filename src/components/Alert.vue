<template>
    <transition name="fade">
        <div class="fixed w-full h-full bg-black bg-opacity-75 z-50 top-0 flex flex-col items-center justify-center" v-if="state.isOpened">
            
            <transition name="modal" appear>
                <div class="flex flex-col items-center justify-center" v-show="state.isOpened">
                    <Lottie :animation="state.animation" size="250px"/>
                    <!-- <img :src="require('@/assets/img/' + state.icon)" class="h-24 mb-8"/> -->
                    <h1 class="text-white text-3xl font-bold mb-8">{{ state.title }}</h1>
                    <p class="text-white w-full text-center mb-12" style="max-width: 300px" v-html="state.message"></p>
                    <div class="flex">

                        <div class="w-12 h-12 rounded-full border border-white flex items-center justify-center mx-3 cursor-pointer" @click="state.isOpened = false"
                             v-if="state.options.length == 0">
                            <Icon icon="check" size="2rem" color="white"/>
                        </div>

                        <div class="w-12 h-12 rounded-full border border-white flex items-center justify-center mx-3 cursor-pointer"
                             v-for="(option, index) in state.options"
                             :key="index"
                             @click="() => triggerAction(option.action)">
                            <Icon :icon="option.icon" size="2rem" color="white"/>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import Icon from './Icon.vue';
import Lottie from './Lottie.vue';
import { AlertOption } from '../hooks/alert';
import * as animations from '../assets/lottie';


interface AlertState {
    options: AlertOption[];
    animation: any;
    title: string;
    message: string;
    isOpened: boolean;
}

const Alert = defineComponent({
    components: { Icon, Lottie },
    setup() {

        const state: AlertState = reactive({
            options: [],
            animation: animations.alert,
            title: "Ops...",
            message: "",
            isOpened: false
        });

        const displayAlert = (options: { title?: string; message: string; options?: AlertOption[]; animation?: string; detail?: string}) => {
            state.options = options.options || [];
            state.animation = options.animation ? (animations as any)[options.animation] : animations.alert;
            state.title = options.title || "Ops...";
            state.message = options.message;
            state.isOpened = true;
        };

        const triggerAction = (action?: () => void) => {
            state.isOpened = false;
            action && action();
        };

        return { state, displayAlert, triggerAction };
    }
});

export default Alert;
</script>

<style>

</style>