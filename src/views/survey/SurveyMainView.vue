<template>
    <div class="min-h-screen relative">

        <header class="flex items-center absolute top-4 px-4 w-full">
            <!-- Voltar -->
            <IconButton icon="times" iconSize="1.5rem" size="3rem" @click="$router.replace({ name: 'pin' })"/>
            <div class="flex-1"></div>
            <TextButton @click="$router.push({ name: 'login' })">Criar minha enquete</TextButton>

            <Divider :vertical="true" class="ml-5 mr-2"/>

            <!-- Dark Mode -->
            <DarkModeToogle/>
        </header>
        <transition name="fade" mode="out-in">
            <!-- Loading -->
            <div class="h-screen flex items-center justify-center" v-if="state.loading" key="1">
                <Loading />
            </div>

            <div class="min-h-screen flex flex-col py-8 items-center justify-center" key="2" v-else>

                <transition name="drill" mode="out-in">


                    <!-- Votação conluída -->
                    <div v-if="!state.survey?.active" class="container">
                        <!-- Titulo da questão -->
                        <Lottie animation="trophy" size="400px" class="-mb-20"/>
                        <Text type="headline2" class="mb-8 text-center relative z-10 w-full">{{ state.survey?.title }}</Text>
                        <Text type="headline1" class="text-center relative z-10">{{ mostVoted?.title }}</Text>
                        <Text type="headline4">Venceu com {{ mostVoted?.votes.length }} votos!</Text>
                    
                        <Alternative v-for="(question, index) in ordenedVotes"
                                     :key="index"
                                     :votes="question.votes.length" 
                                     :percentage="(question.votes.length / totalVotes) * 100"
                                     :title="question.title"/>
                    </div>

                    <!-- Votação -->
                    <div class="container" v-else-if="!hasVoted">

                        <!-- Titulo da questão -->
                        <Lottie animation="music" size="200px" class="-mb-8 2xl:-mb-0"/>
                        <Text type="headline1" class="mb-8 text-center w-full break-words">{{ state.survey.title }}</Text>
                
                        <div class="flex items-center py-4 border-b border-white w-full" v-for="(question, index) in state.survey.questions" :key="index">
                            <Radio name="survey" :radioValue="index" v-model="state.selectedAlternative"/>
                            <Text class="px-4">{{ question.title }}</Text>
                        </div>
                        <Button class="mt-8" @click="vote()">
                            <Loading v-if="state.voting"/>
                            <div v-else>Votar</div>
                        </Button>
                    </div>

                    <!-- Votação em andamento -->
                    <div class="container" v-else>
                        <!-- Titulo da questão -->
                        <Lottie animation="music" size="200px" class="-mb-8 2xl:-mb-0"/>
                        <Text type="headline1" class="mb-8 text-center w-full break-words">{{ state.survey.title }}</Text>
                        <Alternative v-for="(question, index) in state.survey.questions"
                                     :key="index"
                                     :votes="question.votes.length" 
                                     :percentage="(question.votes.length / totalVotes) * 100"
                                     :title="question.title"/>
                    </div>
                </transition>

                <Chat/>
            
                <!-- Balão de novo voto -->
                <NewVote ref="newVoteRef"/>

            </div>
        </transition>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue';

// Hooks
import { useFirestore } from '../../hooks/firebase';
import { useAlert } from '../../hooks/alert';
import { useRoute, useRouter } from 'vue-router';

// Componentes
import { Lottie, Text, Radio, Button, Loading, IconButton, DarkModeToogle, Divider, TextButton } from '../../components';
import Chat from './chat/Chat.vue';
import NewVote from './NewVote.vue';
import Alternative from './Alternative.vue';
import Survey from '../../interfaces/Survey';
import { useAuth } from '../../hooks/firebase';
interface SurveyViewState {
    selectedAlternative: number,
    loading: boolean;
    survey: Survey | null;
    voting: boolean;
    ip: string;
}

const SurveyView = defineComponent({
    components: { Lottie, Text, Alternative, Radio, Button, Loading, NewVote, IconButton, DarkModeToogle, Chat, Divider, TextButton },
    setup() {
        const { anonymouslyLogin, getUser } = useAuth();

        const { watchRef, update } = useFirestore();
        const alert = useAlert();
        const { params } = useRoute();
        const { replace } = useRouter();

        const newVoteRef = ref<any>(null);

        const state = reactive<SurveyViewState>({
            selectedAlternative: 0,
            loading: true,
            survey: null,
            voting: false,
            ip: ""
        });

        /** Carregar enquete */
        let unwatch: () => void;
        const loadSurvey = async () => {
            try {

                const user = getUser();
                if(!user) {
                    await anonymouslyLogin();
                }

                const resp = await fetch("https://api.ipify.org?format=json");
                if(resp.status >= 300){
                    throw "Não foi possível carregar a enquete, tente novamente em breve";
                }

                const json: { ip: string } = await resp.json();
                state.ip = json.ip;

                unwatch = await watchRef<Survey>(`surveys/${params.id}`, (s) => {
                    if(state.survey != null) {
                        const field = s.questions.find((el, index) => state.survey?.questions[index].votes.length != el.votes.length);
                        if(field) {
                            newVoteRef.value.addInQueue(field.title);
                        }
                    }
                    state.survey = { ...s };
                });

                state.loading = false;
                
            } catch (e) {
                alert({
                    message: "Parece que essa enquete não está mais disponível",
                    options: [
                        {
                            icon: "times",
                            action: () => replace({ name: 'pin' })
                        }
                    ]
                });
            }
        };

        const hasVoted = computed(() => state.survey?.questions.find(q => q.votes.includes(state.ip)));

        const totalVotes = computed(() => state.survey?.questions.reduce((acc,el) => acc += el.votes.length, 0) || 0);

        const mostVoted = computed(() => state.survey?.questions.reduce((acc, el) => acc.votes.length > el.votes.length ? acc : el, { title: "", votes : [] }));

        /** Votar */
        const vote = async () => {
            if(!state.voting) {
                state.voting = true;
                state.survey!.questions[state.selectedAlternative].votes.push(state.ip);
                newVoteRef.value.addInQueue(state.survey!.questions[state.selectedAlternative].title);
                await update(`surveys/${params.id}`, { questions: [...state.survey!.questions] });
            }
        };

        /** Votos ordenados */
        const ordenedVotes = computed(() => {
            return state.survey?.questions
                .filter(el => el.title != mostVoted.value?.title)
                .sort((a, b) => {
                    if (a.votes.length > b.votes.length) {
                        return -1;
                    }
                    if (a.votes.length < b.votes.length) {
                        return 1;
                    }
                    // a must be equal to b
                    return 0;
                });
        });

        onBeforeUnmount(() => unwatch && unwatch());

        onMounted(() => loadSurvey());

        return { state, vote, totalVotes, newVoteRef, hasVoted, mostVoted, ordenedVotes };
    }
});

export default SurveyView;
</script>

<style>
.chat-container {
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 10%);
}
</style>