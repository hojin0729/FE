# 어떻게 더할까
페이지를 더하는 방법에 대해서 상세하게 정리해 뒀습니다.

## 1. 페이지 만들기
일단 기본적으로 Vue.js 를 통해 페이지를 구현하기 위해서는 npm 을 사용해서 vue 를 설치해 주셔야 합니다.

```bash
npm install vue@3.2.13
```

우리 프로젝트는 3.2.13 버전을 사용하기로 했습니다.

---

### .vue 파일의 기본 구조
.vue 파일을 하나 만들어서 페이지를 만들어야 합니다. 페이지를 만들기에 앞서, .vue 라는 파일에는 어떤 요소들이 들어가야 하는지 알아 보겠습니다.

- `<`template`>` : HTML 구조를 정의하는 부분입니다. 컴포넌트가 렌더링할 내용을 포함한다.
- `<`script`>` : JavaScript 로직을 정의하는 부분입니다. 컴포넌트의 데이터, 메서드, 라이프사이클 훅 등을 포함합니다.
- `<`style`>` : CSS 스타일을 정의하는 부분입니다. 컴포넌트에 적용할 스타일을 포함할 수 있습니다.
- template 태그나 script 태그는 없으면 안 되지만, style 태그는 유일하게 없어도 됩니다.

```vue
<template>
    <div>
        <h1>Home Page</h1>
    </div>
</template>
  
<script>
export default {
    name: 'HomePage' // 컴포넌트 이름은 두 개 이상의 단어로 구성되어야 합니다.
}
</script>

<style scoped>
/* 이곳에 CSS 스타일을 추가할 수 있습니다. */
h1 {
    color: blue; /* 예시 스타일 */
}
</style>
```

Vue.js 에서 다른 JS 프레임워크와의 가장 큰 차이점은 `<`script`>` 태그인 것 같습니다.

## 2. 라우팅 추가하기
새로운 페이지를 추가한 뒤에는, 해당 페이지에 라우팅을 설정해야 합니다.

라우팅이란, path 와 파일을 연결하는 것을 의미합니다.

### 2-1. Vue Router 설치하기
먼저, Vue Router 를 설치해야 합니다.
```bash
npm install vue-router
```

### 2-2. 페이지 만들기
위에 있는 "1. 페이지 만들기"를 참고해서 페이지를 .vue 확장자로 만들어 주세요.

### 2-3. 라우터 설정하기
src/router 디렉터리에 "index.js" 라는 이름의 파일을 만들어 두었습니다. 이 페이지는 path 와 파일을 연결해주는 '라우터' 의 역할을 합니다.

라우터는 URL 경로와 Vue 컴포넌트(파일)를 연결하여 사용자가 웹 애플리케이션 내에서 다양한 페이지로 이동할 수 있게 해줍니다.

일반적으로 라우터 파일은 src/router/index.js 인데, Vue CLI 에서 기본적으로 설정하는 구조이기 때문입니다. 이름이 꼭 index.js 이거나, src/router 에 있을 필요는 없습니다.

### 2-4. Vue 인스턴스에 라우터 추가 (main.js 파일)
src/main.js 파일에서 Vue 인스턴스에 라우터를 추가합니다.

```js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 라우터 임포트

createApp(App)
    .use(router) // 라우터 사용
    .mount('#app'); // 앱을 DOM에 마운트
```

main.js 는 Vue 애플리케이션의 진입점(Entry Point) 이며, Vue 인스턴스를 생성하는 파일입니다.

Java 를 예로 들면 public static void main(String[] args) 메서드에 해당한다고 생각하면 되겠습니다.

특이하지만 라우터를 입포트할 때는 파일을 임포트하는 것이 아니라 해당 디렉터리를 임포트하는 것을 볼 수 있습니다.

JavaScript 에서는 특정 디렉터리를 임포트할 때, 그 디렉터리 내에 index.js 파일이 존재하면 해당 파일이 자동으로 임포트 된다고 합니다.

### 2-5. 라우터 링크 사용 (App.vue 파일)

라우팅이 설정된 이후, 사용자가 페이지를 추가할 수 있도록 링크를 추가해 줘야 합니다. 어떤 path 에 어떤 파일을 Mapping 할지를 결정합니다. (네비게이션)

App.vue 파일에 roter-link 태그를 사용해서 네비게이션을 구현할 수 있습니다.

```vue
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view></router-view> <!-- 현재 라우트에 해당하는 컴포넌트를 렌더링 -->
  </div>
</template>
```
위의 코드와 같이 작성하면 Home 이라는 글씨를 눌렀을 때 "/" path 로 이동할 수 있다.