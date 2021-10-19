<template>
    <div class="flex items-center opacity-60 my-2 px-4">
        <div class="h-px flex-1 bg-gray-700 dark:bg-white"></div>
        <p class="px-2 text-gray-700 dark:text-white text-sm">{{ message.content }}</p>
        <div class="h-px flex-1 bg-gray-700 dark:bg-white"></div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import { Message } from '../../../interfaces/Conversation';

const ChatAdminMessage = defineComponent({
    props: {
        message: {
            type: Object as PropType<Message>,
            required: true
        }
    }
});

export default ChatAdminMessage;
</script>

<style>

</style>