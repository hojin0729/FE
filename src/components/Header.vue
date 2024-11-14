<template>
  <header class="app-header">
    <img src="@/assets/image.png" alt="Header Image" class="header-image" @click="goToHome" />
    <nav class="nav-bar">
      <ul>
        <template v-if="isLoggedIn">
          <li>
            <a href="/mypage" @click.prevent="goToMyPage">마이페이지</a>
          </li>
          <li>
            <a href="#" @click.prevent="logout">로그아웃</a>
          </li>
        </template>
        <li v-else>
          <a href="/login" @click.prevent="navigateToLogin">로그인</a>
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

    onMounted(() => {
      isLoggedIn.value = !!localStorage.getItem('jwtToken');
    });

    function goToHome() {
      router.push({ path: '/' });
    }

    function goToMyPage() {
      router.push('/mypage');
    }

    function navigateToLogin() {
      router.push('/login');
    }

    function logout() {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('memberId');
      localStorage.removeItem('memberNickname');
      isLoggedIn.value = false;
      router.push('/login');
    }

    return {
      isLoggedIn,
      goToHome,
      goToMyPage,
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

.nav-bar {
  display: flex;
  align-items: center;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

nav a {
  color: black;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-weight: 500; /* 글자를 조금 더 굵게 */
}

.header-image {
  height: 80px; /* 이미지 높이 설정 */
  width: auto; /* 가로 비율을 자동으로 설정 */
}
</style>
