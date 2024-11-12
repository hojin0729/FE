<template>
  <div class="quiz-board-page">
    <AppHeader />
    <div class="content">
      <div class="quiz-board">
        <div class="search-area">
          <div class="total-count">전체 {{ totalItems }}건</div>
          <div class="search-container">
            <select v-model="searchType" class="search-select">
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="category">카테고리</option>
              <option value="level">난이도</option>
              <option value="author">작성자</option>
            </select>
            <input 
              type="text" 
              v-model="searchKeyword" 
              class="search-input" 
              placeholder="검색어를 입력하세요"
              @keyup.enter="handleSearch"
            >
            <button class="search-button" @click="handleSearch">검색</button>
          </div>
        </div>
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
                  <td class="id-cell">
                    {{ totalItems - ((currentPage - 1) * itemsPerPage + (i-1)) }}
                  </td>
                  <td class="title-cell" @click="goToQuizDetail(paginatedQuizList[i-1].quizId)">
                    <div class="title-wrapper">
                      <span class="title-text">{{ paginatedQuizList[i-1].quizTitle }}</span>
                      <span class="badges">
                        <span class="category-badge">{{ paginatedQuizList[i-1].quizCategory }}</span>
                        <span class="level-badge">{{ paginatedQuizList[i-1].quizLevel }}</span>
                      </span>
                    </div>
                  </td>
                  <td class="author-cell">{{ paginatedQuizList[i-1].memberNickname }}</td>
                  <td class="date-cell">{{ formatDate(paginatedQuizList[i-1].date) }}</td>
                </tr>
                <tr v-else class="empty-row">
                  <td colspan="4">&nbsp;</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="pagination-container">
            <div class="pagination">
              <div class="pagination-wrapper">
                <div class="pagination-buttons">
                  <button class="nav-btn prev" @click="prevPage" :disabled="currentPage === 1">
                    &lt;
                  </button>
                  <div class="page-numbers">
                    <button 
                      v-for="pageNum in getDisplayedPages()" 
                      :key="pageNum"
                      :class="['page-num', { active: currentPage === pageNum }]"
                      @click="goToPage(pageNum)"
                    >
                      {{ pageNum }}
                    </button>
                  </div>
                  <button class="nav-btn next" @click="nextPage" :disabled="currentPage === totalPages">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
            <button class="create-quiz-button search-button" @click="createQuiz">퀴즈 생성</button>
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
      totalItems: 0,
      searchType: 'all',
      searchKeyword: '',
    };
  },
  computed: {
    filteredList() {
      return this.quizList;
    },
    paginatedQuizList() {
      return this.quizList;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchQuizList();
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchQuizList();
      }
    },
    async goToPage(pageNum) {
      this.currentPage = pageNum;
      await this.fetchQuizList();
    },
    async goToFirstPage() {
      this.currentPage = 1;
      await this.fetchQuizList();
    },
    async goToLastPage() {
      this.currentPage = this.totalPages;
      await this.fetchQuizList();
    },
    async handleSearch() {
      this.currentPage = 1;
      await this.fetchQuizList();
    },
    async fetchQuizList() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const response = await axios.get(`${beUrl}/api/v1/quizs/all`, {
          params: {
            page: this.currentPage - 1,
            size: this.itemsPerPage,
            searchType: this.searchType,
            searchKeyword: this.searchKeyword
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("서버 응답 데이터:", response.data);

        // Page 객체에서 데이터 추출
        this.quizList = response.data.content.map(quiz => ({
          quizId: quiz.quizId,
          memberNickname: quiz.memberNickname || '알 수 없음',
          quizCategory: quiz.quizCategory,
          quizTitle: quiz.quizTitle,
          quizLevel: quiz.quizLevel,
          quizAnswer: quiz.quizAnswer,
          quizDescription: quiz.quizDescription,
          date: quiz.date,
          count: quiz.count || 0
        }));

        // 페이지네이션 정보 업데이트
        this.totalItems = response.data.totalElements;
        
      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
        alert("퀴즈 목록을 불러오는 데 실패했습니다.");
      }
    },
    createQuiz() {
      this.$router.push('/quizform');  // router/index.js에 정의된 경로로 이동
    },
    goToQuizDetail(quizId) {
      this.$router.push(`/quiz/${quizId}`);
    },
    formatDate(date) {
      if (!date) return '';
      
      try {
        if (date instanceof Date) {
          return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\. /g, '-').replace('.', '');
        }
        
        // date가 배열인 경우
        if (Array.isArray(date)) {
          const newDate = new Date(date[0], date[1]-1, date[2]);
          return newDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\. /g, '-').replace('.', '');
        }
        
        // 문자열인 경우
        return new Date(date).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '-').replace('.', '');
      } catch (error) {
        console.error('날짜 변환 실패:', error, date);
        return '';
      }
    },
    getDisplayedPages() {
      const totalPages = this.totalPages;
      const current = this.currentPage;
      
      // 항상 5개의 페이지를 보여주되, 위치 고정
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      if (current <= 3) {
        return [1, 2, 3, 4, 5];
      }
      
      if (current >= totalPages - 2) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        ];
      }
      
      return [current - 2, current - 1, current, current + 1, current + 2];
    },
  },
  watch: {
    searchType: {
      async handler() {
        this.currentPage = 1;
        await this.fetchQuizList();
      }
    },
    searchKeyword: {
      async handler() {
        this.currentPage = 1;
        await this.fetchQuizList();
      }
    }
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
  min-height: 100vh;
  background-color: #fff;
}

