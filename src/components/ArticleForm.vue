<template>
  <div class="container">
    <AppHeader />
    <div class="article-form">
      <h2>글 작성</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="title">제목:</label>
          <input 
            type="text" 
            id="title" 
            v-model="article.articleTitle" 
            required 
            placeholder="제목을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label for="content">내용:</label>
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
body {
  overflow: hidden;
  margin: 0;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-top: 80px;
  padding-bottom: 4rem;
}

.article-form h2 {
  margin-left: 100px;
}

.article-form {
  width: 100%;
  max-width: 500px;
  height: 70vh;
  margin: 0 auto;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.button-container {
  display: flex;
  margin-left: 100px;
  justify-content: center;
}

label {
  width: 100px;
  margin-right: 1rem;
  text-align: left;
  padding-top: 0.5rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dadada;
  border-radius: 6px;
}

textarea {
  flex: 1;
  min-height: 300px;
  padding: 0.5rem;
  resize: vertical;
  border: 1px solid #dadada;
  border-radius: 6px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.865);
}

button {
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #020906b3;
}
</style>