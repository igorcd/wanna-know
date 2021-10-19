<template>
    <div class="w-full mb-4">
        <Text class="mb-1 mx-4">{{ title }}</Text>
        <div class="h-7 w-full rounded-full border border-white p-0.5">
            <div class="h-full text-purple-600 text-sm font-bold rounded-full bg-white flex items-center justify-center transition-all duration-150" :style="{'width': percentage + '%'}" style="min-width: 1.4rem">
                {{ votes }}
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Text from '../../components/Text.vue';

const Alternative = defineComponent({
    components: { Text },
    props: {
        title: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        }
    }
});

export default Alternative;
</script>

<style>

</style>