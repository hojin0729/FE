<template>
  <div class="home-page">
    <AppHeader />
    <div class="content">
      <div class="quiz-board">
        <h2>퀴즈 게시판</h2>
        <table class="quiz-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz, index) in paginatedQuizList" :key="index">
              <td>{{ quiz.quizId }}</td>
              <td class="title">
                {{ quiz.quizTitle }}
                <span class="category-badge">{{ quiz.quizCategory }}</span>
                <span class="level-badge">{{ quiz.quizLevel }}</span>
              </td>
              <td>{{ quiz.nickname }}</td>
              <td>{{ formatDate(quiz.createdAt) }}</td>
              <td>{{ quiz.views || 0 }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="pagination">
          <button class="page-btn" @click="goToFirstPage">≪</button>
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">＜</button>
          <div class="page-numbers">
            <button 
              v-for="pageNum in displayedPages" 
              :key="pageNum"
              :class="['page-num', { active: currentPage === pageNum }]"
              @click="goToPage(pageNum)"
            >
              {{ pageNum }}
            </button>
          </div>
          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">＞</button>
          <button class="page-btn" @click="goToLastPage">≫</button>
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
    async fetchQuizList() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const response = await axios.get(beUrl + "/api/v1/quizs/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 각 퀴즈에 대해 `memberId`를 이용해 `memberNickname` 가져오기
        const quizzesWithNickname = await Promise.all(
          response.data.map(async (quiz) => {
            const createdAt = quiz.date || new Date().toISOString();

            // `memberId`가 있을 경우 닉네임 조회
            let nickname = '알 수 없음';
            if (quiz.memberId) {
              try {
                const nicknameResponse = await axios.get(
                  `${beUrl}/api/v1/members/${quiz.memberId}/nickname`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                nickname = nicknameResponse.data || '알 수 없음';
              } catch (error) {
                console.error("닉네임 조회 실패:", error);
              }
            }

            return {
              quizId: quiz.quizId,
              quizCategory: quiz.quizCategory,
              quizTitle: quiz.quizTitle,
              quizLevel: quiz.quizLevel,
              nickname: nickname, // 조회한 닉네임을 설정
              createdAt: createdAt,
              views: quiz.count || 0
            };
          })
        );

        this.quizList = quizzesWithNickname;
      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
        alert("퀴즈 목록을 불러오는 데 실패했습니다.");
      }
    },
    goToFirstPage() {
      this.currentPage = 1;
    },
    goToLastPage() {
      this.currentPage = this.totalPages;
    },
    goToPage(pageNum) {
      this.currentPage = pageNum;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '-').replace('.', '');
    },
  },
  async mounted() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

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
  gap: 5px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  cursor: pointer;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-num {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  cursor: pointer;
}

.page-num.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.quiz-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #333;
}

.quiz-table th,
.quiz-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.quiz-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.quiz-table td.title {
  text-align: left;
  width: 50%;
}

.quiz-table tr:hover {
  background-color: #f8f9fa;
}

.category-badge,
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  margin-left: 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #e9ecef;
}

.level-badge {
  background-color: #dee2e6;
}

.quiz-board {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.quiz-board h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
</style>
