<template>
    <div class="lg:fixed top-[calc(50%-10rem)] right-5 px-4 lg:px-0 w-full max-w-lg lg:w-60 h-80 flex flex-col items-stretch">
        <p class="font-semibold text-white text-center">Deixe aqui a sua oponião 💬</p>
        <div class="flex-1 overflow-auto light-scroll pr-2 chat-container pt-4" id="chatContainer">
            <div id="chatWrapper">
                <p v-if="state.messages.length == 0" class="text-center text-white/70">Ninguem falou nada ainda :(</p>
                <component :is="message.author == 'admin' ? 'ChatAdminMessage' : 'ChatMessage'"
                           v-for="(message, index) in state.messages" :key="message.id" :message="message"
                           :showAuthor="state.messages[index -1] && state.messages[index -1].author != message.author"
                           :sended="state.userNameSetted && state.userName == message.author"/>
            </div>

        </div>
        
        <form v-if="state.userNameSetted" @submit.prevent="sendMessage">
            <input v-model="state.message"
                   id="messageInput"
                   placeholder="Digite sua mensagem" class="bg-white/20 h-10 rounded-lg text-sm px-3 text-white placeholder-white w-full"/>
        </form>
        <form @submit.prevent="setUserName" v-else>
            <input v-model="state.userName"
                   maxlength="16"
                   placeholder="Digite seu nome para participar" class="bg-white/20 h-10 rounded-lg text-sm px-3 text-white placeholder-white w-full"/>
        </form>
    </div>
</template>

<script lang='ts'>
import { defineComponent, nextTick, onBeforeUnmount, onMounted, reactive } from 'vue';
import { ResizeObserver } from 'resize-observer';
import { useRoute } from 'vue-router';
import { useAlert } from '../../../hooks/alert';
import { useFirestore } from '../../../hooks/firebase';
import { Message } from '../../../interfaces/Conversation';
import ChatAdminMessage from './ChatAdminMessage.vue';
import ChatMessage from './ChatMessage.vue';

interface ChatState {
    userName: string;
    message: string;
    userNameSetted: boolean;
    messages: Message[]
}

const Chat = defineComponent({
    components: { ChatAdminMessage, ChatMessage },
    setup() {
        const { watchCollection, insert } = useFirestore();
        const alert = useAlert();
        const { params } = useRoute();

        const state = reactive<ChatState>({
            userName: '',
            userNameSetted: false,
            message: '',
            messages: []
        });
        
        let unwatch: () => void;
        const loadChat = async() => {
            unwatch = await watchCollection<Message>({
                path: `chats/${params.id}/messages`,
                listeners: {
                    onAdd: (m) => {
                        console.log(m);
                        state.messages.push(m);
                    }
                }
            });
        };

        const setUserName = async() => {
            if(state.messages.find(el => el.author == state.userName)) {
                alert({
                    message: "Este nome ja está sendo utilizado"
                });
            }
            else if(state.userName.length && state.userName != 'admin') {
                state.userNameSetted = true;
                
                insert<Message>(`chats/${params.id}/messages`, {
                    author: 'admin',
                    content: `${state.userName} entrou`,
                    timeStamp: Date.now()
                });
                nextTick(() => {
                    (document.querySelector("#messageInput") as HTMLInputElement).focus();
                });
            }
        };

        const sendMessage = async() => {
            if(state.message.length > 0){
                const message = state.message;
                state.message = "";
                (document.querySelector("#messageInput") as HTMLInputElement).focus();
                await insert<Message>(`chats/${params.id}/messages`, {
                    author: state.userName,
                    content: message,
                    timeStamp: Date.now()
                });
            }
        };

        onMounted(() => {
            // Observer das mensagens
            const ro = new ResizeObserver(() => {
                const container = document.querySelector("#chatContainer") as HTMLDivElement;
                container.scrollTop = container.scrollHeight;
            });
            ro.observe(document.querySelector("#chatWrapper")!);
            loadChat();
        });
        onBeforeUnmount(() => unwatch());

        return { state,setUserName, sendMessage };
    }
});

export default Chat;
</script>

<style>

</style>