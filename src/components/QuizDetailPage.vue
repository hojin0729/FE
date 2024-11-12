<template>
  <div class="quiz-detail-page">
    <AppHeader />
    <div class="content">
      <div class="quiz-detail">
        <!-- 퀴즈 정보 섹션 -->
        <div class="quiz-info">
          <div class="quiz-header">
            <h2>{{ quiz.quizTitle }}</h2>
            <div class="quiz-meta">
              <span class="category-badge">{{ quiz.quizCategory }}</span>
              <span class="level-badge">{{ quiz.quizLevel }}</span>
              <span class="author">작성자: {{ quiz.memberNickname }}</span>
              <span class="date">작성일: {{ formatDate(quiz.date) }}</span>
            </div>
          </div>
          
          <!-- 퀴즈 내용 -->
          <div class="quiz-content">
            <div class="quiz-description">
              <h3>문제 내용</h3>
              <p>{{ quiz.quizDescription }}</p>
            </div>
            <div class="quiz-answer">
              <h3>정답</h3>
              <p>{{ quiz.quizAnswer }}</p>
            </div>
          </div>
        </div>

        <!-- 댓글 섹션 -->
        <div class="comments-section">
          <h3>댓글</h3>
          <div class="comment-form">
            <textarea 
              v-model="newComment" 
              placeholder="댓글을 작성해주세요"
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="comment-form-footer">
              <span class="char-count">{{ newComment.length }}/500자</span>
              <button @click="submitComment" class="comment-submit">댓글 작성</button>
            </div>
          </div>
          
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.quizCommentId" class="comment">
              <div class="comment-header">
                <div class="comment-left">
                  <span class="comment-author">{{ comment.memberNickname }}</span>
                  <span class="comment-date">{{ formatDate(comment.quizCommentCreatedAt) }}</span>
                </div>
                <div class="comment-actions" v-if="comment.memberNickname === memberNickname">
                  <button 
                    v-if="!comment.isEditing" 
                    @click="startEditing(comment)" 
                    class="edit-btn"
                  >
                    수정
                  </button>
                  <button 
                    @click="deleteComment(comment.quizCommentId)" 
                    class="delete-btn"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div v-if="comment.isEditing" class="edit-form">
                <textarea 
                  v-model="comment.editContent" 
                  rows="3"
                  maxlength="500"
                ></textarea>
                <div class="edit-form-footer">
                  <span class="char-count">{{ comment.editContent.length }}/500자</span>
                  <div class="edit-buttons">
                    <button @click="saveEdit(comment)" class="save-btn">저장</button>
                    <button @click="cancelEdit(comment)" class="cancel-btn">취소</button>
                  </div>
                </div>
              </div>
              <p v-else class="comment-content">{{ comment.quizCommentContent }}</p>
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
import axios from "axios";

