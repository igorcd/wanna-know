<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">

        <div class="w-full max-w-sm text-center">
            <Lottie :animation="welcome" class="w-64 sm:w-80 mx-auto -mb-10" size="250px"/>
            <Text type="headline1" class="mb-4">Bem-vindo</Text>
            <Text type="subheader" class="mb-10">Para continuarmos, me informa como você gostaria de ser chamado</Text>

            <Form @onSubmit="submit">
                <Input placeholder="Ex.: Gatinha da Laje 123" name="nome" v-model="state.name" class="mb-4" :rules="[required]"/>
                <Button class="mb-14">
                    <Loading v-if="state.loading" color="var(--primary-color)"/>
                    <div v-else>Continuar</div>
                </Button>
            </Form>
        </div>
        
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import { Lottie, Text, Button, Form, Input, Loading } from '../../components';
import { welcome } from '../../assets/lottie';
import { required } from '../../utils/validators';
import { useAlert } from '../../hooks/alert';
import { useAuth } from '../../hooks/firebase';
import { useRouter } from 'vue-router';

const RegisterName = defineComponent({
    components: { Lottie, Text, Button, Form, Input, Loading },
    setup() {

        const alert = useAlert();
        const { updateUser } = useAuth();
        const { replace } = useRouter();

        const state = reactive({
            name: "",
            loading: false,
            validateOnInput: false
        });

        const submit = async (e: {isValid: boolean}) => {
            state.validateOnInput = true;
            if(e.isValid && !state.loading) {
                try {
                    state.loading = true;
                    await updateUser({ name: state.name });
                    replace({ name: 'registerCompleted' });
                    
                } catch (error) {
                    state.loading = false;
                    alert({
                        message: 'Não foi possível realizar a requisição, tente novamente em breve!'
                    });
                }
            }
        };
        return { welcome, name, required, state, submit };
    }
});

export default RegisterName;
</script>

<style>

</style>