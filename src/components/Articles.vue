<template>
  <div class="home-page">
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
                <th style="width: 10%">번호</th>
                <th style="width: 60%">제목</th>
                <th style="width: 15%">작성자</th>
                <th style="width: 15%">작성일</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="i in itemsPerPage" :key="i">
                <tr v-if="paginatedArticles[i-1]" @click="viewArticle(paginatedArticles[i-1].articleId)" class="article-row">
                  <td class="id-cell">{{ paginatedArticles[i-1].articleId }}</td>
                  <td class="title-cell">{{ paginatedArticles[i-1].articleTitle }}</td>
                  <td class="author-cell">{{ paginatedArticles[i-1].memberNickname }}</td>
                  <td class="date-cell">{{ formatDate(paginatedArticles[i-1].createdAt) }}</td>
                </tr>
                <tr v-else class="empty-row">
                  <td colspan="4">&nbsp;</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="pagination-container">
            <div class="dummy-button">글쓰기</div>
            <div class="pagination-wrapper">

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
            <button class="write-button" @click="$router.push('/articleform')">
              글쓰기
            </button>
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
      itemsPerPage: 10,
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
        alert("게시글을 불러오는데 실패했습니다.");
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
/* HomePage.vue의 스타일을 그대로 가져와서 필요한 부분만 수정 */
.home-page {
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
  padding-top: 80px;
  padding-bottom: 40px;
}

.forum-board {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
}

/* ... HomePage.vue의 나머지 스타일을 그대로 사용 ... */
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
}

.forum-table th,
.forum-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  height: 52px;
}

.article-row {
  cursor: pointer;
}

.article-row:hover {
  background-color: #f8f9fa;
}

/* 페이지네이션 스타일 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  gap: 38%;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-numbers {
  display: flex;
  gap: 5px;
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

.pagination {
  display: flex;
  align-items: center;
  gap: 20px;  /* 페이지네이션과 글쓰기 버튼 사이 간격 */
}

.write-button {
  width: 76.35px;
  padding: 8px 20px;
  background-color: rgba(0, 0, 0, 0.865);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 30px;
  display: flex;
  align-items: center;
}
.dummy-button {
  width: 76.35px;
  padding: 8px 20px;
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 30px;
  display: flex;
  align-items: center;
}

.write-button:hover {
  background-color: #020906b3;
}

/* 반응형 스타일 */
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
</style>