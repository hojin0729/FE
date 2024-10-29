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
npm install postcss@^8.4.31
npm audit
rm -rf node_modules package-lock.json
npm install
```