<template>
  <div class="my-page">
    <AppHeader />
    <div class="content">
      <div class="games-section">
        <div class="games-header">
          <h2>내 게임 목록</h2>
          <button @click="showAddGameModal" class="add-game-btn">
            새 게임 만들기
          </button>
        </div>

        <!-- 게임 목록 -->
        <div class="games-list">
          <div v-for="game in games" :key="game.gameId" class="game-card">
            <div class="game-header">
              <h3 class="game-title">{{ game.gameName }}</h3>
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
                  제
                </button>
              </div>
            </div>

            <!-- 버튼을 아래로 이동 -->
            <div class="game-footer">
              <div class="game-buttons">
                <button @click="showQuizListModal(game)" class="view-quiz-btn">
                  퀴즈 목록 보기
                </button>
                <button @click="showAddQuizModal(game)" class="add-quiz-btn">
                  퀴즈 추가
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 퀴즈 추가 모달 -->
        <div v-if="showQuizModal" class="modal">
          <div class="modal-content">
            <h3>퀴즈 추가</h3>
            <div class="search-area">
              <div class="search-container">
                <select v-model="quizAddSearchType" class="search-select">
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="category">카테고리</option>
                  <option value="level">난이도</option>
                </select>
                <input 
                  type="text" 
                  v-model="quizAddSearchKeyword" 
                  class="search-input" 
                  placeholder="검색어를 입력하세요"
                >
                <button @click="handleQuizListSearch" class="search-button">검색</button>
              </div>
            </div>

            <div class="quiz-table">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" v-model="selectAll"></th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>난이도</th>
                    <th>북마크</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in filteredAddQuizzes" 
                      :key="quiz.quizId" 
                      class="quiz-row"
                      @click="selectQuizForComments(quiz)"
                      :class="{ 'selected': selectedQuiz?.quizId === quiz.quizId }">
                    <td @click.stop>
                      <input type="checkbox" :value="quiz" v-model="selectedQuizzes">
                    </td>
                    <td>{{ quiz.quizTitle }}</td>
                    <td>{{ quiz.quizCategory }}</td>
                    <td>{{ quiz.quizLevel }}</td>
                    <td @click.stop>
                      <img 
                        src="@/assets/Icon.png" 
                        class="bookmark-icon" 
                        :class="{ 'bookmarked': isBookmarked(quiz.quizId) }"
                        @click="toggleBookmark(quiz.quizId)"
                        alt="bookmark"
                      />
                    </td>
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

          <!-- 댓글 모달 -->
          <div v-if="showCommentsModal" class="comments-modal">
            <h3>{{ selectedQuiz?.quizTitle }} 댓글</h3>
            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.quizCommentId" class="comment">
                <div class="comment-header">
                  <div class="comment-left">
                    <span class="comment-author">{{ comment.memberNickname }}</span>
                    <span class="comment-date">{{ formatDate(comment.quizCommentCreatedAt) }}</span>
                  </div>
                </div>
                <p class="comment-content">{{ comment.quizCommentContent }}</p>
              </div>
            </div>
            <button @click="closeCommentsModal" class="close-btn">닫기</button>
          </div>
        </div>

        <!-- 퀴즈 목록 모달 -->
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
                    <th><input type="checkbox" :checked="selectAllCurrentQuizzes" @change="toggleSelectAllCurrentQuizzes"></th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>난이도</th>
                    <th>북마크</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in paginatedCurrentGameQuizzes" 
                      :key="quiz.teacherQuizId" 
                      class="quiz-row"
                      @click="selectQuizForComments(quiz)"
                      :class="{ 'selected': selectedQuiz?.quizId === quiz.quizId }">
                    <td @click.stop>
                      <input type="checkbox" v-model="selectedCurrentQuizzes" :value="quiz">
                    </td>
                    <td>{{ quiz.quizTitle }}</td>
                    <td>{{ quiz.quizCategory }}</td>
                    <td>{{ quiz.quizLevel }}</td>
                    <td @click.stop>
                      <img src="@/assets/Icon.png" 
                           class="bookmark-icon" 
                           :class="{ 'bookmarked': isBookmarked(quiz.quizId) }"
                           @click="toggleBookmark(quiz.quizId)"
                           alt="bookmark">
                    </td>
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

        <!-- 게임 추가 모달 -->
        <div v-if="showGameModal" class="modal">
          <div class="modal-content">
            <h3>새 게임 만들기</h3>
            <div class="game-form">
              <div class="form-group">
                <label>게임 이름</label>
                <input 
                  v-model="newGame.gameName" 
                  type="text" 
                  placeholder="게임 이름을 입력하세요"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label>비밀번호</label>
                <input 
                  v-model="newGame.gamePassword" 
                  type="password" 
                  placeholder="비밀번호를 입력하세요"
                  class="form-input"
                >
              </div>
            </div>
            <div class="modal-buttons">
              <button @click="createGame" class="create-btn" :disabled="!isValidGame">
                게임 만들기
              </button>
              <button @click="closeGameModal" class="cancel-btn">
                취소
              </button>
            </div>
          </div>
        </div>

        <!-- 기존 퀴즈 목록 모달은 그대로 두고 새로운 댓글 모달 추가 -->
        <div v-if="showCommentsModal" class="comments-modal">
          <div class="modal-content comments-content">
            <h3>{{ selectedQuiz?.quizTitle }} </h3>
            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.quizCommentId" class="comment">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.memberNickname }}</span>
                  <span class="comment-date">{{ formatDate(comment.quizCommentCreatedAt) }}</span>
                </div>
                <p class="comment-content">{{ comment.quizCommentContent }}</p>
              </div>
            </div>
            <button @click="closeCommentsModal" class="close-btn">닫기</button>
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
      totalItems: 0, // 총 퀴즈 수
      quizListCurrentPage: 1,
      quizListItemsPerPage: 10,
      showGameModal: false,
      newGame: {
        gameName: '',
        gamePassword: ''
      },
      quizAddSearchType: 'all',
      quizAddSearchKeyword: '',
      quizAddCurrentPage: 1,
      quizAddItemsPerPage: 10,
      quizAddTotalItems: 0,
      bookmarks: [],
      selectedQuiz: null,
      comments: [],
      memberNickname: localStorage.getItem("memberNickname") || "",
      showCommentsModal: false,
    }
  },
  computed: {
    filteredQuizzes() {
      if (!this.quizList) return [];
      if (!this.searchKeyword) return this.quizList;
      
      const keyword = this.searchKeyword.toLowerCase();
      return this.quizList.filter(quiz => {
        if (!quiz) return false;
        
        switch (this.searchType) {
          case 'title':
            return quiz.quizTitle?.toLowerCase().includes(keyword);
          case 'category':
            return quiz.quizCategory?.toLowerCase().includes(keyword);
          case 'level':
            return quiz.quizLevel?.toLowerCase().includes(keyword);
          case 'all':
            return (quiz.quizTitle?.toLowerCase().includes(keyword) ||
                   quiz.quizCategory?.toLowerCase().includes(keyword) ||
                   quiz.quizLevel?.toLowerCase().includes(keyword));
          default:
            return true;
        }
      });
    },

    selectAll: {
      get() {
        return this.quizList.length > 0 && this.selectedQuizzes.length === this.quizList.length;
      },
      set(value) {
        this.selectedQuizzes = value ? [...this.quizList] : [];
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
      if (!this.currentGameQuizzes) return [];
      if (!this.quizListSearchKeyword) return this.currentGameQuizzes;
      
      const keyword = this.quizListSearchKeyword.toLowerCase();
      return this.currentGameQuizzes.filter(quiz => {
        if (!quiz) return false;
        
        switch (this.quizListSearchType) {
          case 'title':
            return quiz.quizTitle?.toLowerCase().includes(keyword);
          case 'category':
            return quiz.quizCategory?.toLowerCase().includes(keyword);
          case 'level':
            return quiz.quizLevel?.toLowerCase().includes(keyword);
          case 'all':
            return (quiz.quizTitle?.toLowerCase().includes(keyword) ||
                   quiz.quizCategory?.toLowerCase().includes(keyword) ||
                   quiz.quizLevel?.toLowerCase().includes(keyword));
          default:
            return true;
        }
      });
    },

    paginatedQuizzes() {
      return this.quizList;
    },

    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },

    paginatedCurrentGameQuizzes() {
      if (!this.filteredCurrentGameQuizzes) return [];
      
      const start = (this.quizListCurrentPage - 1) * this.quizListItemsPerPage;
      const end = start + this.quizListItemsPerPage;
      return this.filteredCurrentGameQuizzes.slice(start, end);
    },

    quizListTotalPages() {
      return Math.ceil(this.filteredCurrentGameQuizzes.length / this.quizListItemsPerPage);
    },

    pageDisplay() {
      return `${this.currentPage}/${this.totalPages}`;
    },

    isValidGame() {
      return this.newGame.gameName && this.newGame.gamePassword;
    },

    quizAddTotalPages() {
      return Math.ceil(this.quizAddTotalItems / this.quizAddItemsPerPage);
    },

    filteredAddQuizzes() {
      if (!this.quizList) return [];
      if (!this.quizAddSearchKeyword) return this.quizList;
      
      const keyword = this.quizAddSearchKeyword.toLowerCase();
      return this.quizList.filter(quiz => {
        if (!quiz) return false;
        
        switch (this.quizAddSearchType) {
          case 'title':
            return quiz.quizTitle?.toLowerCase().includes(keyword);
          case 'category':
            return quiz.quizCategory?.toLowerCase().includes(keyword);
          case 'level':
            return quiz.quizLevel?.toLowerCase().includes(keyword);
          case 'all':
            return (quiz.quizTitle?.toLowerCase().includes(keyword) ||
                   quiz.quizCategory?.toLowerCase().includes(keyword) ||
                   quiz.quizLevel?.toLowerCase().includes(keyword));
          default:
            return true;
        }
      });
    },

    paginatedAddQuizzes() {
      const start = (this.quizAddCurrentPage - 1) * this.quizAddItemsPerPage;
      const end = start + this.quizAddItemsPerPage;
      return this.filteredAddQuizzes.slice(start, end);
    }
  },
  methods: {
    // 내 게임 목록 조회
    async fetchMyGames() {
      const token = localStorage.getItem("jwtToken");
      const memberId = localStorage.getItem("memberId");
      
      if (!token || !memberId) {
        console.error("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        // /api/v1/games/member/{memberId} 엔드포인트로 변경
        const response = await axios.get(
          `${process.env.VUE_APP_BE_API_URL}/api/v1/games/member/${memberId}`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.games = response.data;
      } catch (error) {
        console.error("게임 록 조회 실패:", error);
        alert("게임 목록을 오는데 실패했습니다.");
      }
    },

    // 전체 퀴즈 목록 조회
    async fetchQuizList(page = this.currentPage - 1, size = this.itemsPerPage) {
      const token = localStorage.getItem("jwtToken");
      const beUrl = process.env.VUE_APP_BE_API_URL;
      
      try {
        // 현재 게임의 퀴즈 목록 가져오기
        const currentGameResponse = await axios.get(
          `${beUrl}/api/v1/teacher-quizzes/game/${this.currentGameId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        const existingQuizIds = currentGameResponse.data.map(quiz => quiz.quizId);

        // 전체 퀴즈 목록을 한 번에 가져오기
        const response = await axios.get(`${beUrl}/api/v1/quizs/all`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            page: 0,
            size: 9999
          }
        });

        // 이미 추가된 퀴즈를 제외한 전체 퀴즈
        const availableQuizzes = response.data.content.filter(
          quiz => !existingQuizIds.includes(quiz.quizId)
        );

        // 현재 페이지의 시작과 끝 인덱스 계산
        const startIndex = page * size;
        const endIndex = startIndex + size;

        // 현재 페이지에 표시할 퀴즈
        this.quizList = availableQuizzes.slice(startIndex, endIndex).map(quiz => ({
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

        // 전체 사용 가능한 퀴즈 수
        const totalAvailableQuizzes = availableQuizzes.length;
        
        // 페이지네이션 정보 업데이트 (전체 페이지 수는 처음 계산된 값을 유지)
        if (!this.totalPages) {
          this.totalPages = Math.ceil(totalAvailableQuizzes / this.itemsPerPage);
        }
        this.totalItems = totalAvailableQuizzes;

      } catch (error) {
        console.error("퀴즈 목록 조회 실패:", error);
        alert("퀴즈 목록을 불러오는 데 실패했습니다.");
      }
    },

    // 퀴즈  모달 표시
    async showAddQuizModal(game) {
      this.currentGameId = game.gameId;
      this.currentGame = game;
      this.currentPage = 1;
      this.selectedQuizzes = [];
      this.totalPages = null; // 모달이 열릴 때 totalPages 초기화
      await this.fetchCurrentGameQuizzes();
      await this.fetchQuizList(0);
      this.showQuizModal = true;
    },

    async handleSearch() {
      this.currentPage = 1;
      await this.fetchQuizList();
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
      if (!confirm('이 퀴즈를 게임에서 제거하시습니까?')) return;

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
        alert("퀴즈 제거 실패했습니다.");
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
        alert('선택한 퀴즈가 성공적로 추가되었습니다.');
      } catch (error) {
        console.error("퀴즈 추가 실패:", error);
        alert("퀴즈 추가에 실패했습니다.");
      }
    },

    closeQuizModal() {
      this.showQuizModal = false;
      this.showCommentsModal = false;
      this.selectedQuiz = null;
      this.comments = [];
      this.selectedQuizzes = [];
      this.searchKeyword = '';
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
        // TeacherQuiz 목록을 가져옴 (이미 memberNickname이 함되어 있음)
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
      this.showCommentsModal = false;
      this.selectedQuiz = null;
      this.comments = [];
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
        alert('선된 퀴즈가 없습니다.');
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

        // 현재 게임의 퀴 목록을 다시 불러옴
        await this.showQuizListModal(this.currentGame);
        this.selectedCurrentQuizzes = [];
        alert('선택한 퀴즈가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error("퀴즈 삭제 실패:", error);
        alert("퀴즈 삭제에 실패했습니다.");
      }
    },

    handleQuizListSearch() {
      // 퀴즈 목록 보기 검색 처리
    },

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
    },

    showAddGameModal() {
      this.showGameModal = true;
      this.newGame = {
        gameName: '',
        gamePassword: ''
      };
    },

    closeGameModal() {
      this.showGameModal = false;
    },

    async createGame() {
      const token = localStorage.getItem("jwtToken");
      const memberId = localStorage.getItem("memberId");

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BE_API_URL}/api/v1/games`,
          {
            memberId: Number(memberId),
            gameName: this.newGame.gameName,
            gamePassword: this.newGame.gamePassword
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data) {
          await this.fetchMyGames();
          this.closeGameModal();
          alert('게임이 성공적으로 생성되었습니다.');
        }
      } catch (error) {
        console.error("게임 생성 실패:", error);
        alert("게임 생성에 실패했습니다.");
      }
    },

    handleAddQuizSearch() {
      this.quizAddCurrentPage = 1;
    },

    prevAddQuizPage() {
      if (this.quizAddCurrentPage > 1) {
        this.quizAddCurrentPage--;
      }
    },

    nextAddQuizPage() {
      if (this.quizAddCurrentPage < this.quizAddTotalPages) {
        this.quizAddCurrentPage++;
      }
    },

    // 북마크 상태 확인
    isBookmarked(quizId) {
      return this.bookmarks.some(bookmark => bookmark.quizId === quizId) || 
             localStorage.getItem(`bookmark_${quizId}`) === 'true';
    },

    // 북크 토글
    async toggleBookmark(quizId) {
      const token = localStorage.getItem("jwtToken");
      const memberId = localStorage.getItem("memberId");
      
      if (!token || !memberId) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const existingBookmark = this.bookmarks.find(b => b.quizId === quizId);

        if (existingBookmark) {
          await axios.delete(`${beUrl}/api/v1/bookmarks/${existingBookmark.bookmarkId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.bookmarks = this.bookmarks.filter(b => b.quizId !== quizId);
          localStorage.removeItem(`bookmark_${quizId}`);
        } else {
          const response = await axios.post(
            `${beUrl}/api/v1/bookmarks`,
            {
              memberId: Number(memberId),
              quizId: Number(quizId)
            },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          
          if (response.data) {
            this.bookmarks.push(response.data);
            localStorage.setItem(`bookmark_${quizId}`, 'true');
          }
        }
      } catch (error) {
        console.error("북마크 처리 실패:", error);
        alert("북마크 처리에 실패했습니다.");
      }
    },

    // 북마크 목록 조회
    async fetchBookmarks() {
      const token = localStorage.getItem("jwtToken");
      const memberId = localStorage.getItem("memberId");
      
      if (!token || !memberId) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const response = await axios.get(`${beUrl}/api/v1/bookmarks/member/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.bookmarks = response.data;
      } catch (error) {
        console.error("북마크 목록 조회 실패:", error);
      }
    },

    async selectQuizForComments(quiz) {
      this.selectedQuiz = quiz;
      await this.fetchComments(quiz.quizId);
      this.showCommentsModal = true;
    },

    closeCommentsModal() {
      this.showCommentsModal = false;
      this.selectedQuiz = null;
      this.comments = [];
    },

    async fetchComments(quizId) {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const response = await axios.get(`${beUrl}/api/v1/comments/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.comments = response.data.map(comment => ({
          ...comment,
          isEditing: false,
          editContent: comment.quizCommentContent
        }));
      } catch (error) {
        console.error("댓글 조회 실패:", error);
      }
    },

    formatDate(date) {
      if (!date) return '';
      
      try {
        // Array 형식인 경우 (댓글 날짜)
        if (Array.isArray(date)) {
          const year = date[0];
          const month = String(date[1]).padStart(2, '0');
          const day = String(date[2]).padStart(2, '0');
          const hours = String(date[3]).padStart(2, '0');
          const minutes = String(date[4]).padStart(2, '0');
          
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        } 
        // ISO 문자열 형식인 경우
        else {
          const dateObj = new Date(date);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
      } catch (error) {
        console.error('날짜 변환 에러:', error, date);
        return '';
      }
    }
  },
  mounted() {
    this.fetchMyGames();
    this.fetchBookmarks(); // 북마크 목록 초기 로딩
  }
}
</script>

<style scoped>
.my-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  overflow: hidden; /* 전체 페이지 스크롤 방지 */
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 40px;
  overflow-y: auto; /* 로 스크롤 활성화 */
  height: calc(100vh - 120px); /* 헤더와 푸터를 제외한 높이 */
}

.games-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 세로 스크롤 활성화 */
  max-height: calc(100vh - 160px); /* 헤더와 푸터를 제외한 높이 */
}

/* 스크롤바 숨기기 */
.games-section::-webkit-scrollbar {
  display: none; /* 웹킷 기반 브라우저에서 스크롤바 숨기기 */
}

.games-section {
  -ms-overflow-style: none;  /* IE 및 Edge에서 스크롤 숨기기 */
  scrollbar-width: none;  /* Firefox에서 스크롤바 숨기기 */
}

.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
  padding: 10px;
}

.game-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-header {
  margin-bottom: 15px;
  text-align: left;  /* 제목 왼쪽 정렬 */
}

.game-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
}

.quiz-list {
  flex: 1;  /* 남은 공간 채우기 */
  overflow-y: auto;  /* 내용이 많으면 스크롤 */
  margin-bottom: 15px;  /* 버튼과의 간격 */
}

.game-footer {
  margin-top: auto;  /* 하단에 고정 */
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.game-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;  /* 버튼 중앙 정렬 */
}

.view-quiz-btn, .add-quiz-btn {
  min-width: 120px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.view-quiz-btn {
  background-color: #000000d6;
  color: white;
}

.add-quiz-btn {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
}

/* 호버 효과 */
.view-quiz-btn:hover, .add-quiz-btn:hover {
  opacity: 0.9;
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
  table-layout: fixed;
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
.quiz-table th:nth-child(1),
.quiz-table td:nth-child(1) { 
  width: 5%; 
}

.quiz-table th:nth-child(2),
.quiz-table td:nth-child(2) { 
  width: 45%; 
}

.quiz-table th:nth-child(3),
.quiz-table td:nth-child(3) { 
  width: 20%; 
}

.quiz-table th:nth-child(4),
.quiz-table td:nth-child(4) { 
  width: 20%; 
}

.quiz-table th:nth-child(5),
.quiz-table td:nth-child(5) { 
  width: 10%; 
  text-align: center;
  vertical-align: middle;
}

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


.add-selected-btn, .remove-selected-btn, .cancel-btn {
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

.remove-selected-btn {
  background-color: red;
  color: white;
}

.add-selected-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.remove-selected-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.game-buttons button {
  transition: opacity 0.2s;
}

.game-buttons button:hover {
  opacity: 0.9;
}

/* 스크롤바 스타일링 */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 반응형 처리 */
@media (max-height: 900px) {
  .games-section {
    height: auto;
    margin-bottom: 20px;
  }
}

/* 스크롤바 스타일링 */
.games-section::-webkit-scrollbar {
  width: 8px;
}

.games-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.games-section::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.games-section::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.pagination span {
  min-width: 60px;
  text-align: center;
  font-size: 14px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.games-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-game-btn {
  background-color: #000000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.game-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.create-btn {
  background-color: #000000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.bookmark-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
  vertical-align: middle;
}

.bookmark-icon:hover {
  opacity: 0.5;
}

.bookmark-icon.bookmarked {
  opacity: 1;
  filter: invert(28%) sepia(67%) saturate(669%) hue-rotate(346deg) brightness(89%) contrast(83%);
}

/* 북마크 열 너비 조정 */
.quiz-table td:nth-child(5) { 
  width: 5%; 
  text-align: center;
}

.quiz-list-container {
  display: flex;
  gap: 20px;
}

.quiz-table-section {
  flex: 2;  /* 테이블 영역이 더 넓게 */
}

.comments-section {
  flex: 1;  /* 댓글 영역은 더 좁게 */
  padding-left: 20px;
  border-left: 1px solid #ddd;
  max-height: 400px;
  overflow-y: auto;
}

.quiz-row {
  cursor: pointer;
}

.quiz-row:hover {
  background-color: #f5f5f5;
}

.quiz-row.selected {
  background-color: #e9ecef;
}

.comment {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
}

.comment-author {
  font-weight: bold;
}

.comment-date {
  color: #888;
}

.comment-content {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 5px;
}

.comments-modal {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 8px 0 0 8px;
  padding: 20px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.comments-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.close-btn:hover {
  color: #000;
}
</style>
