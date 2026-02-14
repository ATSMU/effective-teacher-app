# Выгрузка проекта на GitHub

Репозиторий уже инициализирован, первый коммит создан. Осталось создать репозиторий на GitHub и отправить код.

---

## Как открыть сайт по ссылке (GitHub Pages)

Чтобы по ссылке открывалось **приложение**, а не только код:

1. В репозитории на GitHub откройте **Settings** → **Pages**.
2. В блоке **Build and deployment** выберите **Source**: **GitHub Actions**.
3. Запушьте этот проект (в нём уже есть workflow для деплоя). После пуша в ветку `main` автоматически запустится сборка и публикация.
4. Готовый сайт будет по адресу: **https://farruhk12.github.io/effective-teacher/**

## Шаг 1. Создать репозиторий на GitHub

1. Откройте [github.com](https://github.com) и войдите в аккаунт.
2. Нажмите **«+»** → **«New repository»**.
3. Укажите имя, например: **effective-teacher** или **effektivnyj-prepodavatel**.
4. Оставьте репозиторий **пустым** (не ставьте галочки «Add README» и т.п.).
5. Нажмите **«Create repository»**.

## Шаг 2. Подключить удалённый репозиторий и отправить код

В терминале в папке проекта выполните (подставьте **ваш логин** и **имя репозитория**):

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git
git branch -M main
git push -u origin main
```

**Пример**, если логин `Xarda` и репозиторий `effective-teacher`:

```bash
git remote add origin https://github.com/Xarda/effective-teacher.git
git branch -M main
git push -u origin main
```

При первом `git push` браузер или Git могут запросить вход в GitHub (логин и пароль или токен).

---

**Важно:** Файл `.env.local` с ключами API в репозиторий не попадает (он в `.gitignore`). Для деплоя или для других разработчиков используйте `.env.example` как образец.
