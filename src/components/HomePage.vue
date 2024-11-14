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

      <h1 class="welcome-text">
        <span class="welcome-highlight">교사 학습 지원 시스템</span>
      </h1>

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
  background: linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%);
  position: relative;
  overflow: hidden;
}

.background-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 20px;
  animation: float 20s infinite linear;
}

.cloud1 {
  width: 100px;
  height: 40px;
  top: 20%;
  left: -100px;
}

.cloud2 {
  width: 80px;
  height: 30px;
  top: 40%;
  left: -80px;
  animation-delay: -5s;
}

.cloud3 {
  width: 120px;
  height: 45px;
  top: 60%;
  left: -120px;
  animation-delay: -10s;
}

.sun {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 80px;
  height: 80px;
  background: #FFD700;
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.welcome-text {
  font-size: 2.5rem;
  margin-bottom: 50px;
  text-align: center;
}

.welcome-highlight {
  background: white;
  padding: 15px 30px;
  border-radius: 50px;
  color: black;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  .welcome-text {
    font-size: 2rem;
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
