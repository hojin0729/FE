// 라우팅하는 라우터 파일

import { createRouter, createWebHistory } from 'vue-router'; // createRouter와 createWebHistory를 가져옵니다.
import HomePage from '../components/HomePage.vue';
import QuizForm from '@/components/QuizForm.vue';
import QuizBoard from '@/components/QuizBoard.vue';
import QuizDetailPage from '@/components/QuizDetailPage.vue';
import Login from '@/components/Login.vue';
import SignUpForm from '@/components/SignUpForm.vue';
import ArticleForm from '@/components/ArticleForm.vue';
import MyPage from '@/components/MyPage.vue';
import Articles from '@/components/Articles.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/quizform',
    name: "QuizForm",
    component: QuizForm
  },
  {
    path: '/quizboard',
    name: "QuizBoard",
    component: QuizBoard
  },
  {
    path: '/quiz/:id',
    name: "QuizDetail",
    component: QuizDetailPage
  },
  {
    path: '/login',
    name: "Login",
    component: Login
  },
  {
    path: '/signup', 
    name: "SignUp",
    component: SignUpForm
  },
  {
    path: '/articleform',
    name: "ArticleForm",
    component: ArticleForm
  },
  {
    path: '/mypage',
    name: "MyPage",
    component: MyPage
  },
  {
    path: '/articles',
    name: "Articles",
    component: Articles
  }
];

// Vue 3 부터는 이렇게 해야 한다고 해요
const router = createRouter({
  history: createWebHistory(), // createWebHistory를 사용하여 히스토리 모드를 설정합니다.
  routes
});

export default router;