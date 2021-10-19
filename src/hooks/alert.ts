import { Plugin, createApp } from 'vue';
import Alert from '../components/Alert.vue';

export interface AlertOption {
    icon: string;
    action?: () => void;
}

let useAlert: () => ((options: { title?: string; message: string; options?: AlertOption[]; animation?: string; detail?: string}) => void);

const alert: Plugin = {
    install: () => {
        const alertRoot = createApp(Alert).mount(document.body.appendChild(document.createElement('div')));
        useAlert = () => (alertRoot as any).displayAlert;
    }
};

export { useAlert };

export default alert;