export default {
  name: "QuizDetailPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      quiz: {
        quizId: null,
        memberId: null,
        quizTitle: "",
        quizCategory: "",
        quizLevel: "",
        quizAnswer: "",
        quizDescription: "",
        memberNickname: "",
        date: null,
        count: 0
      },
      comments: [],
      newComment: "",
      selectedAnswer: null,
      showResult: false,
      currentUserId: null,
      memberNickname: localStorage.getItem("memberNickname") || "",
      memberId: localStorage.getItem("memberId") || "",
    };
  },
  methods: {
    async fetchQuizDetail() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const quizId = this.$route.params.id;
        
        const response = await axios.get(`${beUrl}/api/v1/quizs/quiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('백엔드 응답 데이터:', response.data);

        this.quiz = {
          quizId: response.data.quizId,
          quizTitle: response.data.quizTitle,
          quizCategory: response.data.quizCategory,
          quizLevel: response.data.quizLevel,
          quizAnswer: response.data.quizAnswer,
          quizDescription: response.data.quizDescription,
          memberNickname: response.data.memberNickname,
          date: response.data.date,
          count: response.data.count || 0
        };

        console.log('매핑된 퀴즈 데이터:', {
          제목: this.quiz.quizTitle,
          카테고리: this.quiz.quizCategory,
          난이도: this.quiz.quizLevel,
          작성자: this.quiz.memberNickname,
          작성일: this.quiz.date,
          원본데이터: response.data
        });

      } catch (error) {
        console.error("퀴즈 상세 정보 조회 실패:", error);
        console.error('에러 응답:', error.response?.data);
        alert("퀴즈 정보를 불러오는 데 실패했습니다.");
      }
    },
    async fetchComments() {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const quizId = this.$route.params.id;
        
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
    isCurrentUserComment(commentMemberId) {
      return commentMemberId === this.memberId;
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const quizId = this.$route.params.id;
        
        await axios.post(
          `${beUrl}/api/v1/comments/quiz/${quizId}`,
          {
            memberId: this.memberId,
            quizCommentContent: this.newComment
          },
          { headers: { Authorization: `Bearer ${token}` }}
        );

        this.newComment = "";
        await this.fetchComments();
      } catch (error) {
        console.error("댓글 작성 실패:", error);
        alert("댓글 작성에 실패했습니다.");
      }
    },
    async deleteComment(commentId) {
      if (!confirm("댓글을 삭제하시겠습니까?")) return;

      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        
        await axios.delete(`${beUrl}/api/v1/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await this.fetchComments();
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    },
    selectAnswer(answer) {
      this.selectedAnswer = answer;
    },
    submitAnswer() {
      this.showResult = true;
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
        // ISO 문자열 형식인 경우 (퀴즈 성 날짜)
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
    },
    startEditing(comment) {
      comment.isEditing = true;
      comment.editContent = comment.quizCommentContent;
    },
    async saveEdit(comment) {
      if (!comment.editContent.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        
        await axios.put(
          `${beUrl}/api/v1/comments/${comment.quizCommentId}`,
          {
            memberId: this.memberId,
            quizCommentContent: comment.editContent
          },
          { headers: { Authorization: `Bearer ${token}` }}
        );

        comment.isEditing = false;
        await this.fetchComments();
      } catch (error) {
        console.error("댓글 수정 실패:", error);
        alert("댓글 수정에 실패했습니다.");
      }
    },
    cancelEdit(comment) {
      comment.isEditing = false;
      comment.editContent = comment.quizCommentContent;
    }
  },
  async mounted() {
    const memberId = localStorage.getItem("memberId");
    this.currentUserId = memberId ? parseInt(memberId) : null;
    
    await this.fetchQuizDetail();
    await this.fetchComments();
  }
};
</script>

<style scoped>
.quiz-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 100vh;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 40px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content::-webkit-scrollbar {
  display: none;
}

.quiz-detail {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.quiz-header {
  text-align: left;
  margin-bottom: 20px;
}

.quiz-header h2 {
  font-size: 24px;
  margin: 0 0 15px 0;
  padding: 0;
  color: #333;
}

.quiz-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.quiz-info {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quiz-content {
  margin-top: 30px;
}

.quiz-description h3,
.quiz-answer h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
}

.quiz-description p,
.quiz-answer p {
  line-height: 1.6;
  color: #444;
  text-align: left;
}

.category-badge,
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #e9ecef;
  color: #495057;
}

.answer-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.answer-button {
  width: 100px;
  height: 100px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background-color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.answer-button:hover {
  border-color: rgba(0, 0, 0, 0.865);
}

.answer-button.selected {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border-color: rgba(0, 0, 0, 0.865);
}

.answer-button.correct {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.answer-button.wrong {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.submit-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.quiz-explanation {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.comments-section {
  margin-top: 40px;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.comments-section::-webkit-scrollbar {
  display: none;
}

.comment-form {
  margin-bottom: 20px;
}

.comment-form textarea {
  width: 98%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.comment-submit {
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment {
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.comment-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.comment-author {
  font-weight: bold;
  color: #333;
}

.comment-date {
  color: #666;
  font-size: 0.9em;
}

.view-count {
  color: #666;
  font-size: 0.9em;
}

.quiz-meta > span {
  display: inline-flex;
  align-items: center;
}

.quiz-meta > span:not(:last-child)::after {
  content: "•";
  margin: 0 8px;
  color: #ddd;
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.char-count {
  font-size: 12px;
  color: #666;
}

.delete-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
}

.delete-btn:hover {
  text-decoration: underline;
}

.comment-actions {
  display: flex;
  align-items: center;
}

.edit-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
}

.edit-btn:hover {
  text-decoration: underline;
}

.edit-form {
  margin-top: 10px;
}

.edit-form textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.edit-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.edit-buttons {
  display: flex;
  gap: 8px;
}

.save-btn,
.cancel-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.save-btn {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
}

.cancel-btn {
  background-color: #e9ecef;
  color: #666;
}

.save-btn:hover {
  background-color: #000;
}

.cancel-btn:hover {
  background-color: #dee2e6;
}

@media (max-width: 768px) {
  .content {
    padding: 10px;
  }
  
  .quiz-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .answer-section {
    flex-direction: column;
    align-items: center;
  }
}
</style>
