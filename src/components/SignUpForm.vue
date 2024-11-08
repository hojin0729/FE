<template>
    <div class="signup-page">
      <AppHeader />
      <div class="signup-form-container">
        <h2>회원 가입</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="email">이메일:</label>
            <input type="email" id="email" v-model="member.memberEmail" required />
          </div>
  
          <div class="form-group">
            <label for="password">비밀번호:</label>
            <input type="password" id="password" v-model="member.memberPassword" required />
          </div>
  
          <div class="form-group">
            <label for="name">이름:</label>
            <input type="text" id="name" v-model="member.memberName" required />
          </div>
  
          <div class="form-group">
            <label for="school">학교:</label>
            <input type="text" id="school" v-model="member.memberSchool" required />
          </div>
  
          <div class="form-group">
            <label for="birthDay">생년월일:</label>
            <input type="date" id="birthDay" v-model="member.memberBirthDay" required />
          </div>
  
          <div class="form-group">
            <label for="nickname">닉네임:</label>
            <input type="text" id="nickname" v-model="member.memberNickname" required />
          </div>
  
          <div class="form-group">
          <label for="role">역할:</label>
          <input type="text" id="role" :value="roleDisplay" readonly class="readonly-input" />
        </div>
  
          <div class="form-group">
            <label for="grade">학년:</label>
            <input type="number" id="grade" v-model="member.memberGrade" min="1" max="12" required />
          </div>
  
          <div class="form-group">
            <label for="class">반:</label>
            <input type="number" id="class" v-model="member.memberClass" min="1" required />
          </div>
  
          <button type="submit">회원가입</button>
        </form>
      </div>
      <AppFooter />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import AppHeader from './Header.vue';
  import AppFooter from './Footer.vue';
  
  export default {
    name: "SignUpForm",
    components: {
      AppHeader,
      AppFooter
    },
    data() {
      return {
        member: {
          memberEmail: "",
          memberPassword: "",
          memberName: "",
          memberSchool: "",
          memberBirthDay: "",
          memberNickname: "",
          memberRole: "TEACHER", // 역할을 'TEACHER'로 고정
          memberGrade: null,
          memberClass: null,
        },
      };
    },
    computed: {
    roleDisplay() {
      return this.member.memberRole === "TEACHER" ? "선생님" : this.member.memberRole;
    }
  },
    methods: {
      async submitForm() {
        try {
            const beUrl = process.env.VUE_APP_BE_API_URL;
          await axios.post( beUrl + "/api/v1/members/register", this.member);
          alert("회원가입이 완료되었습니다!");
          this.$router.push("/login"); // 로그인 페이지로 이동
        } catch (error) {
          console.error("Failed to sign up:", error);
          alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .signup-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .signup-form-container {
    width: 500px;
    margin: 0 auto;
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  label {
    width: 100px;
    margin-right: 1rem;
    text-align: left;
  }
  
  input,
  select {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #555;
  }
  
  </style>