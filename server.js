require('dotenv').config();

const express = require('express');
const path = require('path');
const requestLogger = require('./middleware/requestLogger');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const { sequelize } = require('./models');

const routeRoutes = require('./routes/routeRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const pageRoutes = require('./routes/pageRoutes');

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);



app.use('/routes', routeRoutes);
app.use('/', pageRoutes);

function isApiRequest(req) {
  return ['/auth', '/profile', '/routes'].some((prefix) =>
    req.path === prefix || req.path.startsWith(`${prefix}/`)
  );
}

app.use((req, res) => {
  if (isApiRequest(req)) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(404).render('404', {
    title: 'Страница не найдена',
    user: req.user || { name: 'Гость', role: 'guest' },
    authQuery: req.query.auth === '1' ? '?auth=1' : '',
  });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Некорректный JSON в теле запроса',
    });
  }

  console.error(err);

  const status = err.status || 500;

  if (isApiRequest(req)) {
    return res.status(status).json({
      error: err.message || 'Internal Server Error',
    });
  }

  res.status(status).render('500', {
    title: 'Ошибка сервера',
    user: req.user || { name: 'Гость', role: 'guest' },
    authQuery: req.query.auth === '1' ? '?auth=1' : '',
  });
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