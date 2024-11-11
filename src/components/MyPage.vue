<template>
  <div class="my-page">
    <AppHeader />
    <div class="content">
      <div class="games-section">
        <h2>내 게임 목록</h2>

        <!-- 게임 목록 -->
        <div class="games-list">
          <div v-for="game in games" :key="game.gameId" class="game-card">
            <div class="game-header">
              <h3>{{ game.gameName }}</h3>
              <div class="game-buttons">
                <button @click="showQuizListModal(game)" class="view-quiz-btn">
                  퀴즈 목록 보기
                </button>
                <button @click="showAddQuizModal(game)" class="add-quiz-btn">
                  퀴즈 추가
                </button>
              </div>
            </div>
            
            <!-- 게임에 포함된 퀴즈 목록 -->
            <div class="quiz-list">
              <div v-for="quiz in game.quizzes" :key="quiz.quizId" class="quiz-item">
                <div class="quiz-info">
                  <span class="quiz-title">{{ quiz.quizTitle }}</span>
                  <div class="quiz-badges">
                    <span class="category-badge">{{ quiz.quizCategory }}</span>
                    <span class="level-badge">{{ quiz.quizLevel }}</span>
                  </div>
                </div>
                <button @click="removeQuizFromGame(game.gameId, quiz.quizId)" class="remove-btn">
                  제거
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 퀴즈 추가 모달 -->
        <div v-if="showQuizModal" class="modal">
          <div class="modal-content">
            <h3>퀴즈 선택</h3>
            <div class="search-area">
              <div class="search-container">
                <select v-model="searchType" class="search-select">
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="category">카테고리</option>
                  <option value="level">난이도</option>
  
                </select>
                <input 
                  v-model="searchKeyword" 
                  type="text" 
                  placeholder="퀴즈 검색"
                  class="search-input"
                  @keyup.enter="handleSearch"
                >
                <button @click="handleSearch" class="search-button">검색</button>
              </div>
            </div>
            <div class="quiz-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        :checked="selectAll" 
                        @change="toggleSelectAll"
                      >
                    </th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>난이도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in paginatedQuizzes" 
                      :key="quiz.quizId" 
                      class="quiz-row"
                      @click="toggleQuizSelection(quiz)">
                    <td @click.stop>
                      <input 
                        type="checkbox"
                        v-model="selectedQuizzes"
                        :value="quiz"
                      >
                    </td>
                    <td>{{ quiz.quizTitle }}</td>
                    <td>{{ quiz.quizCategory }}</td>
                    <td>{{ quiz.quizLevel }}</td>
                  </tr>
                </tbody>
              </table>
            
            </div>
            <div class="modal-buttons">
              <button @click="addSelectedQuizzes" class="add-selected-btn" :disabled="!selectedQuizzes.length">
                선택한 퀴즈 추가 ({{ selectedQuizzes.length }}개)
              </button>
              <div class="pagination-buttons">
                <button class="nav-btn prev" @click="prevPage" :disabled="currentPage === 1">
                  이전
                </button>
                <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                <button class="nav-btn next" @click="nextPage" :disabled="currentPage >= totalPages">
                  다음
                </button>
              </div>
              <button @click="closeQuizModal" class="cancel-btn">닫기</button>
            </div>
          </div>
        </div>

        <!-- 퀴즈 목록 모달 수정 -->
        <div v-if="showQuizListModalFlag" class="modal">
          <div class="modal-content">
            <h3>현재 게임의 퀴즈 목록</h3>
            <div class="search-area">
              <div class="search-container">
                <select v-model="quizListSearchType" class="search-select">
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="category">카테고리</option>
                  <option value="level">난이도</option>
                </select>
                <input 
                  v-model="quizListSearchKeyword" 
                  type="text" 
                  placeholder="퀴즈 검색"
                  class="search-input"
                  @keyup.enter="handleQuizListSearch"
                >
                <button @click="handleQuizListSearch" class="search-button">검색</button>
              </div>
            </div>
            <div class="quiz-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        :checked="selectAllCurrentQuizzes" 
                        @change="toggleSelectAllCurrentQuizzes"
                      >
                    </th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>난이도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in paginatedCurrentGameQuizzes" 
                      :key="quiz.teacherQuizId" 
                      class="quiz-row"
                      @click="toggleCurrentQuizSelection(quiz)">
                    <td @click.stop>
                      <input 
                        type="checkbox"
                        v-model="selectedCurrentQuizzes"
                        :value="quiz"
                      >
                    </td>
                    <td>{{ quiz.quizTitle }}</td>
                    <td>{{ quiz.quizCategory }}</td>
                    <td>{{ quiz.quizLevel }}</td>
                  </tr>
                </tbody>
              </table>
              
            </div>
            <div class="modal-buttons">
              <button 
                @click="removeSelectedQuizzes" 
                class="remove-selected-btn" 
                :disabled="!selectedCurrentQuizzes.length">
                선택한 퀴즈 삭제 ({{ selectedCurrentQuizzes.length }}개)
              </button>
              <div class="pagination-buttons">
                <button class="nav-btn prev" @click="prevQuizListPage" :disabled="quizListCurrentPage === 1">
                  이전
                </button>
                <span class="page-info">{{ quizListCurrentPage }} / {{ quizListTotalPages }}</span>
                <button class="nav-btn next" @click="nextQuizListPage" :disabled="quizListCurrentPage >= quizListTotalPages">
                  다음
                </button>
              </div>
              <button @click="closeQuizListModal" class="cancel-btn">닫기</button>
            </div>
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
import axios from 'axios';

