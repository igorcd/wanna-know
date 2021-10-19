<template>
    <div class="w-full h-44 sm:w-44 rounded-lg 
                border border-white flex flex-col items-center justify-center cursor-pointer 
              bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-30 active:scale-90 transform  transition-all duration-200 mx-3">
        <Icon icon="survey" color="white" size="3rem" class="mb-4"/>
        <Text type="caption">Criar enquete</Text>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { Icon, Text } from '../../../components';

const AddSuveyCard = defineComponent({
    components: { Icon, Text }
});

export default AddSuveyCard;
</script>

<style>

</style>