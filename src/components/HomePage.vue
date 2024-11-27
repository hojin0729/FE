<template>
  <div class="home-container">
    <div class="video-container">
      <video autoplay muted loop playsinline class="background-video">
        <source src="@/assets/123.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <AppHeader />
      <!-- 검은색 오버레이 추가 -->
      <div class="overlay"></div>
      <!-- 중앙 메시지 추가 -->
      <div class="center-message">{{ currentMessage }}</div>
      <!-- 스크롤 안내 추가 -->
      <div class="scroll-indicator">
        <div class="arrow">&nbsp;&nbsp;&nbsp;&gt;</div>
      </div>
    </div>
    <div class="content">
      <div class="title-container">
        <img src="@/assets/title.png" alt="돈 기브 업!" class="title-image" />
      </div>
      <div class="features-container">
        <div class="feature-card quiz" @click="$router.push('/quizboard')">
          <div class="icon-container">하나!</div>
          <h2>퀴즈 게시판</h2>
          <p>선생님들이 직접 만드는 교육 퀴즈</p>
          <ul>
            <li>다양한 주제의 퀴즈 제작</li>
            <li>학습 자료 공유</li>
            <li>퀴즈 피드백과 토론</li>
          </ul>
        </div>
        <div class="feature-card community" @click="$router.push('/articles')">
          <div class="icon-container">둘!</div>
          <h2>자유 게시판</h2>
          <p>교육자들을 위한 소통 공간</p>
          <ul>
            <li>교육 경험 공유</li>
            <li>교수법 토론</li>
            <li>자유로운 의견 교환</li>
          </ul>
        </div>
        <div class="feature-card classroom" @click="$router.push('/mypage')">
          <div class="icon-container">셋!</div>
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

/* eslint-disable */
<script>
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import AppHeader from "./Header.vue";

export default {
  name: "HomePage",
  components: {
    AppHeader,
  },
  setup() {
    const messages = [
      "지식을 넓히고 도전하세요!",
    "자유 게시판에서 함께 소통하세요!",
    "나만의 학습방을 완성해보세요!",
    "교육 퀴즈로 재미있게 배우세요!"
    ];
    const currentMessageIndex = ref(0);

    // 메시지를 현재 인덱스에 따라 계산
    const currentMessage = computed(() => messages[currentMessageIndex.value]);

    // 메시지 변경 간격 설정
    let messageInterval = null;
    onMounted(() => {
      messageInterval = setInterval(() => {
        currentMessageIndex.value =
          (currentMessageIndex.value + 1) % messages.length;
      }, 4000); // 메시지가 4초 간격으로 변경
    });

    // 컴포넌트 언마운트 시 Interval 정리
    onBeforeUnmount(() => {
      clearInterval(messageInterval);
    });

    return {
      currentMessage, // 템플릿에 반환
    };
  },
};
</script>


<style scoped>
.home-container {
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  width: 100vw; /* 전체 화면 너비 */
  height: 100vh; /* 전체 화면 높이 */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0; /* 상단 여백 제거 */
  padding: 0; /* 패딩 제거 */
  box-sizing: border-box; /* 패딩과 보더가 너비와 높이에 포함되도록 설정 */
  overflow: auto; /* 스크롤 활성화 */
}

.video-container {
  position: relative; /* 내부 요소의 z-index를 관리하기 위해 relative로 설정 */
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 스크롤 안내 */
.scroll-indicator {
  position: absolute; /* 동영상 위에 고정 */
  bottom: 50px; /* 동영상 하단에서 여백 */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 10; /* 동영상 위로 나오도록 높은 값 설정 */
}
/* 메시지 스타일 */
.scroll-indicator .scroll-message {
  font-size: 16px;
  margin-top: 10px;
  font-weight: bold;
  animation: fadeInOut 3s ease-in-out infinite;
  z-index: 10; /* 명시적으로 높은 z-index 설정 */
}
/* 화살표 스타일 */
.scroll-indicator .arrow {
  font-size: 40px; /* 화살표 크기 */
  transform: rotate(90deg); /* < 를 아래로 회전 */
  display: inline-block;
  animation: moveArrow 1.5s infinite ease-in-out; /* 움직이는 애니메이션 */
}

/* 애니메이션 */
@keyframes moveArrow {
  0% {
    transform: translateY(0) rotate(90deg);
  }
  50% {
    transform: translateY(15px) rotate(90deg); /* 아래로 이동 */
  }
  100% {
    transform: translateY(0) rotate(90deg); /* 원래 위치로 복귀 */
  }
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 반투명 검은색 */
  z-index: 5; /* 텍스트 아래에 표시 */
}
.center-message {
  position: absolute; /* 부모 요소에 상대적인 위치 */
  top: 50%; /* 세로 중앙 정렬 */
  left: 50%; /* 가로 중앙 정렬 */
  transform: translate(-50%, -50%); /* 중앙 정렬을 위한 변환 */
  font-size: 54px; /* 텍스트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  color: white; /* 텍스트 색상 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* 텍스트 그림자 */
  text-align: center; /* 텍스트 가운데 정렬 */
  z-index: 10; /* 동영상 위로 표시 */
  animation: fadeInOut 4s ease-in-out infinite; /* 메시지 주기와 동일한 애니메이션 */
}

/* fadeInOut 애니메이션 */
@keyframes fadeInOut {
  0% {
    opacity: 0; /* 텍스트가 보이지 않음 */
    transform: translate(-50%, -50%) scale(0.9); /* 약간 축소된 상태 */
  }
  20% {
    opacity: 1; /* 텍스트가 나타남 */
    transform: translate(-50%, -50%) scale(1); /* 원래 크기 */
  }
  80% {
    opacity: 1; /* 텍스트 유지 */
    transform: translate(-50%, -50%) scale(1); /* 크기 유지 */
  }
  100% {
    opacity: 0; /* 텍스트가 다시 사라짐 */
    transform: translate(-50%, -50%) scale(1.1); /* 약간 확대된 상태 */
  }
}
.content {
  position: relative;
  z-index: 2; /* 콘텐츠가 동영상 위로 올라오게 설정 */
  background: #f9f9f9;
  padding: 100px;
}

.title-container {
  margin-bottom: 110px;
  text-align: center;
}

.title-image {
  max-width: 500px;
  width: 100%;
  height: auto;
  margin-top: 30px;
}

.features-container {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  padding: 0 20px;
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
  cursor: pointer;
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
