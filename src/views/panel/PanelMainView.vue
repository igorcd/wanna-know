<template>
    <div class="min-h-screen relative">

        <!-- Menu -->
        <header class="flex items-center absolute right-5 top-5 sm:right-9 sm:top-6">
            <!-- Moto noturno -->
            <DarkModeToogle icon="moon" size="3rem" iconSize="1.5rem"/>

            <Divider :vertical="true" class="mr-5 ml-2"/>

            <!-- Perfil -->
            <Dropdown>
                <template #default>
                    <button class="flex items-center sm:hover:bg-white/20 rounded-lg p-2">
                        <CircleAvatar :name="userName" class="cursor-pointer"/>
                    </button>
                </template>
                <template #content>
                    <div class="w-40">
                        <DropdownItem label="Sair" @click="openLogoutModal"/>
                    </div>
                </template>

            </Dropdown>
        </header>

        <!-- Conteúdo -->
        <RouterView #default="{ Component }">
            <Transition name="fade" mode="out-in">
                <component :is="Component"/>
            </Transition>
        </RouterView>

    </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Text, Dropdown, DropdownItem, IconButton, CircleAvatar, Divider, DarkModeToogle } from '../../components';
import { useAlert } from '../../hooks/alert';
import { useAuth } from '../../hooks/firebase';


const PanelMainView = defineComponent({
    components: { Text, Dropdown, DropdownItem, IconButton, CircleAvatar, Divider, DarkModeToogle },
    setup() {
        const { logout, getUser } = useAuth();
        const { replace } = useRouter();
        const alert = useAlert();

        const userName = computed(() => {
            const user = getUser();
            return user?.displayName;
        });

        const signout = async () => {
            try {
                await logout();
                replace({ name: 'pin' });

            } catch (error) {
                alert({
                    message: "Não foi possivel fazer o logout, por favor, tente novamente em breve!"
                });
            }
        };

        const openLogoutModal = () => {
            alert({
                title: "Sair",
                message: "Tem certeza que deseja sair?",
                options: [
                    {
                        icon: "times",
                    },
                    {
                        icon: "check",
                        action: () => signout()

                    }
                ]
            });
        };

        return { logout, openLogoutModal, userName };
    }
});

export default PanelMainView;
</script>

<style>

</style>