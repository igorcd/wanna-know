<template>
    <label :class="[{ 'border-solid shadow-lg scale-105': dragOver }, { 'border-dashed': !dragOver }]"
           class="bg-white bg-opacity-20  w-32 h-32  rounded-full flex flex-col justify-center items-center transition-all duration-300 transform relative cursor-pointer">
        
        <Icon icon="user" color="white" size="50px"/>
        <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" @change="fileChange" ref="inputRef"/>

        <!-- Mascara -->
        <div class="absolute w-full h-full bg-center bg-cover flex items-center justify-center group rounded-full"
             :class="{'bg-white': modelValue}"
             :style="{'background-image': modelValue ? `url(${modelValue})` : ''}"
             @dragover="(e) => e.preventDefault()"
             @dragenter="dragEnter"
             @dragleave="dragLeave"
             @drop="drop">
            <div class="w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100  transition-opacity duration-300 rounded-full"
                 style="backdrop-filter: blur(2px)">
                <Icon color="white" icon="edit" size="35px"/>
            </div>
        </div>

    </label>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue';
import Icon from './Icon.vue';

const ImageSelector = defineComponent({
    components: { Icon },
    props: {
        modelValue: {
            type: String,
            required: true
        }
    },
    setup(props, context){
        const inputRef = ref<HTMLInputElement | null>(null);

        const dragOver = ref(false);

        watch(() => props.modelValue, () => {
            if(inputRef.value) {
                inputRef.value.value = '';
            }
        });
        
        // Métodos
        const loadFile = (file: File) => {

            if(file.size < 800 * 1024) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    if(reader.result) {
                        context.emit('update:modelValue', reader.result.toString());
                    }
                };
      
                reader.readAsDataURL(file);

            }
            else {
                context.emit('error', 'As imagens devem possuir no máximo 800kb');
                if(inputRef.value) {
                    inputRef.value.value = "";
                }
            }
        };
        
        const dragEnter = (e: DragEvent) => {
            e.preventDefault();
            dragOver.value = true;
        };

        const dragLeave = (e: DragEvent) => {
            e.preventDefault();
            dragOver.value = false;
        };

        const drop = (e: DragEvent) => {
            e.preventDefault();
            dragOver.value = false;
            const file = e.dataTransfer!.files[0];

            if(file != null && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                loadFile(file);
            }
        };

        const fileChange = (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if(files != null && files[0] != null) {
                loadFile(files[0]);
            }
        };

        return { dragEnter, dragLeave, drop, fileChange, inputRef, dragOver };
    }
});

export default ImageSelector;
</script>

<style>

</style>