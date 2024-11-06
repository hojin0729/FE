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
            <select id="role" v-model="member.memberRole" required>
              <option disabled value="">역할을 선택하세요</option>
              <option value="USER">사용자</option>
              <option value="ADMIN">관리자</option>
            </select>
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
          memberRole: "",
          memberGrade: null,
          memberClass: null,
        },
      };
    },
    methods: {
      async submitForm() {
        try {
          await axios.post("http://localhost:5678/api/v1/members/signup", this.member);
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
    margin: 2rem auto;
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 2.5rem;
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
  