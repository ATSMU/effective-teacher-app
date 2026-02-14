<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1I1BbbPs4x5z-9oSZjN5GbFXLRo20IUdU

## Run Locally

**Важно:** не открывайте `index.html` напрямую в браузере (двойной клик или Live Server) — будут ошибки 404. Приложение нужно запускать через Vite.

**Нужно:** Node.js

1. Установите зависимости: `npm install`
2. Создайте файл `.env.local` и укажите `GEMINI_API_KEY=ваш_ключ` (см. `.env.example`)
3. Запустите приложение: **`npm run dev`**
4. Откройте в браузере: **http://localhost:3000**
