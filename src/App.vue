<!-- Vue 컴포넌트. 라우터 링크를 사용하여 페이지를 이동할 수 있다. -->
<template>
  <div id="app">
    <nav>
      
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* #app이 화면에 고정되도록 설정 */
#app {
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  width: 100vw; /* 전체 화면 너비 */
  height: 100vh; /* 전체 화면 높이 */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  margin: 0; /* 상단 여백 제거 */
  padding: 0; /* 패딩 제거 */
  box-sizing: border-box; /* 패딩과 보더가 너비와 높이에 포함되도록 설정 */
}

</style>