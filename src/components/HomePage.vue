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
    async fetchMemberNickname() {
      const memberId = localStorage.getItem("memberId");
      const token = localStorage.getItem("jwtToken");

      if (!memberId || !token) return;

      const storedNickname = localStorage.getItem("memberNickname");
      if (storedNickname) return;

      try {
        const response = await axios.get(`http://localhost:5678/api/v1/members/${memberId}/nickname`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const memberNickname = response.data;
        localStorage.setItem("memberNickname", memberNickname);
        alert(`${memberNickname}님 어서오세요!`);
      } catch (error) {
        console.error("Failed to fetch member nickname:", error);
        alert("회원 정보를 불러오는 데 실패했습니다.");
      }
    },
    async fetchQuizList() {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5678/api/v1/quizs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.quizList = response.data
          .map((quiz) => ({
            quizId: quiz.id,
            quizCategory: quiz.category,
            quizTitle: quiz.quiz,
            quizLevel: quiz.level,
          }))
          .sort((a, b) => b.quizId - a.quizId);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        alert("퀴즈 목록을 불러오는 데 실패했습니다.");
      }
    },
  },
  async mounted() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    await this.fetchMemberNickname();
    await this.fetchQuizList();
  },
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
