<template>
  <div class="home-page">
    <AppHeader />
    <div class="content">
      <!-- 퀴즈 목록 표시 -->
      <div class="quiz-board">
        <h2>퀴즈 게시판</h2>
        <ul>
          <li v-for="(quiz, index) in paginatedQuizList" :key="index">
            <h3>{{ quiz.quizTitle }}</h3>
            <p><strong>카테고리:</strong> {{ quiz.quizCategory }}</p>
            <p><strong>난이도:</strong> {{ quiz.quizLevel }}</p>
          </li>
        </ul>
        
        <!-- 페이지네이션 버튼 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">이전</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./Header.vue";
import AppFooter from "./Footer.vue";
import axios from "axios";

export default {
  name: "HomePage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      quizList: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
  totalPages() {
    return Math.ceil(this.quizList.length / this.itemsPerPage);
  },
  paginatedQuizList() {
    const reversedQuizList = [...this.quizList].reverse();
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return reversedQuizList.slice(start, end);
  },
},

  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  async mounted() {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    // API 요청에 토큰 포함
    const response = await axios.get("http://localhost:5678/api/v1/quizs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 정렬 전 데이터 확인
    console.log("Original data:", response.data);

    // API로부터 받은 데이터를 quizList에 할당하면서 quizId를 기준으로 역순 정렬
    this.quizList = response.data
      .map((quiz) => ({
        quizId: quiz.id,
        quizCategory: quiz.category,
        quizTitle: quiz.quiz,
        quizLevel: quiz.level,
      }))
      .sort((a, b) => b.quizId - a.quizId); // quizId를 기준으로 역순 정렬

    // 정렬 후 데이터 확인
    console.log("Sorted quizList by quizId (desc):", this.quizList);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    alert("퀴즈 목록을 불러오는 데 실패했습니다.");
  }
}


};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  padding: 80px 0 100px;
  overflow-y: auto; /* 스크롤 가능하게 설정 */
}

.quiz-board {
  margin-top: 20px;
}

.create-quiz-button {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
}

.pagination span {
  font-weight: bold;
}
</style>
