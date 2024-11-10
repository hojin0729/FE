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
                    <th>작성자</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in filteredQuizzes" 
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
                    <td>{{ quiz.nickname }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="modal-buttons">
                <button @click="addSelectedQuizzes" class="add-selected-btn" :disabled="!selectedQuizzes.length">
                  선택한 퀴즈 추가 ({{ selectedQuizzes.length }}개)
                </button>
                <button @click="closeQuizModal" class="cancel-btn">닫기</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 퀴즈 목록 모달 추가 -->
        <div v-if="showQuizListModalFlag" class="modal">
          <div class="modal-content">
            <h3>현재 게임의 퀴즈 목록</h3>
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
                    <th>작성자</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in currentGameQuizzes" 
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
                    <td>{{ quiz.nickname }}</td>
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
          case 'all':
            return quiz.quizTitle.toLowerCase().includes(keyword) ||
                   quiz.quizCategory.toLowerCase().includes(keyword) ||
                   quiz.quizLevel.toLowerCase().includes(keyword);
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
      try {
        const response = await axios.get(`${process.env.VUE_APP_BE_API_URL}/api/v1/quizs/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.quizList = response.data;
      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
      }
    },

    // 퀴즈 추가 모달 표시
    async showAddQuizModal(game) {
      this.currentGameId = game.gameId;
      await this.fetchQuizList();
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
          console.log('퀴즈가 성공적으로 저장되었습니다:', teacherQuizResponse.data);
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
        alert('선택된 퀴즈가 없습니다.');
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
        // TeacherQuiz 목록을 가져옴
        const response = await axios.get(
          `${beUrl}/api/v1/teacher-quizzes/game/${game.gameId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        // 각 TeacherQuiz에 대해 Quiz 정보와 닉네임을 가져옴
        const quizzesWithDetails = await Promise.all(
          response.data.map(async (teacherQuiz) => {
            try {
              const quizResponse = await axios.get(
                `${beUrl}/api/v1/quizs/${teacherQuiz.quizId}`,
                { headers: { Authorization: `Bearer ${token}` }}
              );

              // memberId로 닉네임 조회
              let nickname = '알 수 없음';
              if (quizResponse.data.memberId) {
                try {
                  const nicknameResponse = await axios.get(
                    `${beUrl}/api/v1/members/${quizResponse.data.memberId}/nickname`,
                    { headers: { Authorization: `Bearer ${token}` }}
                  );
                  nickname = nicknameResponse.data || '알 수 없음';
                } catch (error) {
                  console.error("닉네임 조회 실패:", error);
                }
              }

              return {
                teacherQuizId: teacherQuiz.teacherQuizId,
                quizId: teacherQuiz.quizId,
                gameId: teacherQuiz.gameId,
                isStopped: teacherQuiz.isStopped,
                quizTitle: quizResponse.data.quizTitle,
                quizCategory: quizResponse.data.quizCategory,
                quizLevel: quizResponse.data.quizLevel,
                nickname: nickname,
                createdAt: quizResponse.data.createdAt || new Date().toISOString()
              };
            } catch (error) {
              console.error(`퀴즈 정보 조회 실패 (ID: ${teacherQuiz.quizId}):`, error);
              return {
                ...teacherQuiz,
                quizTitle: '제목 없음',
                quizCategory: '-',
                quizLevel: '-',
                nickname: '알 수 없음',
                createdAt: new Date().toISOString()
              };
            }
          })
        );
        
        this.currentGameQuizzes = quizzesWithDetails;
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

        // 삭제 후 목록 새로고침
        const response = await axios.get(
          `${process.env.VUE_APP_BE_API_URL}/api/v1/teacher-quizzes/game/${this.currentGame.gameId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        this.currentGameQuizzes = response.data;
        this.selectedCurrentQuizzes = [];
        alert('선택한 퀴즈가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error("퀴즈 삭제 실패:", error);
        alert("퀴즈 삭제에 실패했습니다.");
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
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #eee;
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
  background-color: #2196F3;
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
