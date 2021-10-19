<template>
    <label class="w-7 h-7 rounded-full border border-neutral-100 bg-neutral-200 relative flex items-center justify-center transition-all duration-500 cursor-pointer"
           @click="$emit('update:modelValue', radioValue)"
           :class="{'!bg-primary !border-primary': modelValue == radioValue}">

        <transition name="radioCheck">
            <div class="w-5 h-5 bg-white rounded-full" v-if="radioValue == modelValue && !check"/>
            <Icon icon="check" color="white" size="16px" v-else-if="radioValue == modelValue && check"/>
        </transition>

        <input :name="name" type="radio" :checked="radioValue == modelValue" class="hidden"/>
    </label>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Icon from './Icon.vue';

const Radio = defineComponent({
    components: { Icon },
    props: {
        modelValue: {
            required: true
        },
        radioValue: {
            required: true
        },
        name: {
            type: String,
            required: true
        },
        check: {
            type: Boolean,
            default: false
        }
    }
});

export default Radio;
</script>

<style>

@keyframes radio {
    0% {
        transform: scale(0)
    }
    70% {
        transform: scale(1.2)
    }
    100% {
        transform: scale(1)
    }
}
.radioCheck-enter-active{
    animation: radio .3s;
}
.radioCheck-leave-active {
    transition: .3s;
}
.radioCheck-leave-to {
    transform: scale(0)
}
</style>