import { createRouter, createWebHistory, NavigationGuard } from "vue-router";
import initialize, { initialized, useAuth } from "../hooks/firebase";

// Login
const LoginMainView = () => import(/* webpackChunkName: "login" */'../views/login/LoginMainView.vue');
const PinView = () => import(/* webpackChunkName: "login" */'../views/login/PinView.vue');
const LoginView = () => import(/* webpackChunkName: "login" */'../views/login/LoginView.vue');

// Register
const RegisterView = () => import(/* webpackChunkName: "register" */'../views/register/RegisterView.vue');
const RegisterFinishView = () => import(/* webpackChunkName: "register" */'../views/register/RegisterFinishView.vue');
const RegisterName = () => import(/* webpackChunkName: "register" */'../views/register/RegisterName.vue');

// Panel
const PanelMainView = () => import(/* webpackChunkName: "panel" */'../views/panel/PanelMainView.vue');
const DashboardView = () => import(/* webpackChunkName: "panel" */'../views/panel/dashboard/DashboardView.vue');
const NewSurveyView = () => import(/* webpackChunkName: "panel" */'../views/panel/newSurvey/NewSurveyView.vue');

// Voto
const SurveyMainView = () => import(/* webpackChunkName: "survey" */'../views/survey/SurveyMainView.vue');


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