<template>
  <div class="home-page">
    <AppHeader />
    <div class="content">
      <div class="quiz-board">
        <h2>퀴즈 게시판</h2>
        <div class="total-count">전체 {{ quizList.length }}건</div>
        <div class="table-container">
          <table class="quiz-table">
            <thead>
              <tr>
                <th width="10%">번호</th>
                <th width="50%">제목</th>
                <th width="20%">작성자</th>
                <th width="20%">작성일</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="i in itemsPerPage" :key="i">
                <tr v-if="paginatedQuizList[i-1]">
                  <td class="id-cell">{{ paginatedQuizList[i-1].quizId }}</td>
                  <td class="title-cell">
                    <div class="title-wrapper">
                      <span class="title-text">{{ paginatedQuizList[i-1].quizTitle }}</span>
                      <span class="badges">
                        <span class="category-badge">{{ paginatedQuizList[i-1].quizCategory }}</span>
                        <span class="level-badge">{{ paginatedQuizList[i-1].quizLevel }}</span>
                      </span>
                    </div>
                  </td>
                  <td class="author-cell">{{ paginatedQuizList[i-1].nickname }}</td>
                  <td class="date-cell">{{ formatDate(paginatedQuizList[i-1].createdAt) }}</td>
                </tr>
                <tr v-else class="empty-row">
                  <td colspan="4">&nbsp;</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        
        <div class="pagination-container">
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
            const createdAt = quiz.createdAt || new Date().toISOString();

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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

.quiz-board {
  margin-top: 50px;
}

.create-quiz-button {
  margin-bottom: 20px;
}

.pagination-container {
  position: sticky;
  bottom: 0;
  background-color: white;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.page-btn,
.page-num {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover,
.page-num:hover {
  background-color: #f8f9fa;
  border-color: #999;
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
  table-layout: fixed;
}

.quiz-table th,
.quiz-table td {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  height: 57px;
  box-sizing: border-box;
}

.empty-row td {
  border-bottom: 1px solid #ddd;
  height: 57px;
}

.quiz-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  text-align: center;
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
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.category-badge {
  background-color: #e9ecef;
}

.level-badge {
  background-color: #dee2e6;
}

.quiz-board {
  max-width: 1200px;
  margin-top: 100px;
  padding: 0 20px;
  height: 700px;
  overflow-y: hidden;
}

.quiz-board h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* 각 셀 정렬 스타일 */
.id-cell {
  text-align: center;
}

.title-cell {
  text-align: left;
  padding-left: 20px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.title-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.badges {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.author-cell {
  text-align: center;
}

.date-cell {
  text-align: center;
}

.total-count {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.table-container {
  height: 570px;
  margin: 20px 0;
  overflow: hidden;
}
</style>
