<template>
  <div class="scroll-container">
    <div class="article-detail-page">
      <AppHeader />
      <div class="content">
        <div class="article-container">
          <div class="article-header">
            <h1 class="article-title">{{ "제목 : " + article.articleTitle }}</h1>
            <div class="article-info">
              <span class="author">작성자: {{ article.memberNickname }}</span>
              <span class="date">작성일: {{ formatDate(article.createdAt) }}</span>
            </div>
          </div>
          <div class="article-content">
            {{ article.articleContents }}
          </div>
          <div class="comments-section">
            <h3>댓글</h3>
            <div class="comment-form">
              <textarea 
                v-model="newComment" 
                placeholder="댓글을 작성해주세요"
                rows="3"
                maxlength="255"
              ></textarea>
              <div class="comment-form-footer">
                <span class="char-count">{{ newComment.length }}/255자</span>
                <button @click="submitComment" class="comment-submit">댓글 작성</button>
              </div>
            </div>
            
            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.articleCommentId" class="comment">
                <div class="comment-header">
                  <div class="comment-left">
                    <span class="comment-author">작성자: {{ comment.memberNickname }}</span>
                  </div>
                  <div class="comment-right">
                    <span class="comment-date">
                      {{ formatDate(comment.articleCommentCreatedAt) }}
                      <span v-if="comment.articleCommentUpdatedAt" class="edited-mark">(수정됨)</span>
                    </span>
                    <div class="comment-actions" v-if="isCurrentUserComment(comment.memberNickname)">
                      <button 
                        v-if="!comment.isEditing" 
                        @click="startEditing(comment)" 
                        class="edit-btn"
                      >
                        수정
                      </button>
                      <button 
                        @click="deleteComment(comment.articleCommentId)" 
                        class="delete-btn"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="comment.isEditing" class="edit-form">
                  <textarea 
                    v-model="comment.editContent" 
                    rows="3"
                    maxlength="255"
                  ></textarea>
                  <div class="edit-form-footer">
                    <span class="char-count">{{ comment.editContent.length }}/255자</span>
                    <div class="edit-buttons">
                      <button @click="saveEdit(comment)" class="save-btn">저장</button>
                      <button @click="cancelEdit(comment)" class="cancel-btn">취소</button>
                    </div>
                  </div>
                </div>
                <p v-else class="comment-content">{{ comment.articleCommentContent }}</p>
              </div>
            </div>
          </div>
          <div class="button-group">
            <button class="list-button" @click="goToList">목록</button>
            <div v-if="isAuthor" class="author-buttons">
              <button class="edit-button" @click="editArticle">수정</button>
              <button class="delete-button" @click="deleteArticle">삭제</button>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import AppHeader from "./Header.vue";
import AppFooter from "./Footer.vue";
import axios from "axios";

