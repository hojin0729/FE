<template>
  <div class="article-container">
    <AppHeader />
    <div class="article-form-wrapper">
      <div class="article-form">
        <h2>글 작성</h2>
        <form @submit.prevent="submitForm" class="article-form-content">
          <div class="form-group">
            <input 
              type="text" 
              id="title" 
              v-model="article.articleTitle" 
              required 
              placeholder="제목을 입력하세요"
            />
          </div>
          <div class="form-group">
            <textarea 
              id="content" 
              v-model="article.articleContents" 
              required 
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>
          <div class="button-container">
            <button type="submit">글 작성</button>
          </div>
        </form>
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
  name: "ArticleForm",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      article: {
        memberId: localStorage.getItem("memberId"),
        articleTitle: "",
        articleContents: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          this.$router.push("/login");
          return;
        }

        const beUrl = process.env.VUE_APP_BE_API_URL;
        await axios.post(beUrl + "/api/v1/articles", this.article, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        // 글 작성 후 게시판 페이지로 리디렉션
        this.$router.push("/articles");
      } catch (error) {
        console.error("Failed to create article:", error);
        alert("글 작성에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  },
};
</script>

<style scoped>
.article-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.article-form-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  box-sizing: border-box;
}

.article-form {
  width: 100%;
  max-width: 720px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article-form-content {
  width: 100%;
}

.form-group {
  width: 100%;
  margin-bottom: 1.5rem;
}

input, textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #dadada;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

textarea {
  min-height: 300px;
  resize: vertical;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

button {
  min-width: 120px;
  padding: 0.8rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #020906b3;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}
</style>