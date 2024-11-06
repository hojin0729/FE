<template>
  <div class="container">
    <AppHeader />
    <div class="forum-container">
      <div class="forum-header">
        <h2>게시판</h2>
        <button @click="$router.push('/article/new')" class="write-button">글쓰기</button>
      </div>
      <div class="article-list">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles" :key="article.articleId" @click="viewArticle(article.articleId)" class="article-row">
              <td>{{ article.articleId }}</td>
              <td class="title-cell">{{ article.articleTitle }}</td>
              <td>{{ article.memberId }}</td>
            </tr>
          </tbody>
        </table>
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
  name: "GeneralForum",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      articles: []
    };
  },
  methods: {
    async fetchArticles() {
      try {
        const token = localStorage.getItem("jwtToken");
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const response = await axios.get(beUrl + "/api/v1/articles", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        this.articles = response.data;
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      }
    },
    viewArticle(articleId) {
      this.$router.push(`/article/${articleId}`);
    }
  },
  mounted() {
    this.fetchArticles();
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: 80px;
  background-color: #f5f6f7;
}

.forum-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.write-button {
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.write-button:hover {
  background-color: #020906b3;
}

.article-list table {
  width: 100%;
  border-collapse: collapse;
}

.article-list th,
.article-list td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.article-list th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.article-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.article-row:hover {
  background-color: #f8f9fa;
}

.title-cell {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th:first-child,
td:first-child {
  width: 80px;
  text-align: center;
}

th:last-child,
td:last-child {
  width: 120px;
  text-align: center;
}
</style>
