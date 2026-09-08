const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Traffic-aware route service API is running' });
});

// Данные
let routes = [
    { id: 1, origin: 'пл. Победы', destination: 'Аэропорт Минск', distanceKm: 26.4, durationMin: 35, traffic: 'low' },
    { id: 2, origin: 'Вокзал', destination: 'ТЦ Galileo', distanceKm: 3.2, durationMin: 18, traffic: 'high' },
];
let nextId = 3;

// GET /routes — список всех маршрутов
app.get('/routes', (req, res) => res.json(routes));

// GET /routes/:id — один маршрут
app.get('/routes/:id', (req, res) => {
    const route = routes.find((r) => r.id === Number(req.params.id));
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
});

// POST /routes — создание 
app.post('/routes', (req, res) => {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
        return res.status(400).json({ error: 'Поля origin и destination обязательны' });
    }
    const route = {
        id: nextId++,
        origin,
        destination,
        distanceKm: req.body.distanceKm ?? 0,
        durationMin: req.body.durationMin ?? 0,
        traffic: req.body.traffic ?? 'low', // low | medium | high 
    };
    routes.push(route);
    res.status(201).json(route);
});

// PUT /routes/:id — полное обновление
app.put('/routes/:id', (req, res) => {
    const route = routes.find((r) => r.id === Number(req.params.id));
    if (!route) return res.status(404).json({ error: 'Route not found' });
    const { origin, destination } = req.body;
    if (!origin || !destination) {
        return res.status(400).json({ error: 'Поля origin и destination обязательны' });
    }
    Object.assign(route, req.body, { id: route.id }); 
    res.json(route);
});

// DELETE /routes/:id — удаление
app.delete('/routes/:id', (req, res) => {
    const idx = routes.findIndex((r) => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Route not found' });
    const [deleted] = routes.splice(idx, 1);
    res.json(deleted);
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') { 
        return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
    }
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});