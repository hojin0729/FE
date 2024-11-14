<template>
  <div class="container">
    <div class="signup-form">
      <div class="signup-content">
        <div class="logo-area">
          <img src="@/assets/image.png" alt="DGU" class="logo-image" width="100" height="100">
        </div>
        <h2></h2>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "SignUpForm",
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
.container {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/dgu_ground.png') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  z-index: 0;
}

.signup-form {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-content {
  width: 500px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #3f2702;
}

.logo-area {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #3f2702;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

label {
  width: 100px;
  margin-right: 1rem;
  color: #3f2702;
}

input {
  flex: 1;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dadada;
  border-radius: 6px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3f2702;
}

.readonly-input {
  background-color: #f5f5f5;
}

button {
  width: 100%;
  height: 50px;
  background-color: #3f2702;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 20px;
}

button:hover {
  background-color: #5c3803;
}

@media (max-width: 768px) {
  .signup-content {
    width: 90%;
    padding: 20px;
  }

  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    margin-bottom: 5px;
  }

  input {
    width: 100%;
  }
}
</style>