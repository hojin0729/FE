<template>
  <div class="home-container">
    <AppHeader />
    <div class="content">
      <div class="background-decorations">
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
        <div class="sun"></div>
      </div>

      <div class="title-container">
        <img src="@/assets/title.png" alt="돈 기브 업!" class="title-image">
      </div>

      <div class="buttons-container">
        <button class="menu-button quiz-button" @click="$router.push('/quizboard')">
          <div class="button-inner">
            <i class="fas fa-question-circle icon"></i>
            <span class="button-text">퀴즈 게시판</span>
            <span class="button-description">학습 자료 및 퀴즈 관리</span>
          </div>
        </button>
        <button class="menu-button board-button" @click="$router.push('/articles')">
          <div class="button-inner">
            <i class="fas fa-comments icon"></i>
            <span class="button-text">자유 게시판</span>
            <span class="button-description">교사 커뮤니티 공간</span>
          </div>
        </button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./Header.vue";
// import AppFooter from "./Footer.vue";

export default {
  name: "HomePage",
  components: {
    AppHeader,
    // AppFooter,
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('@/assets/dgu_ground.png') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  overflow: hidden;
}

.home-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
  margin-bottom: 40px;
}

.title-container {
  margin-bottom: 50px;
}

.title-image {
  max-width: 500px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.buttons-container {
  display: flex;
  gap: 100px;
  justify-content: center;
  align-items: stretch;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  margin-right: 70px;
}

.menu-button {
  flex: 1;
  max-width: 400px;
  min-height: 250px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 0;
}

.button-inner {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.quiz-button .button-inner {
  border: 4px solid #2196F3;
}

.board-button .button-inner {
  border: 4px solid #4CAF50;
}

.menu-button:hover .button-inner {
  transform: translateY(-5px);
}

.menu-button:active .button-inner {
  transform: translateY(4px);
}

.icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #2196F3;
}

.board-button .icon {
  color: #4CAF50;
}

.button-text {
  font-size: 36px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;

}

.button-description {
  font-size: 16px;
  color: #666;
  text-align: center;
}

@keyframes float {
  from { transform: translateX(-100%); }
  to { transform: translateX(100vw); }
}

@media (max-width: 768px) {
  .title-image {
    max-width: 300px;
  }

  .buttons-container {
    flex-direction: column;
    gap: 50px;
  }

  .menu-button {
    width: 100%;
    min-height: 200px;
  }
}
</style>
