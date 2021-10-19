<template>
    <Card class="survey-card">

        <transition name="modal">
            <div class="absolute -top-4 right-2" v-if="!survey.active">
                <Badge/>
            </div>
        </transition>

        <p class="text-purple-700 px-4 py-2 border-b border-dashed border-gray-300 font-semibold dark:text-white">{{ survey.token }}</p>

        <!-- Conteudo -->
        <div class="flex-1 px-4 flex flex-col justify-center items-center overflow-hidden overflow-ellipsis">
            <p class="text-center line-clamp-2 w-full overflow-hidden dark:text-white">{{ survey.title }} </p>
            <p class="font-semibold text-purple-700 dark:text-indigo-300 mt-1" v-if="!survey.active">{{ mostVoted.title ? mostVoted.title : 'Nenhum voto :(' }}</p>
        </div>

        <div class="h-10  flex-shrink-0 flex items-center px-4 border-t border-dashed border-gray-300">
            <Icon icon="vote" size="24px" class="fill-current text-purple-700 dark:text-white mr-1 mb-1"/>

            <div class="relative">
                <Lottie class="absolute bottom-full w-12 -left-3" ref="lottieRef" :autoPlay="false" :loop="false" :animation="stars"/>
                <p class="text-purple-700 font-semibold transition-all duration-150 w-6 text-center dark:text-white" ref="votesRef">{{ votes }}</p>
            </div>
            
            <TextButton class="text-purple-700 ml-auto dark:text-white" v-if="survey.active" @click.prevent.stop="$emit('finish')">Finalizar</TextButton>
        </div>
    </Card>
</template>

<script lang='ts'>
import { computed, defineComponent, watch, PropType, ref } from 'vue';
import { Icon, TextButton, Lottie, Badge, Card } from '../../../components';
import { stars } from '../../../assets/lottie';
import Survey from '../../../interfaces/Survey';

const SurveyCard = defineComponent({
    components: { Icon, TextButton, Lottie, Badge, Card },
    props: {
        survey: {
            type: Object as PropType<Survey>,
            required: true
        }
    },
    setup(props) {
        const votesRef = ref<HTMLElement | null>(null);
        const lottieRef = ref<any>(null);

        // Total de votos
        const totalVotes = computed(() => props.survey.questions.reduce((acc, q) => acc += q.votes.length, 0));

        // Total de votos separados para poder fazer a animação
        const votes = ref(props.survey.questions.reduce((acc, q) => acc += q.votes.length, 0));

        const mostVoted = computed(() => {
            return props.survey.questions.reduce((acc, el) => el.votes.length > acc.votes.length ? el : acc, { title: "", votes: [] });
        });


        const onVotesChange = (newVotes: number) => {
            const el = votesRef.value!;

            el.classList.add('opacity-0');
            
            setTimeout(() => {
                votes.value = newVotes;
                el.classList.add('scale-150');
                setTimeout(() => {
                    el.classList.remove('opacity-0');
                    el.classList.remove('scale-150');
                    lottieRef.value?.play();
                }, 150);
            },300);
        };

        watch(() => totalVotes.value, (newValue) => onVotesChange(newValue));

        return { stars, votes, votesRef, lottieRef, mostVoted };
    }
});

export default SurveyCard;
</script>

<style>

</style>