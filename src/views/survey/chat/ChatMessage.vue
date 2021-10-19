<template>
    <div class="mb-2" :class="{'text-right': sended}">
        <p class="font-semibold text-white" v-if="showAuthor">{{ message.author }}</p>
        <p class="text-white/80 text-sm">{{ message.content }} </p>
    </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import { Message } from '../../../interfaces/Conversation';

const ChatMessage = defineComponent({
    props: {
        showAuthor: {
            type: Boolean,
            default: false
        },
        sended: {
            type: Boolean,
            default: false
        },
        message: {
            type: Object as PropType<Message>,
            required: true
        }
    },
});

export default ChatMessage;
</script>

<style>

</style>