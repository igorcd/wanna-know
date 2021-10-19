<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-5 pt-20 pb-12">
        
        <!-- Container -->
        <div class="flex flex-col items-center w-full max-w-lg 2xl:max-w-2xl">
            
            <!-- Card -->
            <Card class="flex-1 self-stretch mb-8">

                <!-- Card Header -->
                <div class="border-b border-gray-300 pt-4 pb-3">
                    <AutoResizeTextArea class="bg-transparent px-8 text-center text-xl font-medium w-full" placeholder="Titulo da enquete" v-model="state.survey.title"/>
                </div>

                <!-- Card Body -->
                <div class="overflow-auto px-4 h-[17.5rem] 2xl:h-96">

                    <div class="w-full flex items-center justify-center p-6 h-full" v-if="state.survey.questions.length == 0">
                        <p class="text-lg font-medium opacity-50 text-center dark:opacity-70 dark:text-gray-300">Adicione algumas altenativas ;)</p>
                    </div>

                    <div class="h-14 flex items-center border-b border-gray-300 dark:border-gray-500 last:border-b-0" v-for="(question, index) in state.survey.questions" :key="index">
                        <input placeholder="Titulo da altenativa" class="flex-1 outline-none bg-transparent dark:text-white" v-model="question.title">
                        <IconButton icon="times" color="#EF4444" @pressed="() => removeQuestion(index)"/>
                    </div>

                </div>

                <!-- Card Footer -->
                <div class="border-t border-gray-300 py-4">
                    <TextButton class="text-purple-700 dark:text-white mx-auto" @click="addQuestion">Adicionar alternativa</TextButton>
                </div>
            </Card>

            <!-- Confirmar -->
            <transition name="fade" mode="out-in">

                <div class="h-12 flex items-center" v-if="state.loading">
                    <Loading/>
                </div>

                <div class="flex" v-else>
                    <IconButton icon="times"
                                size="3rem"
                                iconSize="2rem" 
                                class="border border-white flex-shrink-0" 
                                @click="$router.replace({ name: 'dashboard'})"/>
                    <div class="w-8"/>
                    <IconButton icon="check" size="3rem" iconSize="2rem" class="border border-white flex-shrink-0" @click="submit"/>
                </div>
            </transition>


        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { customAlphabet } from 'nanoid';
import { useAlert } from '../../../hooks/alert';
import { useAuth, useFirestore } from '../../../hooks/firebase';
import { default_response } from '../../../utils/constants';

import { IconButton, AutoResizeTextArea, TextButton, Loading, Card } from '../../../components';

import Survey from '../../../interfaces/Survey';


interface CreateSurveyState {
    loading: boolean;
    survey: {
        title: string;
        questions: { title: string }[];
    }
}

const CreateSurveyView = defineComponent({
    components: { IconButton, AutoResizeTextArea, TextButton, Loading, Card },
    setup() {
        const alert = useAlert();
        const router = useRouter();
        const { insert } = useFirestore();
        const { getUser } = useAuth();

        const state = reactive<CreateSurveyState>({
            loading: false,
            survey: {
                title: '',
                questions: []
            }
        });

        const addQuestion = () => state.survey.questions.push({ title: '' });
        const removeQuestion = (index: number) => state.survey.questions.splice(index, 1);

        const submit = async () => {
            
            try {
                if(!state.survey.title) {
                    throw "Você precisa informar um título para a enquete";
                }

                if(state.survey.questions.length < 2) {
                    throw "Você precisa informar 2 alternativas no mínimo";
                }

                if(state.survey.questions.find(el => !el.title)) {
                    throw "Existem alternativas que não possuem um título";
                }

                const alternatives = state.survey.questions.map(el => el.title);
                const hasRepeated = new Set(alternatives).size != alternatives.length;
                if(hasRepeated) {
                    throw "Existem alternativas repetidas!";
                }
                    
                if(!state.loading) { 
                    state.loading = true;
                    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
                    const token = nanoid();

                    const email = getUser()!.email!;
                    const survey: Survey = {
                        title: state.survey.title,
                        questions: state.survey.questions.map(el => ({ title: el.title, votes: [] })),
                        active: true,
                        token,
                        userEmail: email
                    };
                    await insert(`surveys`, survey );

                    alert({
                        animation: 'success',
                        title: survey.token,
                        message: `Sua enquete foi cadastrada com sucesso! Basta utilizar o código acima ou compartilhar o link com os seus amigos.`,
                        options: [{
                            icon: 'check',
                            action: () => router.replace({ name: 'dashboard' })
                        }]
                    });

                }
               
            } catch (error) {
                alert({
                    animation: 'alert',
                    title: 'Opss...',
                    message: typeof(error) == 'string' ? error : default_response
                });
            }
           
            // alert({
            //     animation: "success",
            //     title: "Tudo pronto!",
            //     message: "Sua enquete foi cadastrada com sucesso! Basta utilizar o código 854345, ou compartilhar o link com os seus amigos.",
            //     options: [{
            //         icon: 'check',
            //         action: () => {}
            //     }]
            // });
        };

        return { state, addQuestion, removeQuestion, submit };
    }
});

export default CreateSurveyView;
</script>

<style>

</style>