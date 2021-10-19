<template>
    <div class="flex items-center opacity-60 my-2">
        <div class="h-px flex-1 bg-white"></div>
        <p class="px-2 text-white text-sm">{{ message.content }}</p>
        <div class="h-px flex-1 bg-white"></div>
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