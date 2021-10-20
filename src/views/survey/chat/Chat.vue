<template>
    <Card class="lg:fixed bottom-5 right-5 w-80">

        <p class="font-semibold dark:text-white text-center p-4">Deixe aqui a sua oponião 💬</p>

        <div class="relative">
            <div class="overflow-auto light-scroll pr-2 chat-container pt-4 h-80" id="chatContainer">

                <div id="chatWrapper">
                    <p v-if="state.messages.length == 0" class="text-center text-gray-900/50 dark:text-white/70">Ninguem falou nada ainda :(</p>
                    <component :is="message.author == 'admin' ? 'ChatAdminMessage' : 'ChatMessage'"
                               v-for="(message, index) in state.messages" :key="message.id" :message="message"
                               :showAuthor="state.messages[index -1] && state.messages[index -1].author != message.author"
                               :sended="state.userNameSetted && state.userName == message.author"/>
                </div>

            </div>
        
            <form  @submit.prevent="sendMessage" class="p-4" >
                <input v-model="state.message"
                       autocomplete="off"
                       id="messageInput"
                       placeholder="Digite sua mensagem"
                       class="outline-none border-2 border-transparent focus:border-purple-400 bg-indigo-50 dark:bg-white/20 h-10 rounded-lg text-sm px-3 dark:text-white dark:placeholder-white w-full"/>
            </form>

            <div v-if="!state.userNameSetted || false"
                 class="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-lg rounded-xl transition-opacity sm:opacity-0 hover:opacity-100 flex flex-col items-center justify-center p-4">
                <Text type="headline3" class="text-center mb-8">Antes de começar, como gostaria de ser chamado?</Text>
                
                <form  @submit.prevent="setUserName" class="p-4 w-full">
                    <input v-model="state.userName"
                           id="messageInput"
                           placeholder="Ex.: noob_master123" 
                           class="bg-gray-200 dark:bg-white/20 h-10 rounded-lg text-sm px-3 dark:text-white dark:placeholder-white w-full"/>
                </form>
            </div>
        </div>

        
    </Card>
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
import { Card, Text, Icon } from '../../../components';

interface ChatState {
    userName: string;
    message: string;
    userNameSetted: boolean;
    messages: Message[]
}

const Chat = defineComponent({
    components: { ChatAdminMessage, ChatMessage, Card, Text, Icon },
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
                orderBy: [{ field: 'timeStamp' }],
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
            if(state.message.length > 0 && state.userNameSetted){
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