export default {
  name: "ArticleDetail",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      article: {
        articleId: null,
        memberNickname: '',
        articleTitle: '',
        articleContents: '',
        createdAt: null
      },
      isAuthor: false,
      newComment: "",
      currentUserNickname: '',
      comments: []
    };
  },
  methods: {
    async fetchArticle() {
      try {
        const token = localStorage.getItem("jwtToken");
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const articleId = this.$route.params.id;
        
        const response = await axios.get(`${beUrl}/api/v1/articles/${articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        this.article = response.data;
        // 작성자 본인인지 확인하는 로직 추가 필요
      } catch (error) {
        console.error("Failed to fetch article:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      }
    },
    formatDate(dateArray) {
      if (!dateArray || !Array.isArray(dateArray)) return '';
      
      try {
        const year = dateArray[0];
        const month = String(dateArray[1]).padStart(2, '0');
        const day = String(dateArray[2]).padStart(2, '0');
        const hours = String(dateArray[3]).padStart(2, '0');
        const minutes = String(dateArray[4]).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    },
    goToList() {
      this.$router.push('/articles');
    },
    editArticle() {
      this.$router.push(`/articles/${this.article.articleId}/edit`);
    },
    async deleteArticle() {
      if (!confirm('정말로 삭제하시겠습니까?')) return;

      try {
        const token = localStorage.getItem("jwtToken");
        const beUrl = process.env.VUE_APP_BE_API_URL;
        
        await axios.delete(`${beUrl}/api/v1/articles/${this.article.articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        alert('게시글이 삭제되었습니다.');
        this.$router.push('/articles');
      } catch (error) {
        console.error("Failed to delete article:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    },
    isCurrentUserComment(commentNickname) {
      return this.currentUserNickname === commentNickname;
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
        const articleId = this.$route.params.id;
        
        // ArticleCommentRequestDto 형식에 맞춰 데이터 전송
        const commentData = {
          articleId: parseInt(articleId),
          articleCommentContent: this.newComment,
          articleCommentCreatedAt: new Date().toISOString()
        };

        await axios.post(
          `${beUrl}/api/v1/article-comments`,
          commentData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // 댓글 작성 성공 후 댓글 목록 새로고침
        this.newComment = "";
        await this.fetchComments();
      } catch (error) {
        console.error("댓글 작성 실패:", error);
        alert("댓글 작성에 실패했습니다.");
      }
    },
    startEditing(comment) {
      comment.isEditing = true;
      comment.editContent = comment.articleCommentContent;
    },
    async saveEdit(comment) {
      if (!comment.editContent.trim()) {
        alert("댓글 내용을 력해주세요.");
        return;
      }

      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        
        await axios.patch(
          `${beUrl}/api/v1/article-comments/${comment.articleCommentId}`,
          {
            articleCommentContent: comment.editContent
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
      comment.editContent = comment.articleCommentContent;
    },
    async deleteComment(commentId) {
      if (!confirm("댓글을 삭제하시겠습니까?")) return;

      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const beUrl = process.env.VUE_APP_BE_API_URL;
        
        await axios.delete(`${beUrl}/api/v1/article-comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await this.fetchComments();
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    },
    async fetchComments() {
      try {
        const token = localStorage.getItem("jwtToken");
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const articleId = this.$route.params.id;
        
        const response = await axios.get(`${beUrl}/api/v1/article-comments`, {
          params: { articleId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.comments = response.data.map(comment => ({
          ...comment,
          isEditing: false,
          editContent: comment.articleCommentContent
        }));
      } catch (error) {
        console.error("댓글 조회 실패:", error);
      }
    }
  },
  async mounted() {
    this.currentUserNickname = localStorage.getItem("memberNickname");
    await this.fetchArticle();
    await this.fetchComments();
  }
};
</script>

<style scoped>
/* App.vue의 스타일을 오버라이드 */
:deep(#app) {
  position: relative !important;
  overflow: auto !important;
  height: auto !important;
}

.scroll-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
}

.article-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #fff;
}

.content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 120px;
  padding-bottom: 120px;
}

.article-container {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article-header {
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.article-title {
  font-size: 24px;
  margin-bottom: 15px;
}

.article-info {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.article-content {
  min-height: 300px;
  line-height: 1.6;
  white-space: pre-wrap;
  padding: 20px 0;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.author-buttons {
  display: flex;
  gap: 10px;
}

.list-button,
.edit-button,
.delete-button {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.list-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.comments-section {
  margin-top: 40px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.comments-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.comment-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-submit {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-submit:hover {
  opacity: 0.9;
}

.comments-list {
  margin-top: 20px;
}

.comment {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-left {
  display: flex;
  align-items: center;
}

.comment-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.comment-author {
  margin-right: 10px;
}

.comment-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  margin-left: 8px;
}

.edit-btn {
  color: #666;
}

.delete-btn {
  color: #dc3545;
}

.edit-btn:hover, .delete-btn:hover {
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

.save-btn, .cancel-btn {
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

.comment-content {
  margin-top: 10px;
}

.edited-mark {
  color: #666;
  font-size: 12px;
  margin-left: 4px;
}
</style> 