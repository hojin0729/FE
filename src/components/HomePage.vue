<template>
  <div class="home-container">
    <AppHeader />
    <div class="content">
      <div class="main-content">
        <img src="@/assets/mainChick.png" alt="메인 병아리" class="main-chick" />
        <div class="buttons-container">
          <button class="menu-button" @click="$router.push('/quizboard')">
            <span class="button-text">퀴즈 게시판</span>
          </button>
          <button class="menu-button" @click="$router.push('/articles')">
            <span class="button-text">자유 게시판</span>
          </button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./Header.vue";
import AppFooter from "./Footer.vue";

export default {
  name: "HomePage",
  components: {
    AppHeader,
    AppFooter,
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FFF9E6;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
  margin-bottom: 40px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.main-chick {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
  animation: bounce 2s infinite ease-in-out;
}

.buttons-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
}

.menu-button {
  width: 300px;
  height: 200px;
  background-color: #FFD93D;
  color: #4A4A4A;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.menu-button:hover {
  transform: translateY(-5px);
  background-color: #FFC107;
}

.button-text {
  font-weight: bold;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .main-chick {
    width: 150px;
  }

  .buttons-container {
    flex-direction: column;
    gap: 20px;
  }

  .menu-button {
    width: 250px;
    height: 150px;
    font-size: 20px;
  }
}
</style>