export default {
  name: 'MyPage',
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      games: [],
      quizList: [],
      showQuizModal: false,
      currentGameId: null,
      searchType: 'all',
      searchKeyword: '',
      selectedQuizzes: [],
      showQuizListModalFlag: false,
      currentGameQuizzes: [],
      selectedCurrentQuizzes: [],
      currentGame: null,
      quizListSearchType: 'all',
      quizListSearchKeyword: '',
      currentPage: 1,
      itemsPerPage: 10,
      quizListCurrentPage: 1,
      quizListItemsPerPage: 10,
    }
  },
  computed: {
    filteredQuizzes() {
      if (!this.searchKeyword) return this.quizList;
      
      const keyword = this.searchKeyword.toLowerCase();
      return this.quizList.filter(quiz => {
        switch (this.searchType) {
          case 'title':
            return quiz.quizTitle.toLowerCase().includes(keyword);
          case 'category':
            return quiz.quizCategory.toLowerCase().includes(keyword);
          case 'level':
            return quiz.quizLevel.toLowerCase().includes(keyword);
          case 'author':
            return quiz.nickname.toLowerCase().includes(keyword);
          case 'all':
            return quiz.quizTitle.toLowerCase().includes(keyword) ||
                   quiz.quizCategory.toLowerCase().includes(keyword) ||
                   quiz.quizLevel.toLowerCase().includes(keyword) ||
                   quiz.nickname.toLowerCase().includes(keyword);
          default:
            return true;
        }
      });
    },
    selectAll: {
      get() {
        return this.filteredQuizzes.length === this.selectedQuizzes.length;
      },
      set(value) {
        this.selectedQuizzes = value ? [...this.filteredQuizzes] : [];
      }
    },
    selectAllCurrentQuizzes: {
      get() {
        return this.currentGameQuizzes.length === this.selectedCurrentQuizzes.length;
      },
      set(value) {
        this.selectedCurrentQuizzes = value ? [...this.currentGameQuizzes] : [];
      }
    },
    filteredCurrentGameQuizzes() {
      if (!this.quizListSearchKeyword) return this.currentGameQuizzes;
      
      const keyword = this.quizListSearchKeyword.toLowerCase();
      return this.currentGameQuizzes.filter(quiz => {
        switch (this.quizListSearchType) {
          case 'title':
            return quiz.quizTitle.toLowerCase().includes(keyword);
          case 'category':
            return quiz.quizCategory.toLowerCase().includes(keyword);
          case 'level':
            return quiz.quizLevel.toLowerCase().includes(keyword);
          case 'author':
            return quiz.nickname.toLowerCase().includes(keyword);
          case 'all':
            return quiz.quizTitle.toLowerCase().includes(keyword) ||
                   quiz.quizCategory.toLowerCase().includes(keyword) ||
                   quiz.quizLevel.toLowerCase().includes(keyword) ||
                   quiz.nickname.toLowerCase().includes(keyword);
          default:
            return true;
        }
      });
    },
    paginatedQuizzes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredQuizzes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredQuizzes.length / this.itemsPerPage);
    },
    paginatedCurrentGameQuizzes() {
      const start = (this.quizListCurrentPage - 1) * this.quizListItemsPerPage;
      const end = start + this.quizListItemsPerPage;
      return this.filteredCurrentGameQuizzes.slice(start, end);
    },
    quizListTotalPages() {
      return Math.ceil(this.filteredCurrentGameQuizzes.length / this.quizListItemsPerPage);
    }
  },
  methods: {
    // 내 게임 목록 조회
    async fetchMyGames() {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(`${process.env.VUE_APP_BE_API_URL}/api/v1/games`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.games = response.data;
      } catch (error) {
        console.error("게임 목록 조회 실패:", error);
      }
    },

    // 전체 퀴즈 목록 조회
    async fetchQuizList() {
      const token = localStorage.getItem("jwtToken");
      const beUrl = process.env.VUE_APP_BE_API_URL;
      
      try {
        const response = await axios.get(`${beUrl}/api/v1/quizs/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 현재 게임에 추가된 퀴즈 ID 목록 가져오기
        const currentGameQuizIds = this.currentGameQuizzes.map(quiz => quiz.quizId);

        // 필터링하여 이미 추가된 퀴즈는 제외
        this.quizList = response.data.filter(quiz => !currentGameQuizIds.includes(quiz.quizId));
      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
      }
    },

    // 퀴즈  모달 표시
    async showAddQuizModal(game) {
      this.currentGameId = game.gameId;
      await this.fetchCurrentGameQuizzes(); // 현재 게임에 추가된 퀴즈 목록 불러오기
      await this.fetchQuizList(); // 필터링된 퀴즈 목록 불러오기
      this.showQuizModal = true;
    },

    handleSearch() {
      // 검색 시 필요한 로직 추가
    },

    // 퀴즈 선택 및 게임에 추가
    async selectQuiz(quiz) {
      if (!confirm(`"${quiz.quizTitle}" 퀴즈를 게임에 추가하시겠습니까?`)) return;

      const token = localStorage.getItem("jwtToken");
      const memberId = Number(localStorage.getItem("memberId"));

      try {
        const teacherQuizRequest = {
          quizId: quiz.quizId,
          gameId: this.currentGameId,
          isStopped: 0
        };

        const teacherQuizResponse = await axios.post(
          `${process.env.VUE_APP_BE_API_URL}/api/v1/teacher-quizzes/member/${memberId}`,
          teacherQuizRequest,
          { headers: { Authorization: `Bearer ${token}` }}
        );

        if (teacherQuizResponse.data) {
          console.log('퀴즈 성으로 저장되었습니다:', teacherQuizResponse.data);
          await this.fetchMyGames();
          this.closeQuizModal();
        }
      } catch (error) {
        console.error("퀴즈 추가 실패:", error);
        alert("퀴즈 추가에 실패습니다.");
      }
    },

    // 게임에서 퀴즈 제거
    async removeQuizFromGame(gameId, quizId) {
      if (!confirm('이 퀴즈를 게임에서 제거하시겠습니까?')) return;

      const token = localStorage.getItem("jwtToken");
      try {
        await axios.delete(
          `${process.env.VUE_APP_BE_API_URL}/api/v1/games/${gameId}/quizzes/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        await this.fetchMyGames();
        alert("퀴즈가 제거되었습니다.");
      } catch (error) {
        console.error("퀴즈 제거 실패:", error);
        alert("퀴즈 제거에 실패했습니다.");
      }
    },

    toggleSelectAll() {
      this.selectAll = !this.selectAll;
    },

    async addSelectedQuizzes() {
      if (!this.selectedQuizzes.length) {
        alert('선택 퀴즈가 없습니다.');
        return;
      }

      if (!confirm(`선택한 ${this.selectedQuizzes.length}개의 퀴즈를 추가하시겠습니까?`)) return;

      const token = localStorage.getItem("jwtToken");
      const memberId = Number(localStorage.getItem("memberId"));

      try {
        for (const quiz of this.selectedQuizzes) {
          const teacherQuizRequest = {
            quizId: quiz.quizId,
            gameId: this.currentGameId,
            isStopped: 0
          };

          await axios.post(
            `${process.env.VUE_APP_BE_API_URL}/api/v1/teacher-quizzes/member/${memberId}`,
            teacherQuizRequest,
            { headers: { Authorization: `Bearer ${token}` }}
          );
        }

        await this.fetchMyGames();
        this.closeQuizModal();
        alert('선택한 퀴즈가 성공적으로 추가되었습니다.');
      } catch (error) {
        console.error("퀴즈 추가 실패:", error);
        alert("퀴즈 추가에 실패했습니다.");
      }
    },

    closeQuizModal() {
      this.showQuizModal = false;
      this.searchKeyword = '';
      this.selectedQuizzes = []; // 모달 닫 때 선택 기화
    },

    toggleQuizSelection(quiz) {
      const index = this.selectedQuizzes.findIndex(q => q.quizId === quiz.quizId);
      if (index === -1) {
        this.selectedQuizzes.push(quiz);
      } else {
        this.selectedQuizzes.splice(index, 1);
      }
    },

    async showQuizListModal(game) {
      const token = localStorage.getItem("jwtToken");
      const beUrl = process.env.VUE_APP_BE_API_URL;
      
      try {
        // TeacherQuiz 목록을 가져옴 (이미 memberNickname이 포함되어 있음)
        const teacherQuizResponse = await axios.get(
          `${beUrl}/api/v1/teacher-quizzes/game/${game.gameId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        console.log('TeacherQuiz 응답:', teacherQuizResponse.data);

        const quizzesWithDetails = await Promise.all(
          teacherQuizResponse.data.map(async (teacherQuiz) => {
            try {
              // 1. quizId로 퀴즈 정보 조회
              const quizResponse = await axios.get(
                `${beUrl}/api/v1/quizs/${teacherQuiz.quizId}`,
                { headers: { Authorization: `Bearer ${token}` }}
              );
              
              const quiz = quizResponse.data;
              console.log('퀴즈 정보:', quiz);

              return {
                teacherQuizId: teacherQuiz.teacherQuizId,
                quizId: teacherQuiz.quizId,
                gameId: teacherQuiz.gameId,
                isStopped: teacherQuiz.isStopped,
                quizTitle: quiz.quiz,
                quizCategory: quiz.category,
                quizLevel: quiz.level,
                quizType: quiz.type,
                quizAnswer: quiz.answer,
                quizDescription: quiz.desc,
                nickname: teacherQuiz.memberNickname,  // 백엔드에서 받은 memberNickname 사용
                createdAt: quiz.createdAt || new Date().toISOString()
              };
            } catch (error) {
              console.error(`퀴즈 정보 조회 실패 (ID: ${teacherQuiz.quizId}):`, error);
              return null;
            }
          })
        );

        this.currentGameQuizzes = quizzesWithDetails.filter(quiz => quiz !== null);
        this.currentGame = game;
        this.showQuizListModalFlag = true;
      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
        alert("퀴즈 목록을 불러오는데 실패했습니다.");
      }
    },

    closeQuizListModal() {
      this.showQuizListModalFlag = false;
      this.selectedCurrentQuizzes = [];
      this.currentGame = null;
      this.quizListSearchType = 'all';
      this.quizListSearchKeyword = '';
    },

    toggleCurrentQuizSelection(quiz) {
      const index = this.selectedCurrentQuizzes.findIndex(q => q.quizId === quiz.quizId);
      if (index === -1) {
        this.selectedCurrentQuizzes.push(quiz);
      } else {
        this.selectedCurrentQuizzes.splice(index, 1);
      }
    },

    toggleSelectAllCurrentQuizzes() {
      this.selectAllCurrentQuizzes = !this.selectAllCurrentQuizzes;
    },

    async removeSelectedQuizzes() {
      if (!this.selectedCurrentQuizzes.length) {
        alert('선택된 퀴즈가 없습니다.');
        return;
      }

      if (!confirm(`선택한 ${this.selectedCurrentQuizzes.length}개의 퀴즈를 삭제하시겠습니까?`)) return;

      const token = localStorage.getItem("jwtToken");

      try {
        for (const quiz of this.selectedCurrentQuizzes) {
          await axios.delete(
            `${process.env.VUE_APP_BE_API_URL}/api/v1/teacher-quizzes/quiz/${quiz.teacherQuizId}`,
            { headers: { Authorization: `Bearer ${token}` }}
          );
        }

        // 현재 게임의 퀴즈 목록을 다시 불러옴
        await this.showQuizListModal(this.currentGame);
        this.selectedCurrentQuizzes = [];
        alert('선택한 퀴즈가 성적으로 삭제었습니다.');
      } catch (error) {
        console.error("퀴즈 삭제 실패:", error);
        alert("퀴즈 삭제에 실패했습니다.");
      }
    },

    handleQuizListSearch() {
      // 퀴즈 목록 보기 검색 처리
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevQuizListPage() {
      if (this.quizListCurrentPage > 1) {
        this.quizListCurrentPage--;
      }
    },

    nextQuizListPage() {
      if (this.quizListCurrentPage < this.quizListTotalPages) {
        this.quizListCurrentPage++;
      }
    },

    async fetchAvailableQuizzes(memberId, gameId) {
      try {
        const response = await axios.get(`/api/v1/teacher-quizzes/member/${memberId}/game/${gameId}`);
        this.availableQuizzes = response.data;
      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
      }
    },

    async fetchCurrentGameQuizzes() {
      const token = localStorage.getItem("jwtToken");
      const beUrl = process.env.VUE_APP_BE_API_URL;

      try {
        const response = await axios.get(`${beUrl}/api/v1/teacher-quizzes/game/${this.currentGameId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.currentGameQuizzes = response.data;
      } catch (error) {
        console.error("현재 게임의 퀴즈 목록 조회 실패:", error);
      }
    }
  },
  mounted() {
    this.fetchMyGames();
  }
}
</script>

<style scoped>
.my-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 80px; /* 헤더 높이만큼 여백 */
  padding-bottom: 40px;
}

.games-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px); /* 화면 높이에서 헤더/푸터 높이를 뺀 값 */
}

