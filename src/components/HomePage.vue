<template>
  <div class="home-container">
    <AppHeader />
    <div class="content">
      <div class="title-container">
        <img src="@/assets/title.png" alt="돈 기브 업!" class="title-image">
      </div>

      <div class="features-container">
        <div class="feature-card quiz">
          <div class="icon-container">
            하나!
          </div>
          <h2>퀴즈 게시판</h2>
          <p>선생님들이 직접 만드는 교육 퀴즈</p>
          <ul>
            <li>다양한 주제의 퀴즈 제작</li>
            <li>학습 자료 공유</li>
            <li>퀴즈 피드백과 토론</li>
          </ul>
        </div>

        <div class="feature-card community">
          <div class="icon-container">
            둘!
          </div>
          <h2>자유 게시판</h2>
          <p>교육자들을 위한 소통 공간</p>
          <ul>
            <li>교육 경험 공유</li>
            <li>교수법 토론</li>
            <li>자유로운 의견 교환</li>
          </ul>
        </div>

        <div class="feature-card classroom">
          <div class="icon-container">
            셋!
          </div>
          <h2>마이 페이지</h2>
          <p>나만의 학습방 만들기</p>
          <ul>
            <li>맞춤형 퀴즈방 생성</li>
            <li>원하는 퀴즈 선택 및 구성</li>
            <li>학생들의 학습 진행 관리</li>
          </ul>
        </div>
      </div>
    </div>
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
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  margin-top: 150px;
  margin-bottom: 40px;
}

.title-container {
  margin-bottom: 50px;
  margin-top: -30px;
}

.title-image {
  max-width: 500px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.features-container {
  display: flex;
  gap: 30px;
  margin-top: 50px;
  padding: 0 20px;
  max-width: 1200px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: 2px solid #3f2702;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.icon-container {
  background: #3f2702;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  font-family: 'Noto Sans KR', sans-serif;
}

.icon-container i {
  display: none;
}

.feature-card h2 {
  color: #3f2702;
  font-size: 24px;
  margin-bottom: 15px;
  text-align: center;
}

.feature-card p {
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
}

.feature-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-card ul li {
  color: #555;
  margin-bottom: 10px;
  padding-left: 25px;
  position: relative;
  font-size: 15px;
}

.feature-card ul li::before {
  content: "✓";
  color: #3f2702;
  position: absolute;
  left: 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .features-container {
    flex-direction: column;
    align-items: center;
  }

  .feature-card {
    width: 100%;
    max-width: none;
  }
}
</style>
