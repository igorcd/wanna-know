import { Directive } from "vue";

let handleOutsideClick: (e: MouseEvent | TouchEvent) => void;
const clickOutDirective: Directive = {
    beforeMount(el, binding) {
        handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            if (!el.contains((e.target as Node))) {
                binding.value();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
    },
    beforeUnmount() {
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
    }
};

export default clickOutDirective;
