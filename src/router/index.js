// 라우팅하는 라우터 파일

import { createRouter, createWebHistory } from 'vue-router'; // createRouter와 createWebHistory를 가져옵니다.
import HomePage from '../components/HomePage.vue';
import QuizForm from '@/components/QuizForm.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/quizForm',
    name: "QuizForm",
    component: QuizForm
  }
];

// Vue 3 부터는 이렇게 해야 한다고 해요
const router = createRouter({
  history: createWebHistory(), // createWebHistory를 사용하여 히스토리 모드를 설정합니다.
  routes
});

export default router;