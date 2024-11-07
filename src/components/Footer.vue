<template>
  <footer class="app-footer">
    <p>&copy; 2024 Quiz Creator. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.app-footer {
  background-color: #333;
  padding: 1rem;
  color: white;
  text-align: center;
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}
</style>
