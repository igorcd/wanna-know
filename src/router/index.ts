import { createRouter, createWebHistory, NavigationGuard } from "vue-router";
import initialize, { initialized, useAuth } from "../hooks/firebase";

import LoginMainView from '../views/login/LoginMainView.vue';
import LoginView from '../views/login/LoginView.vue';
import PinView from '../views/login/PinView.vue';
import RegisterView from '../views/register/RegisterView.vue';
import RegisterFinishView from '../views/register/RegisterFinishView.vue';
import RegisterName from '../views/register/RegisterName.vue';

// Panel
import PanelMainView from '../views/panel/PanelMainView.vue';
import DashboardView from '../views/panel/dashboard/DashboardView.vue';
import NewSurveyView from '../views/panel/newSurvey/NewSurveyView.vue';

// Voto
import SurveyMainView from '../views/survey/SurveyMainView.vue';


// NavigationGuards
const authenticationGuard: NavigationGuard = (to, from, next) => {
    const { getUser } = useAuth();
    const user = getUser();
    user && !user.isAnonymous ? next() : next({ name: 'pin' });
};

const loginGuard: NavigationGuard = (to, from, next) => {
    const { getUser } = useAuth();
    const user = getUser();
    user && !user.isAnonymous ? next({ name: 'dashboard' }) : next();
};

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: LoginMainView,
            children: [
                {
                    path: '',
                    name: 'pin',
                    component: PinView
                },
                {
                    path: 'login',
                    name: 'login',
                    beforeEnter: loginGuard,
                    component: LoginView
                }
            ]
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/registercompleted',
            name: 'registerCompleted',
            component: RegisterFinishView
        },
        {
            path: '/name',
            name: 'registerName',
            component: RegisterName
        },
        {
            path: '/survey/:id',
            name: 'survey',
            component: SurveyMainView
        },
        {
            path: '/panel',
            component: PanelMainView,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    beforeEnter: authenticationGuard,
                    component: DashboardView
                },
                {
                    path: 'newsurvey',
                    name: 'newSurvey',
                    beforeEnter: authenticationGuard,
                    component: NewSurveyView
                }
            ]
        },
    ]
});

router.beforeEach(async() => {
     
    // Inicializar o firebase
    if(!initialized()) {
        await initialize();
    }
   
});

export default router;