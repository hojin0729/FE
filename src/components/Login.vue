<template>
  <div class="container">
    <AppHeader />
    <div class="login-form">
      <div class="login-content">
        <div class="logo-area">
          <img src="@/assets/image.png" alt="DGU" class="logo-image" width="100" height="100">
        </div>
        <form @submit.prevent="submitLogin">
          <div class="input-row">
            <input type="email" 
                   id="email" 
                   v-model="loginData.memberEmail" 
                   placeholder="이메일"
                   required />
          </div>
          <div class="input-row">
            <input type="password" 
                   id="password" 
                   v-model="loginData.memberPassword" 
                   placeholder="비밀번호"
                   required />
          </div>
          <div class="login-button-area">
            <button type="submit">로그인</button>
          </div>
          <div class="login-help">
            <div class="login-check">
              <label>
                <input type="checkbox" /> 로그인 상태 유지
              </label>
            </div>
            <div class="right-links">
              <a href="#">비밀번호 찾기</a>
              <span class="divider">|</span>
              <a href="#">아이디 찾기</a>
              <span class="divider">|</span>
              <a href="#">회원가입</a>
            </div>
          </div>
        </form>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AppHeader from "./Header.vue";
import AppFooter from "./Footer.vue";

export default {
  name: "LoginForm",
  components: {
    AppHeader,
    AppFooter
  },
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
  body {
    overflow: hidden;
    margin: 0;
  }
  
  .container {
    min-height: 100vh;
    background-color: #f5f6f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
    padding-bottom: 80px;
  }
  
  .login-form {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .login-content {
    background-color: white;
    padding: 40px;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .logo-area {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .logo-area h1 {
    color: rgba(0, 0, 0, 0.865);
    font-size: 32px;
    font-weight: bold;
  }
  
  .input-row {
    position: relative;
    margin-bottom: 10px;
  }
  
  .input-row input {
    width: 100%;
    height: 48px;
    padding: 0 15px;
    border: 1px solid #dadada;
    border-radius: 6px;
    font-size: 15px;
    box-sizing: border-box;
  }
  
  .input-row input:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.865);
  }
  
  .login-button-area {
    margin-top: 20px;
  }
  
  .login-button-area button {
    width: 100%;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.865);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .login-button-area button:hover {
    background-color: #020906b3;
  }
  
  .login-help {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  
  .login-check {
    color: #777;
  }
  
  .login-check input[type="checkbox"] {
    margin-right: 5px;
  }
  
  .right-links {
    display: flex;
    align-items: center;
  }
  
  .right-links a {
    color: #888;
    text-decoration: none;
    font-size: 13px;
  }
  
  .right-links a:hover {
    text-decoration: underline;
    color: rgba(0, 0, 0, 0.865);
  }
  
  .divider {
    margin: 0 10px;
    color: #dadada;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .login-form {
      padding: 20px;
    }
    
    .login-content {
      padding: 20px;
    }

    .login-help {
      flex-direction: column;
      gap: 10px;
    }

    .right-links {
      width: 100%;
      justify-content: center;
    }
  }
  </style>
  