<template>
    <div class="w-full pt-5 sm:pt-10 pb-12">
        
        <div class="px-8 pb-8">
            <Text type="headline1" class="mb-1 w-52 sm:w-auto">Bem-vindo {{ userName }}!</Text>
            <Text type="headline4">{{ subtitle }}</Text>
        </div>

        <!-- Cards -->
        <transition name="fade" mode="out-in">
            <div class="sm:flex flex-wrap px-6" v-if="state.loading">
                <SurveyCardSkeleton v-for="n in 10" :key="n" :style="{width: `${200 + 20 * randomInt(1, 5)}px`}"/>
                <NewSurveyCard @click="$router.push({ name: 'newSurvey'})"/>
            </div>

            <div class="sm:flex flex-wrap px-6" v-else>
                <SurveyCard v-for="survey in state.surveys"
                            :key="survey.token" 
                            :survey="survey"
                            @click="showDetailModal(survey)"
                            @finish="openCloseSurveyModal(survey.id)"/>
                <NewSurveyCard @click="$router.push({ name: 'newSurvey'})"/>
            </div>
        </transition>

        <!-- Detalhe -->
        <transition name="fade">
            <div class="fixed flex flex-col items-center justify-center top-0 left-0 w-full h-screen bg-black/60" v-show="state.detailOpened">

                <!-- QR Code -->
                <div id="qrCode" class="rounded-xl overflow-hidden mb-6"></div>

                <!-- Pin -->
                <h1 class="text-white text-3xl font-bold mb-8">{{ state.selectedSurvey?.token }}</h1>
                <p class="text-white w-full text-center mb-12" style="max-width: 300px">
                    Envie o QrCode ou compartilhe o código para divulgar sua votação. 
                </p>

                <div class="flex">

                    <button class="round" @click="state.detailOpened = false">
                        <Icon icon="times" size="2rem" color="white"/>
                    </button>
                    <button class="round" @click="downloadQrCode">
                        <Icon icon="download" size="2rem" color="white"/>
                    </button>
                    <a target="_blank" :href="`survey/${state.selectedSurvey?.id}`" class="round">
                        <Icon icon="expand" size="2rem" color="white"/>
                    </a>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive } from 'vue';

import { Text, Icon } from '../../../components';
import QRCodeStyling from 'qr-code-styling';

import SurveyCard from './SurveyCard.vue';
import NewSurveyCard from './NewSurveyCard.vue';
import SurveyCardSkeleton from './SurveyCardSkeleton.vue';

import { randomInt } from '../../../utils/helperFunctions';
import { useAuth, useFirestore } from '../../../hooks/firebase';
import Survey from '../../../interfaces/Survey';
import { useAlert } from '../../../hooks/alert';

interface DashboardViewState {
    loading: boolean;
    surveys: Survey[]
    selectedSurvey: Survey | null;
    detailOpened: boolean;
}

const DashboardView = defineComponent({
    components: { Text, SurveyCard, NewSurveyCard, SurveyCardSkeleton, Icon },
    setup() {

        const { watchCollection, update } = useFirestore();
        const { getUser } = useAuth();
        
        const userName = computed(() => {
            const user = getUser();
            return user?.displayName;
        });
        
        const alert = useAlert();

        const state = reactive<DashboardViewState>({
            loading: true,
            surveys: [],
            selectedSurvey: null,
            detailOpened: false
        });

        const subtitle = computed(() => {
            if(state.loading) {
                return "Carregando suas enquetes";
            }
            else if(state.surveys.length == 0) {
                return "Você não possui enquetes :(";
            }
            else {
                return "Essas são suas enquetes";
            }
        });

        let qrCode: QRCodeStyling;

        const showDetailModal = (survey: Survey) => {
            state.selectedSurvey = survey;

            // Se não tiver setado o Qr Code
            if(!qrCode) {
                qrCode = new QRCodeStyling({
                    width: 250,
                    height: 250,
                    data: '',
                    image: "",
                    dotsOptions: {
                        color: "#263238",
                        type: "extra-rounded"
                    },
                    cornersSquareOptions: {
                        type: "extra-rounded"
                    },
                    backgroundOptions: {
                        color: "white",
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        margin: 5
                    }
                });
                qrCode.append(document.getElementById("qrCode")!);
            }
            // Url da surve
            const url = `${window.location.origin}/survey/${state.selectedSurvey?.id}`;
            qrCode.update({ data:url });
            state.detailOpened = true;
        };

        let unWatch: () => void;
        const loadSurveys = async () => {
            try {
                state.surveys = [];

                const email = getUser()?.email;

                unWatch = await watchCollection<Survey>({
                    path:'surveys',
                    filters: [
                        ['userEmail', '==', email]
                    ],
                    listeners: {
                        onAdd: (survey) => state.surveys.push(survey),
                        onChange: (survey) => {
                            const surveyRef = state.surveys.find(el => el.token == survey.token)!;
                            surveyRef.questions.forEach((q, index) => { q.votes = survey.questions[index].votes;});
                            surveyRef.active = survey.active;
                            surveyRef.title = survey.title;
                        }
                    } 
                });

                state.loading = false;
            } catch (error) {
                alert({
                    message: "Não foi possível carregar suas enquetes, tente novamente em breve"
                });
            }
        };

        /** Baixar qrCode */
        const downloadQrCode = () => {
            qrCode.download();
            state.detailOpened = false;
        };

        /** Finalizar enquete */
        const closeModal = async (id: string) => {
            await update(`surveys/${id}`, { active: false });
        };

        /** Abrir modal de finalização da enquete */
        const openCloseSurveyModal = (id: string) => {
            alert({
                title: "Atenção",
                message: "Tem certeza que deseja finalizar essa enquete?",
                options: [
                    {
                        icon: 'times'
                    },
                    {
                        icon: 'check',
                        action: () => closeModal(id)
                    }
                ]
            });
        };
        

        onMounted(() => loadSurveys());

        onBeforeUnmount(() => unWatch && unWatch());

        return { state, randomInt, subtitle, userName, openCloseSurveyModal, showDetailModal, downloadQrCode };
    }
});

export default DashboardView;
</script>

<style>

</style>