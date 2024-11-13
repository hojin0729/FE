<template>
  <div class="article-board-page">
    <AppHeader />
    <div class="content">
      <div class="forum-board">
        <div class="search-area">
          <div class="total-count">전체 {{ filteredList.length }}건</div>
          <div class="search-container">
            <select v-model="searchType" class="search-select">
              <option value="all">전체</option>
              <option value="title">제목</option>
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
          <table class="forum-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="article in paginatedArticles" :key="article.articleId">
                <tr>
                  <td class="id-cell">{{ article.articleId }}</td>
                  <td class="title-cell" @click="viewArticle(article.articleId)">
                    <div class="title-wrapper">
                      <span class="title-text">{{ article.articleTitle }}</span>
                    </div>
                  </td>
                  <td class="author-cell">{{ article.memberNickname }}</td>
                  <td class="date-cell">{{ formatDate(article.createdAt) }}</td>
                </tr>
              </template>
              <tr v-for="i in emptyRows" :key="`empty-${i}`" class="empty-row">
                <td colspan="4">&nbsp;</td>
              </tr>
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
            <button class="write-button" @click="$router.push('/articleform')">글쓰기</button>
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
  name: "GeneralForum",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      articles: [],
      currentPage: 1,
      itemsPerPage: 7,
      searchType: 'all',
      searchKeyword: '',
    };
  },
  computed: {
    filteredList() {
      if (!this.searchKeyword) return this.articles;
      
      return this.articles.filter(article => {
        const keyword = this.searchKeyword.toLowerCase();
        switch (this.searchType) {
          case 'title':
            return article.articleTitle.toLowerCase().includes(keyword);
          case 'author':
            return article.memberNickname.toLowerCase().includes(keyword);
          case 'all':
            return article.articleTitle.toLowerCase().includes(keyword) ||
                   article.memberNickname.toLowerCase().includes(keyword);
          default:
            return true;
        }
      });
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.itemsPerPage);
    },
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
        this.articles = response.data.sort((a, b) => b.articleId - a.articleId);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        alert("게시글을 불러는데 실패했습니다.");
      }
    },
    viewArticle(articleId) {
      this.$router.push(`/articles/${articleId}`);
    },
    formatDate(dateArray) {
      if (!dateArray || !Array.isArray(dateArray)) return '';
      
      try {
        const year = dateArray[0];
        const month = String(dateArray[1]).padStart(2, '0');
        const day = String(dateArray[2]).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    },
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
    goToPage(pageNum) {
      this.currentPage = pageNum;
    },
    getDisplayedPages() {
      const totalPages = this.totalPages;
      const current = this.currentPage;
      
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
    handleSearch() {
      this.currentPage = 1;
    },
  },
  watch: {
    searchType() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchArticles();
  }
};
</script>

<style scoped>
.article-board-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
}

.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 40px;
}

.forum-board {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container {
  width: 100%;
}

.total-count {
  text-align: right;
  margin-top: 10px;
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
}

.search-input {
  width: 500px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-button {
  width: 80px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.forum-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #333;
  table-layout: fixed;
}

.forum-table th,
.forum-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  height: 52px;
  box-sizing: border-box;
}

.forum-table th:nth-child(1) {
  width: 10%;
}

.forum-table th:nth-child(2) {
  width: 50%;
}

.forum-table th:nth-child(3) {
  width: 20%;
}

.forum-table th:nth-child(4) {
  width: 20%;
}

.article-row {
  cursor: pointer;
}

.article-row:hover {
  background-color: #f8f9fa;
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
  display: flex;
  align-items: center;
  gap: 20px;  /* 페이지네이션과 글쓰기 버튼 사이 간격 */
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

.write-button {
  margin-left: auto;
  width: 76.35px;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
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
  cursor: pointer;
}

.page-num.active {
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
}

.dummy-button {
  width: 76.35px;
  padding: 8px 12px;
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.write-button:hover {
  background-color: #020906b3;
}

@media (max-width: 768px) {
  .search-area {
    flex-direction: column;
    gap: 12px;
  }

  .search-container {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
}

.column-10 {
  width: 10%;
  text-align: center;
}

.column-50 {
  width: 50%;
  text-align: left;
}

.column-20 {
  width: 20%;
  text-align: center;
}

.id-cell {
  text-align: center;
}

.title-cell {
  text-align: left;
  padding-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0; /* 말줄임표를 위해 필요 */
}

.author-cell {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-cell {
  text-align: center;
  white-space: nowrap;
}
</style>