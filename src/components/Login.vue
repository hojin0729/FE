<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="submitLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="loginData.memberEmail" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="loginData.memberPassword" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
 import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  name: "LoginForm",
  data() {
    return {
      loginData: {
        memberEmail: "",
        memberPassword: ""
      }
    };
  },
  methods: {
    async submitLogin() {
      try {
        const response = await axios.post("http://localhost:5678/api/v1/members/login", this.loginData,
        { withCredentials: true }
        );
        
        console.log("Full response:", response.data); // 응답 데이터 확인

        // Bearer 접두어 제거
        const fullToken = response.data;
        const token = fullToken.startsWith("Bearer ") ? fullToken.slice(7) : fullToken;

        if (!token) {
          throw new Error("No token found in response");
        }

        // JWT에서 memberId 추출
        const decodedToken = jwtDecode(token);
        const memberId = decodedToken.memberId;

        if (!memberId) {
          throw new Error("No memberId found in token");
        }

        // 로컬 스토리지에 토큰 및 memberId 저장
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("memberId", memberId);

        this.$router.push("/"); // 메인 페이지로 리디렉션
      } catch (error) {
        console.error("Login failed:", error);
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
      }
    }
  }
};

  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  button {
    width: 100%;
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  