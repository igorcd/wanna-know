<template>
    <div class="relative" v-click-outside="clickOut">
        <div @click.stop="toogle">
            <slot :active="active"/>
        </div>
        <transition name="showDropdown">
            <div class="absolute z-10" v-if="active && !disabled" :style="contentPosition" @click.stop="closeOnClick ? active = false : ''">
                <div class="relative rounded-md bg-white dark:bg-gray-600 z-10 overflow-hidden" style="box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.15)">
                    <slot name="content" :toogle="toogle"/>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, watch } from 'vue';
import clickOut from '../directives/clickOut';

const Dropdown = defineComponent({
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
       
        position: {
            type: String,
            default: 'bottom-right'
        },
        closeOnClick: {
            type: Boolean,
            default: true
        },
        closeOnClickOut: {
            type: Boolean,
            default: true
        },
    },
    directives: {
        "click-outside": clickOut
    },
    setup(props, context) {
        const active = ref(false);

        const toogle = (() => {
            if(!props.disabled) {
                active.value = !active.value;
            }
        });

        const clickOut = () => {
            if(props.closeOnClickOut) {
                active.value = false;
            }
        };

        const contentPosition = computed(() => {
            switch (props.position) {
                case 'top-left':
                    return { bottom: 'calc(100% + 5px)', left: '0' };
                case 'top-right':
                    return { bottom: 'calc(100% + 5px)', right: '0' };
                case 'bottom-left':
                    return { top: 'calc(100% + 5px) ', left: '0' };
                case 'bottom-right':
                    return { top: 'calc(100% + 5px)', right: '0' };
                default:
                    return { left: '0' };
            }
        });

        watch(() => active.value, (newValue) => {
            if(!newValue) {
                context.emit('close');
            }
        });

        return { active, toogle, clickOut, contentPosition };
    }
});

export default Dropdown;
</script>

<style>
/* Transições */
.showDropdown-enter-from, .showDropdown-leave-to {
    opacity: 0
}
.showDropdown-enter-active, .showDropdown-leave-active {
    transition: 300ms;
}
</style>