/* 기존 스타일 유지하면서 추가 */
@media (max-height: 900px) {
  .games-section {
    min-height: calc(100vh - 180px);
  }
}

.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.game-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.quiz-list {
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.quiz-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.add-quiz-btn {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-area {
  margin: 20px 0;
}

.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 120px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.quiz-table {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.quiz-table table {
  width: 100%;
  border-collapse: collapse;
}

.quiz-table th,
.quiz-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.quiz-table th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
}

/* 각 열의 너비 조정 */
.quiz-table td:nth-child(1) { width: 5%; }  /* 체크박스 */
.quiz-table td:nth-child(2) { width: 40%; } /* 제목 */
.quiz-table td:nth-child(3) { width: 20%; } /* 카테고리 */
.quiz-table td:nth-child(4) { width: 15%; } /* 난이도 */
.quiz-table td:nth-child(5) { width: 20%; } /* 작성자 */

.modal-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  margin-top: auto;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-btn {
  min-width: 80px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  color: #333;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.nav-btn:disabled {
  background-color: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}

.page-info {
  min-width: 80px;
  text-align: center;
  font-weight: 500;
  color: #666;
}

.add-selected-btn, .cancel-btn {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.add-selected-btn {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.add-selected-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.game-buttons {
  display: flex;
  gap: 10px;
}

.view-quiz-btn {
  background-color: #000000d6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-selected-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-selected-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.game-buttons button {
  transition: opacity 0.2s;
}

.game-buttons button:hover {
  opacity: 0.9;
}
</style>
