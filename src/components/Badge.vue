<template>
    <div class="relative">

        <svg class="absolute z-10 w-2.5 star" preserveAspectRatio="xMidYMin meet" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.2 1.60001L24.6 12.2C24.7 12.5 24.9 12.7 25.2 12.8L35.8 17.2C36.7 17.6 36.7 18.8 35.8 19.1L25.2 23.5C24.9 23.6 24.7 23.8 24.6 24.1L20.2 34.7C19.8 35.6 18.6 35.6 18.3 34.7L13.9 24.1C13.8 23.8 13.6 23.6 13.3 23.5L2.59999 19.2C1.69999 18.8 1.69999 17.6 2.59999 17.3L13.2 12.9C13.5 12.8 13.7 12.6 13.8 12.3L18.2 1.70001C18.6 0.800015 19.8 0.800015 20.2 1.60001Z" fill="white" stroke="black" stroke-width="2" stroke-miterlimit="10"/>
        </svg>

        <svg class="absolute z-10 w-2.5 -right-1 top-3 star star2" preserveAspectRatio="xMidYMin meet" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.2 1.60001L24.6 12.2C24.7 12.5 24.9 12.7 25.2 12.8L35.8 17.2C36.7 17.6 36.7 18.8 35.8 19.1L25.2 23.5C24.9 23.6 24.7 23.8 24.6 24.1L20.2 34.7C19.8 35.6 18.6 35.6 18.3 34.7L13.9 24.1C13.8 23.8 13.6 23.6 13.3 23.5L2.59999 19.2C1.69999 18.8 1.69999 17.6 2.59999 17.3L13.2 12.9C13.5 12.8 13.7 12.6 13.8 12.3L18.2 1.70001C18.6 0.800015 19.8 0.800015 20.2 1.60001Z" fill="white" stroke="black" stroke-width="2" stroke-miterlimit="10"/>
        </svg>

        <img :src="require('@/assets/img/badge.png')" class="rotate-12 w-8" />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const Badge = defineComponent({
});

export default Badge;
</script>

<style>
@keyframes starPulse {
    0%{
        opacity: 0;
        transform: scale(.4)
    }
    40% {
        opacity: 1;
        transform: scale(1)
    }
    60% {
        opacity: 1;
        transform: scale(1)
    }
    100% {
        opacity: 0;
        transform: scale(.4)
    }
    
}
.star {
    opacity: 0;
    animation: starPulse infinite 2s;
}

.star2 {
    animation-delay: 0.2s;
}
</style>