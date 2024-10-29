<template>
  <div class="container">
    <AppHeader />
    <div class="quiz-form">
      <h2>문제 생성</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="category">카테고리:</label>
          <input
            type="text"
            id="category"
            v-model="quiz.category"
            required
          />
        </div>
        <div class="form-group">
          <label for="type">타입:</label>
          <input
            type="text"
            id="type"
            v-model="quiz.type"
            required
          />
        </div>
        <div class="form-group">
          <label for="answer">정답:</label>
          <input
            type="text"
            id="answer"
            v-model="quiz.answer"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">해설:</label>
          <textarea
            id="description"
            v-model="quiz.description"
            required
          ></textarea>
        </div>
        <div class="button-container">
          <button type="submit">퀴즈 생성</button>
        </div>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./Header.vue";
import AppFooter from "./Footer.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      quiz: {
        category: "",
        type: "",
        answer: "",
        description: "",
      },
    };
  },
  methods: {
    submitForm() {
      console.log("Quiz Data Submitted:", this.quiz);
    },
  },
};
</script>

<style scoped>
body {
  overflow: hidden; /* 수평 및 수직 스크롤 숨기기 */
  margin: 0;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직으로 중앙 정렬 */
  align-items: center; /* 수평으로 중앙 정렬 */
  box-sizing: border-box;
  padding-top: 80px; /* 헤더 높이만큼 패딩 */
  padding-bottom: 4rem; /* 푸터 높이만큼 패딩 */
}

.quiz-form h2 {
  margin-left: 100px; /* 위아래로 1.5rem의 마진 추가 */
}

.quiz-form {
  width: 100%; /* 부모 요소의 너비를 채움 */
  max-width: 500px; /* 최대 너비를 500px로 설정 */
  height: 70vh; /* 높이를 70vh로 설정하여 더 늘림 */
  margin: 0 auto;
  padding: 1rem;
  overflow-y: auto; /* 내부에서 스크롤 가능하도록 설정 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 폼 요소들을 왼쪽 정렬 */
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.button-container {
  display: flex;
  margin-left: 100px;
  justify-content: center; /* 버튼을 오른쪽으로 정렬 */
}

label {
  width: 100px; /* 라벨의 고정된 너비 설정 */
  margin-right: 1rem;
  text-align: left; /* 라벨의 텍스트 왼쪽 정렬 */
}

input,
textarea {
  flex: 1;
  padding: 0.5rem;
}

textarea {
  min-height: 150px; /* 텍스트 영역의 기본 높이 설정 */
  resize: vertical; /* 사용자가 수직 크기 조정 가능 */
}

button {
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #020906b3;
}
</style>
