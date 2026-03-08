const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Начальные данные — плюшевые игрушки
let products = [
    { id: nanoid(6), name: 'Плюшевый мишка', category: 'Медведи', description: 'Мягкий мишка с бантиком, 30 см', price: 123, stock: 20 },
    { id: nanoid(6), name: 'Кролик с длинными ушами', category: 'Зайцы', description: 'Серый зайка, 40 см', price: 456, stock: 15 },
    { id: nanoid(6), name: 'Котёнок', category: 'Кошки', description: 'Белый плюшевый котёноки, 25 см', price: 789, stock: 30 },
    { id: nanoid(6), name: 'Дракончик', category: 'Фэнтези', description: 'Зелёный дракон, 35 см', price: 321, stock: 8 },
    { id: nanoid(6), name: 'Обезьянка-балерина', category: 'Зверята', description: 'Обезьянка в юбке, 25 см', price: 654, stock: 25 },
    { id: nanoid(6), name: 'Собачка-батон', category: 'Собаки', description: 'Мягкая подушка-подголовник, 60 см', price: 987, stock: 18 },
    { id: nanoid(6), name: 'Единорог', category: 'Фэнтези', description: 'Белый единорог с цветной гривой, 35 см', price: 135, stock: 12 },
    { id: nanoid(6), name: 'Лисёнок', category: 'Зверята', description: 'Плюшевый лисёнок с пушистым хвостом, 25 см', price: 246, stock: 40 },
    { id: nanoid(6), name: 'Пингвинёнок', category: 'Птицы', description: 'Милый пингвин в шарфе, 20 см', price: 789, stock: 16 },
    { id: nanoid(6), name: 'Слонёнок', category: 'Зверята', description: 'Голубой слонёнок с большими ушами, 30 см', price: 123, stock: 22 }
];

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Swagger настройка
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API магазина плюшевых игрушек',
            version: '1.0.0',
            description: 'API для управления товарами в магазине плюшевых игрушек',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *         stock:
 *           type: integer
 *           description: Количество товара на складе
 *       example:
 *         id: "abc123"
 *         name: "Плюшевый мишка"
 *         category: "Медведи"
 *         description: "Мягкий мишка с бантиком, 30 см"
 *         price: 1250
 *         stock: 20
 */

// Логирование
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для поиска товара
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создание нового товара
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации (не все поля заполнены)
 */
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock } = req.body;

    if (!name || !category || !description || price === undefined || stock === undefined) {
        return res.status(400).json({ error: "Все поля обязательны" });
    }

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;

    if (req.body?.name === undefined && req.body?.category === undefined &&
        req.body?.description === undefined && req.body?.price === undefined &&
        req.body?.stock === undefined) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const { name, category, description, price, stock } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some((p) => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter((p) => p.id !== id);
    res.status(204).send();
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger документация: http://localhost:${port}/api-docs`);
});