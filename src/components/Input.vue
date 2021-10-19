<template>
    <div class="w-full">
        <input class="w-full bg-white bg-opacity-20 text-white placeholder-white font-medium outline-none h-12 px-3 rounded" 
               :class="inputClass"
               :placeholder="placeholder"
               :type="type"
               v-model="handleValue"
               v-mask="mask"
               :autocomplete="autocomplete"
               :name="name"/>
        <p class="text-white text-sm !text-left">{{ error }}</p>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed, inject, Ref, onMounted, PropType } from 'vue';
import { FormField } from './Form.vue';
import { maska } from 'maska';

const Input = defineComponent({
    directives: { 'mask': maska },
    props: {
        inputClass: {
            type: String
        },
        modelValue: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rules: {
            type: Array as PropType<((value: string) => string)[]>,
        },
        mask: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String
        },
        type: {
            type: String,
            default: 'text'
        },
        autocomplete: {
            type: String
        }
    },
    setup(props, context) {
        // Injeção dos dados providos pelo Form
        const addField = inject<(data: FormField) => null>("addField");
        const fields = inject<Ref<FormField[]>>('fields');
        const onInput = inject<() => void>('onInput');

        // Verificação se a referência para esse input possui algum erro
        const error = computed(() => fields?.value.find(el => el.name == props.name)?.error || "");

        const handleValue = computed({
            get: () => props.modelValue,
            set: (value) => {
                context.emit("update:modelValue", value);
                onInput && onInput();
            },
        });

        onMounted(() => {
            // Caso os dados sejam providos pelo form, adicionar uma referência ao Input para que os dados sejam tratados
            
            if(fields && props.rules && addField) {
                addField({ name: props.name, error: "", validation: props.rules });
            }
        });

        return { handleValue, error };
    }
});

export default Input;
</script>

<style>

</style>