<template>
  <div class="container">
    <AppHeader />
    <div class="quiz-form">
      <h2>문제 생성</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="category">카테고리:</label>
          <select id="category" v-model="quiz.quizCategory" required>
            <option disabled value="">카테고리를 선택하세요</option>
            <option value="용돈관리">용돈관리</option>
            <option value="화폐">화폐</option>
            <option value="신용과 위험관리">신용과 위험관리</option>
            <option value="개인정보보호와 금융사기 예방">개인정보보호와 금융사기 예방</option>
            <option value="금융회사">금융회사</option>
            <option value="화폐와 환율">화폐와 환율</option>
            <option value="현명한 소비">현명한 소비</option>
            <option value="신용과 부채관리">신용과 부채관리</option>
            <option value="저축">저축</option>
            <option value="위험관리와 보험">위험관리와 보험</option>
            <option value="금융시사">금융시사</option>
            <option value="금융권 진로탐색">금융권 진로탐색</option>
          </select>
        </div>
        <div class="form-group">
          <label for="quiz">퀴즈 제목:</label>
          <input type="text" id="quiz" v-model="quiz.quizTitle" required />
        </div>
        <div class="form-group">
          <label for="type">타입:</label>
          <input type="text" id="type" v-model="quiz.quizType" value="O/X" readonly />
        </div>
        <div class="form-group">
          <label for="level">난이도:</label>
          <select id="level" v-model="quiz.quizLevel" required>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div class="form-group">
          <label for="answer">정답:</label>
          <select id="answer" v-model="quiz.quizAnswer" required>
            <option disabled value="">정답을 선택하세요</option>
            <option value="O">O</option>
            <option value="X">X</option>
          </select>
        </div>
        <div class="form-group">
          <label for="description">해설:</label>
          <textarea id="description" v-model="quiz.quizDescription" required></textarea>
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
import axios from "axios";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      quiz: {
        memberId: localStorage.getItem("memberId"), 
        quizCategory: "",
        quizTitle: "",
        quizType: "O / X",
        quizAnswer: "",
        quizDescription: "",
        quizLevel: "normal" // 기본값 설정
      },
    };
  },
  methods: {
    async submitForm() {
  try {
    const token = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다."); // 로그인 체크는 유지
      this.$router.push("/login");
      return;
    }
    const beUrl = process.env.VUE_APP_BE_API_URL;
    await axios.post( beUrl +"/api/v1/quizs", this.quiz, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });

    // 퀴즈 생성 후 메인 페이지로 리디렉션
    this.$router.push("/quizboard");
  } catch (error) {
    console.error("Failed to create quiz:", error);
    alert("퀴즈 생성에 실패했습니다. 다시 시도해 주세요.");
  }
}

  },
};
</script>

<style scoped>
body {
  overflow: hidden;
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
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-top: 80px;
  padding-bottom: 4rem;
}

.quiz-form h2 {
  margin-left: 100px;
}

.quiz-form {
  width: 100%;
  max-width: 500px;
  height: 70vh;
  margin: 0 auto;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.button-container {
  display: flex;
  margin-left: 100px;
  justify-content: center;
}

label {
  width: 100px;
  margin-right: 1rem;
  text-align: left;
}

input,
select,
textarea {
  flex: 1;
  padding: 0.5rem;
}

textarea {
  min-height: 150px;
  resize: vertical;
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
