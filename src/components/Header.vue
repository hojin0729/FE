<template>
  <header class="app-header">
    <img src="@/assets/image.png" alt="Header Image" class="header-image" />
    <nav class="nav-bar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/create">Create Quiz</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.app-header {
  background-color: #FFF;
  height: 100px; /* 헤더 높이를 명확하게 지정 */
  padding: 1rem 2rem; /* 좌우 여백을 늘려줌 */
  color: black;
  display: flex;
  justify-content: space-between; /* 이미지와 내비게이션 사이의 공간을 확보 */
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 헤더를 다른 요소 위에 위치시키기 위한 z-index */
  box-sizing: border-box; /* 패딩을 포함한 전체 너비 계산 */
  border-bottom: 2px solid #ddd; /* 구분 선 추가 */
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

nav a {
  color: black;
  text-decoration: none;
}

.header-image {
  height: 80px; /* 이미지 높이 설정 */
  width: auto; /* 가로 비율을 자동으로 설정 */
}
</style>
