<template>
  <header class="app-header">
    <img src="@/assets/image.png" alt="Header Image" class="header-image" @click="goToHome" />
    <nav class="nav-bar">
      <ul>
        <li>
          <a v-if="!isLoggedIn" href="/login" @click.prevent="navigateToLogin">로그인</a>
          <a v-else href="#" @click.prevent="logout">로그아웃</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "AppHeader",
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();

    // 페이지 로드 시 JWT 토큰이 존재하는지 확인하여 로그인 상태 설정
    onMounted(() => {
      isLoggedIn.value = !!localStorage.getItem('jwtToken');
    });

    function goToHome() {
      router.push({ path: '/' });
    }

    function navigateToLogin() {
      router.push('/login'); // 로그인 페이지로 이동
    }

    function login() {
      // 여기에 실제 로그인 로직 추가 (예: 서버에 로그인 요청 후 JWT 토큰 수신)
      const jwtToken = "exampleToken";
      localStorage.setItem('jwtToken', jwtToken); // JWT 토큰을 로컬스토리지에 저장
      isLoggedIn.value = true;

      
    }

    function logout() {
  // 로그아웃 시 모든 관련 데이터 삭제
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('memberId');
  localStorage.removeItem('memberNickname');
  isLoggedIn.value = false;
  
  // 홈 페이지로 이동
  router.push('/login');
}


    return {
      isLoggedIn,
      goToHome,
      login,
      logout,
      navigateToLogin,
    };
  },
};
</script>



<style scoped>
.app-header {
  background-color: #FFF;
  height: 100px; /* 헤더 높이를 명확하게 지정 */
  padding: 1rem 2rem; /* 좌우 여백을 늘려줌 */
  color: black;
  display: flex;
  justify-content: space-between; /* 이미지와 내비게이션 사이의 공간을 확보 */
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 헤더를 다른 요소 위에 위치시키기 위한 z-index */
  box-sizing: border-box; /* 패딩을 포함한 전체 너비 계산 */
  border-bottom: 2px solid #ddd; /* 구분 선 추가 */
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

nav a {
  color: black;
  text-decoration: none;
}

.header-image {
  height: 80px; /* 이미지 높이 설정 */
  width: auto; /* 가로 비율을 자동으로 설정 */
}
</style>
