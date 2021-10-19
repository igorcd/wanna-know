<template>
    <button class="w-full text-sm text-neutral-900 h-12 px-5 dark:text-white
      hover:bg-gray-50 dark:hover:bg-gray-500 cursor-pointer flex items-center disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            :class="{'font-medium !text-primary': selected}">
        <p class="mr-2 text-base e" style="font-weight: inherit; color: inherit">{{ label }}</p>
    </button>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

const DropdownItem = defineComponent({
    props: {
        label: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        }
    }
});

export default DropdownItem;
</script>

<style>

</style>