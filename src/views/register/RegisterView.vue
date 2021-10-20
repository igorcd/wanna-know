<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">

        <div class="relative">
            <div class="w-44 h-44 flex items-center justify-center overflow-hidden">
                <Lottie animation="register" size="250px"/>
            </div>

            <div class="absolute left-[calc(100%-10px)] top-2 -rotate-12 hidden sm:block">
                <div class="p-4 w-56 bg-white rounded-lg relative">
                    <p class="leading-5 text-center">Se registrando você pode criar suas próprias enquetes</p>
                    <div class="w-4 h-4 absolute bg-white rounded-bl rotate-45 -left-2 top-[calc(50%-0.5rem)]"></div>
                </div>
            </div>
        </div>

        <Text type="headline1" class="mb-6 2xl:mb-12">Registrar</Text>

        <Form class="w-full max-w-screen-sm m-4 flex flex-col items-center" @onSubmit="submit" :validateOnInput="state.validateOnInput">
            <Input v-model="state.email" name="email"
                   placeholder="Email" class="mb-4" :rules="[required, validEmail]"/>

            <Input v-model="state.password" name="senha" 
                   autocomplete="senha"
                   placeholder="Senha" class="mb-4"
                   :rules="[required, (value) => minLength(value, 6)]"
                   type="password"/>

            <Input v-model="state.confirmPassword" name="confirmar senha"
                   autocomplete="confirmar-senha"
                   placeholder="Confirmar senha" class="mb-10" 
                   :rules="[
                       required, 
                       (value) => isSame(value, state.password),
                       (value) => minLength(value, 6)
                   ]" 
                   type="password"/>
            
            <Button class="md:w-96">
                <Transition name="fade" mode="out-in">
                    <Loading v-if="state.loading" color="var(--primary-color)"/>
                    <div v-else>Confirmar</div>
                </Transition>
            </Button>
        </Form>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import { Text, Form, Input, Button, Loading, Lottie } from '../../components';
import { useAlert } from '../../hooks/alert';
import { useAuth } from '../../hooks/firebase';
import { required, isSame, validEmail, minLength } from '../../utils/validators';
import { useRouter } from 'vue-router';

const RegisterView = defineComponent({
    components: { Text, Form, Input, Button, Loading, Lottie },
    setup() {

        const { register } = useAuth();
        const { replace } = useRouter();

        const alert = useAlert();

        const state = reactive({
            email: '',
            password: '',
            confirmPassword: '',
            loading: false,
            validateOnInput: false
        });

        const submit = async (e: { isValid: boolean}) => {
            state.validateOnInput = true;
            if(!state.loading && e.isValid) {
                try {
                    state.loading = true;
                    await register({ email: state.email, password: state.password });
                    replace({ name: 'registerName' });
                    
                } catch (e) {
                    const error = e as string;
                    alert({ message: error });
                    state.loading = false;
                }
            }
        };

        return { state, submit, required, isSame, validEmail, minLength };
    }
});

export default RegisterView;
</script>

        <style>

        </style>