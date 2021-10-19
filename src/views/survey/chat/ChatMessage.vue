<template>
    <div class="px-4" :class="{'text-right': sended, 'mt-2': showAuthor}">
        <p class="font-semibold text-purple-700 mb-1  dark:text-white" v-if="showAuthor">{{ message.author }}</p>
        <p class="dark:text-white/80 text-sm mb-1">{{ message.content }} </p>
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