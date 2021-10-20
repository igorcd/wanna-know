<template>
    <div class="w-full max-w-md relative">

        <Text type="headline1" class="mb-2 text-center">
            Login
        </Text>
        
        <Text type="subheader" class="text-center  mb-20">Acesse a sua conta para criar enquetes</Text>
        <Form @onSubmit="submit">
            <Input v-model="state.email" 
                   name="e-mail" 
                   placeholder="E-mail" class="mb-4"
                   :rules="[required]"
                   type="email"
                   autocomplete="email"/>
            <Input v-model="state.password" name="senha" 
                   type="password"
                   placeholder="Senha" class="mb-4"
                   :rules="[required]"/>
            <Button>
                <transition name="fade" mode="out-in">
                    <Loading v-if="state.loading" color="var(--primary-color)"/>
                    <div v-else>Acessar</div>
                </transition>
            </Button>
        </Form>

        <Divider class="my-4"></Divider>

        <div class="flex justify-center mb-10">
            <IconButton icon="facebook" size="50px" iconSize="25px" class="border border-white mx-2"/>
            <IconButton icon="google" size="50px" iconSize="25px" class="border border-white mx-2"/>
            <IconButton icon="phone" size="50px" iconSize="25px" class="border border-white mx-2"/>
        </div>

        <TextButton class="mx-auto" @click="$router.replace({ name: 'register' })">Registrar</TextButton>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';

import { Input, Button,Form,IconButton, Text, Divider, TextButton, Loading } from '../../components';
import { required } from '../../utils/validators';
import { useRouter } from 'vue-router';
import { useAlert } from '../../hooks/alert';
import { useAuth } from '../../hooks/firebase';

const LoginView = defineComponent({
    components: { Input, Button, Form, IconButton, Text, Divider, TextButton, Loading },
    setup() {

        const { replace } = useRouter();
        const alert = useAlert();

        const { login } = useAuth();
        
        const state = reactive({
            loading: false,
            email: '',
            password: ''
        });

        const submit = async (data: { isValid: boolean; errors: string[]}) => {
            if(data.isValid) {
                try {
                    state.loading = true;
                    const user = await login({ email: state.email, password: state.password });
                    user.displayName ? replace({ name: 'dashboard' }) : replace({ name: 'registerName' });
                    

                } catch (e) {
                    const error = e as string;
                    state.loading = false;
                    alert({
                        message: error
                    });
                }
            }
        };

        return { state, required, submit };
    }
});

export default LoginView;
</script>

<style>

</style>