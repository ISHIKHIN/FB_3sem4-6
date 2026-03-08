# Магазин плюшевых игрушек (React + Express)
Тестовый проект зоомагазина с CRUD операциями. Frontend на React, Backend на Express, документация API через Swagger.


## Функционал

- Просмотр списка плюшевых игрушек (10 уже существующих товаров)
- Добавление нового товара в каталог
- Редактирование существующего товара
- Удаление товара
- Валидация всех полей формы
- Интерактивная документация API (Swagger UI)


## Карточка товара содержит

- **Название** (например, *"Плюшевый мишка"*)
- **Категория** (например, *"Медведи"*)
- **Описание**
- **Цена**
- **Количество на складе**


## Технологии

### Backend
- [Express](https://expressjs.com/) — веб-фреймворк
- [CORS](https://github.com/expressjs/cors) — middleware для CORS
- [nanoid](https://github.com/ai/nanoid) — генерация уникальных ID
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) / [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) — документация API

### Frontend
- [React](https://reactjs.org/) — пользовательский интерфейс
- [Axios](https://axios-http.com/) — HTTP-запросы
- [SCSS](https://sass-lang.com/) — стилизация


## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/ISHIKHIN/FB_3sem4-6
cd backend
npm init -y
npm install
npm start
```

Открыть второй новый терминал и выполнить следующее:

```bash
cd frontend
npm install
npm start
```

frontend: http://localhost:3001
backend: http://localhost:3000
