<template>
    <div class="quiz-board">
      <h2>퀴즈 게시판</h2>
      <ul class="quiz-list">
        <li v-for="quiz in quizzes" :key="quiz.id" class="quiz-item">
          <span class="quiz-title">{{ quiz.title }}</span>
          <span class="quiz-category">{{ quiz.category }}</span>
          <button @click="viewQuiz(quiz)">보기</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "QuizBoard",
    props: {
      quizzes: {
        type: Array,
        required: true,
      },
    },
    methods: {
      viewQuiz(quiz) {
        // 퀴즈 상세 페이지로 이동 (또는 팝업으로 퀴즈 내용 표시)
        alert(`퀴즈: ${quiz.title}\n카테고리: ${quiz.category}\n정답: ${quiz.answer}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .quiz-board {
    padding: 1rem;
  }
  
  .quiz-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .quiz-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
  }
  
  .quiz-title {
    font-weight: bold;
  }
  
  .quiz-category {
    color: #777;
  }
  </style>
  