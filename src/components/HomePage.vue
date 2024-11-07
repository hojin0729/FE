<template>
  <div class="home-container">
    <AppHeader />
    <div class="content">
      <div class="buttons-container">
        <button class="menu-button" @click="$router.push('/quizboard')">
          <span class="button-text">퀴즈 게시판</span>
        </button>
        <button class="menu-button" @click="$router.push('/generalforum')">
          <span class="button-text">자유 게시판</span>
        </button>
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
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 80px; /* 헤더 높이만큼 여백 */
  margin-bottom: 40px; /* 푸터 높이만큼 여백 */
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
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
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
  background-color: #020906b3;
}

.button-text {
  font-weight: bold;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
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
