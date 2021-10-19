<template>
    <div class="w-full max-w-md relative">

        <Text type="headline1" class="mb-2 text-center">Wanna Know</Text>

        <Text type="subheader" class="text-center mb-20">Vai que alguém quer saber ¯ \ _ (ツ) _ / ¯</Text>

        <Form class="mb-16" @onSubmit="submit" :validateOnInput="state.validateOnInput">
            <Input v-model="handlePin" name="pin" 
                   type="tel"
                   placeholder="Pin da enquete" class="mb-4"
                   :rules="[required]"
                   mask="XXXXXX"/>
            <Button>
                <transition name="fade" mode="out-in">
                    <Loading color="var(--primary-color)" v-if="state.loading"/>
                    <div v-else>Acessar</div>
                </transition>
            </Button>
        </Form>

        <TextButton class="mx-auto mb-2" @click="$router.push({ name: 'login' })">
            Acessar sua conta
        </TextButton>
        <TextButton class="mx-auto" @click="$router.push({ name: 'register' })">
            Registrar
        </TextButton>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Input, Button, Form, Text, TextButton, Loading } from '../../components';
import { useAlert } from '../../hooks/alert';
import { useAuth, useFirestore } from '../../hooks/firebase';
import Survey from '../../interfaces/Survey';
import { required } from '../../utils/validators';

const PinView = defineComponent({
    components: { Input, Button, Form, Text, TextButton, Loading },
    setup() {
        const { getCollection } = useFirestore();
        const { replace } = useRouter();
        const { getUser, anonymouslyLogin } = useAuth();
        const alert = useAlert();

        const state = reactive({
            pin: '',
            loading: false,
            validateOnInput: false
        });

        const handlePin = computed({
            get: () => state.pin,
            set: (value) => {state.pin = value.toUpperCase();}
        });

        const submit = async (e: { isValid: boolean }) => {
            state.validateOnInput = true;
            if(e.isValid && !state.loading) {
                try {
                   
                   
                    state.loading = true;
                    
                    const user = getUser();
                    if(!user) {
                        await anonymouslyLogin();
                    }

                    const resp = await getCollection<Survey>("surveys", [
                        ["token", "==", state.pin]
                    ]);

                    const survey = resp[0];

                    if(!survey) {
                        throw "Este pin é inválido";
                    }

                    replace({ name: 'survey', params: { id: survey.id } });
                    
                } catch (err) {
                    const error = err as string;
                    state.loading = false;
                    alert({
                        message: error
                    });
                }
            }
        };

        return { state, required, submit, handlePin };
    }
});

export default PinView;
</script>

<style>

</style>