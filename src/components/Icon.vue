<template>
    <svg :style="style">
        <use :href="'#' +icon"></use>
    </svg>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue';

const Icon = defineComponent({
    props: {
        icon: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: '1.5rem'
        },
        color: {
            type: String,
        },
        type: {
            type: String as PropType<'fill'|'stroke'>,
            default: 'fill'
        }
    },
    setup(props) {
        const style = computed(() => {

            let placeholder:{[key: string]: any} = {
                'width': props.size,
                'height': props.size,
            };
            
            placeholder[props.type] = props.color;

            return placeholder;
        });

        return { style };
    }
});

export default Icon;
</script>

<style>

</style>