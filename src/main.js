// Vue 인스턴스를 생성하는 Entry Point 입니다.

import { createApp } from 'vue'; // createApp을 가져옵니다.
import App from './App.vue';
import router from './router';

// Vue 기능 플래그 명시적 정의
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;

const app = createApp(App);

// 라우터 등록
app.use(router);

// 앱 마운트
app.mount('#app');