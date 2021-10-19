<template>
    <textarea rows="1"
              ref="textArea"
              class="px-4 light-scroll resize-none outline-none bg-transparent dark:text-white"
              :placeholder="placeholder"
              :value="modelValue"
              @keydown.enter="textAreaSubmit"
              @input="textAreaInput"></textarea>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';


const AutoSizeTextArea = defineComponent({
    props: {
        modelValue: {
            type: String,
            required: true
        },
        placeholder: {
            type: String
        }
    },
    setup(props, context){
       
        const textAreaSubmit = (e: KeyboardEvent) => {
            if(!e.shiftKey) {
                e.preventDefault();
                context.emit('onSubmit');
            }
        };

        const textAreaInput = (e: Event) => {
            const el = (e.target as HTMLTextAreaElement);
            el.style.height = 'auto';
            if(el.scrollHeight > 140) {
                el.style.height = '140px';
                el.style.overflow = 'auto';
            }
            else {
                el.style.height = el.scrollHeight + 'px';
                el.style.overflow = 'hidden';
            }
            context.emit('update:modelValue', el.value);
        };

  

        return { textAreaSubmit, textAreaInput };
    }
});

export default AutoSizeTextArea;
</script>

<style>

</style>