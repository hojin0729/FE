// Vue 인스턴스. 라우팅 하는 경로가 아니라, '라우터' 를 추가할 수 있음.

import { createApp } from 'vue'; // createApp을 가져옵니다.
import App from './App.vue';
import router from './router';

// Vue 3 부터는 이렇게 해야 한다고 해요
createApp(App) // createApp을 사용하여 앱 인스턴스를 생성합니다.
  .use(router) // 라우터를 등록합니다.
  .mount('#app'); // 앱을 DOM에 마운트합니다.