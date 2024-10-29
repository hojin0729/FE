# Vue 가이드
## 1. Vue 설치
```bash
npm install vue@3.2.13
```

## 2. Vue Router 설치
```bash
npm install vue-router
```

## 3. postcss 업데이트 (GitHub push 에러 수정 위해)
```bash
npm uninstall postcss
npm install postcss@^8.4.31
rm -rf node_modules package-lock.json
npm install
npm audit
```

## 4. ESlint 가 난리라면
```bash
npm uninstall eslint eslint-plugin-vue
npm install eslint@^8.0.0 eslint-plugin-vue@^9.0.0 --save-dev
```