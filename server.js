const express = require('express');
const app = express();
const { sequelize } = require('./models');

const routeRoutes = require('./routes/routeRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Traffic-aware route service API is running' });
});

app.use('/routes', routeRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
    }
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = 3000;
sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });