import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../components/UserLogin';
import UserRegister from '../components/UserRegister.vue';
import MedicalRecordsHome from '../components/MedicalRecordsHome';
import PatientHomePage from '@/components/PatientHomePage';
const routes = [
    {
        path: '/',
        name: 'UserLogin',
        component: UserLogin,
    },
    {
        path: '/register',
        name: 'UserRegister',
        component: UserRegister,
    },
    {
        path: '/medical-records-home',
        name: 'MedicalRecordsHome',
        component: MedicalRecordsHome,
    },
    {
        path: '/patienthome',
        name: 'PatientHomePage',
        component: PatientHomePage,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
