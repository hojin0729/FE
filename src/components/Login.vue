<template>
  <div class="container">
    <AppHeader />
    <div class="login-form">
      <div class="login-content">
        <div class="logo-area">
          <img src="@/assets/image.png" alt="DGU" class="logo-image" width="100" height="100">
        </div>
        <div class="login-inputs">
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
            <button @click="submitLogin">로그인</button>
          </div>
          <div class="login-help">
            <div class="right-links">
              <a href="#">비밀번호 찾기</a>
              <span class="divider">|</span>
              <a href="#">아이디 찾기</a>
              <span class="divider">|</span>
              <router-link to="/signup">회원가입</router-link>
            </div>
          </div>
        </div>
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
        const beUrl = process.env.VUE_APP_BE_API_URL;
        const response = await axios.post(beUrl + "/api/v1/members/login", this.loginData,
        { withCredentials: true }
        );
        
        console.log("Full response:", response.data);

        const fullToken = response.data;
        const token = fullToken.startsWith("Bearer ") ? fullToken.slice(7) : fullToken;

        if (!token) {
          throw new Error("No token found in response");
        }

        // JWT 디코딩
        const decodedToken = jwtDecode(token);
        const memberId = decodedToken.memberId;
        const memberNickname = decodedToken.memberNickname;

        if (!memberId || !memberNickname) {
          throw new Error("Required information not found in token");
        }

        // localStorage에 저장
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("memberId", memberId);
        localStorage.setItem("memberNickname", memberNickname);

        this.$router.push("/");
      } catch (error) {
        console.error("Login failed:", error);
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
      }
    }
  }
};

  </script>
  
  <style scoped>


html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 스크롤 제거 */
}

* {
  box-sizing: border-box;
}

.container {
  width: 100vw; /* 화면 너비 전체 */
  height: 100vh; /* 화면 높이 전체 */
  background-color: #f5f6f7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content {
  width: 450px; /* 가로 크기 고정 */
  height: 450px; /* 세로 크기 고정 */
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