.total-count{
  text-align: right;
  margin-top: 10px;
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 40px;
}

.quiz-board {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px); /* 화면 높이에서 헤더/푸터 높��를 뺀 값 */
}


.pagination-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-top: auto;
  width: 100%;
}

.pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.pagination-wrapper {
  display: flex;
  align-items: center;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}

.create-quiz-button {
  margin-left: auto;
}

.page-numbers {
  display: flex;
  gap: 5px;
  margin: 0 5px;
  min-width: 170px;
  justify-content: center;
}

.page-num,
.nav-btn {
  min-width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.page-num.active {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border-color: rgba(0, 0, 0, 0.865);
}

.nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.nav-btn:hover:not(:disabled),
.page-num:hover:not(.active) {
  background-color: #f8f9fa;
  border-color: #999;
}

.quiz-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #333;
  table-layout: fixed;
}

.quiz-table th,
.quiz-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  height: 52px;
  box-sizing: border-box;
}

.empty-row td {
  border-bottom: 1px solid #ddd;
  height: 52px; /* 빈 행의 높이를 일정하게 */
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

.quiz-board h2 {
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
}

/* 각 셀 정렬 스일 */
.id-cell {
  text-align: center;
}

.title-cell {
  text-align: left;
  padding-left: 20px;
  cursor: pointer; /* 커서 모양을 포인터로 변경 */
  transition: background-color 0.2s; /* 부드러운 전환 효과 */
}


.title-cell:active {
  background-color: #e0e0e0; /* 클릭 시 배경색 변경 */
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
  color: #2c3e50; /* 링크처럼 보이는 색상 */
}

.title-cell:hover .title-text {
  color: #1a73e8; /* 호버 시 텍스트 색상 변경 */
  text-decoration: underline; /* 호버 시 밑줄 추가 */
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
  margin-bottom: 0;
}

.table-container {
  margin: 20px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.search-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 30px;
  width: 100%;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 40px;
}

.search-select {
  width: 100px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  flex-shrink: 0;
  cursor: pointer;
}

.search-input {
  width: 500px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex-shrink: 0;
}

.search-button {
  width: 80px;
  height: 40px;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-button:hover {
  background-color: #020906b3;
}

.search-select:focus,
.search-input:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.865);
}

/* 반응형 처리 */
@media (max-width: 768px) {
  .search-area {
    flex-direction: column;
    gap: 12px;
  }

  .search-container {
    flex-direction: column;
    height: auto;
    gap: 8px;
    width: 100%;
  }
  
  .search-select,
  .search-input,
  .search-button {
    width: 100%;
  }

  .total-count {
    text-align: left;
    width: 100%;
  }
}

@media (max-height: 900px) {
  .quiz-board {
    min-height: calc(100vh - 180px);
  }
}
</style>
