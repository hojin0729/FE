<template>
  <div id="app">
    <QuizForm />
  </div>
</template>

<script>
import QuizForm from './components/QuizForm.vue';

export default {
  components: {
    QuizForm,
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
