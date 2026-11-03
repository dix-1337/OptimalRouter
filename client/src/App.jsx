import { useEffect, useState } from 'react';
import RouteCard from './components/RouteCard.jsx';
import RouteForm from './components/RouteForm.jsx';
import './App.css';

const STORAGE_KEY = 'optimal-router-routes';

const EXAMPLE_ROUTES = [
  {
    id: 'example-1',
    origin: 'Площадь Независимости, Минск',
    destination: 'Национальная библиотека, Минск',
    distanceKm: 7.4,
    durationMin: 22,
    traffic: 'medium',
    trafficDelayMin: 5,
  },
  {
    id: 'example-2',
    origin: 'Минск-Арена, Минск',
    destination: 'Железнодорожный вокзал, Минск',
    distanceKm: 9.8,
    durationMin: 25,
    traffic: 'low',
    trafficDelayMin: 0,
  },
  {
    id: 'example-3',
    origin: 'Парк Челюскинцев, Минск',
    destination: 'Аэропорт Минск',
    distanceKm: 42.6,
    durationMin: 48,
    traffic: 'high',
    trafficDelayMin: 14,
  },
];

function getRouteWord(count) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'маршрутов';
  if (lastDigit === 1) return 'маршрут';
  if (lastDigit >= 2 && lastDigit <= 4) return 'маршрута';
  return 'маршрутов';
}

function App() {
  const [routes, setRoutes] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [trafficFilter, setTrafficFilter] = useState('all');
  const [editingRouteId, setEditingRouteId] = useState(null);

  useEffect(() => {
    let initialRoutes = EXAMPLE_ROUTES;

    try {
      const savedRoutes = window.localStorage.getItem(STORAGE_KEY);

      if (savedRoutes !== null) {
        const parsedRoutes = JSON.parse(savedRoutes);
        if (Array.isArray(parsedRoutes)) {
          initialRoutes = parsedRoutes;
        }
      }
    } catch {
      setStorageError('Не удалось прочитать сохранённые данные. Загружены примеры маршрутов.');
    }

    setRoutes(initialRoutes);
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
      setStorageError('');
    } catch {
      setStorageError('Не удалось сохранить данные в localStorage браузера.');
    }
  }, [routes, storageReady]);

  useEffect(() => {
    document.title = `Маршруты (${routes.length})`;
  }, [routes.length]);

  const editingRoute = routes.find((route) => route.id === editingRouteId) ?? null;
  const totalDistanceKm = routes.reduce(
    (total, route) => total + (Number(route.distanceKm) || 0),
    0,
  );
  const normalizedSearch = searchText.trim().toLocaleLowerCase('ru-RU');
  const visibleRoutes = routes.filter((route) => {
    const matchesSearch = [route.origin, route.destination].some((place) =>
      place.toLocaleLowerCase('ru-RU').includes(normalizedSearch),
    );
    const matchesTraffic = trafficFilter === 'all' || route.traffic === trafficFilter;

    return matchesSearch && matchesTraffic;
  });

  function saveRoute(routeData) {
    if (editingRouteId !== null) {
      setRoutes((currentRoutes) =>
        currentRoutes.map((route) =>
          route.id === editingRouteId ? { ...route, ...routeData } : route,
        ),
      );
      setEditingRouteId(null);
      return;
    }

    setRoutes((currentRoutes) => [
      { id: crypto.randomUUID(), ...routeData },
      ...currentRoutes,
    ]);
  }

  function deleteRoute(routeId) {
    setRoutes((currentRoutes) => currentRoutes.filter((route) => route.id !== routeId));

    if (routeId === editingRouteId) {
      setEditingRouteId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Маршруты — на главную">
            <span className="brand-mark" aria-hidden="true">↗</span>
            <span>Маршруты</span>
          </a>
          <span className="header-caption">Лабораторная работа 4 · React</span>
        </div>
      </header>

      <main className="page-content" id="top">
        <section className="hero-panel" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Личный список поездок</p>
            <h1 id="page-title">Планируйте маршрут заранее</h1>
            <p className="hero-description">
              Добавляйте поездки, следите за уровнем пробок и сохраняйте список в этом браузере.
            </p>
          </div>
          <div className="hero-count" aria-live="polite">
            <span className="hero-count__number">{routes.length}</span>
            <span>{getRouteWord(routes.length)} в списке</span>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <span className="map-line map-line--one" />
            <span className="map-line map-line--two" />
            <span className="map-pin map-pin--one" />
            <span className="map-pin map-pin--two" />
          </div>
        </section>
    
        <div className="workspace-grid">
          <aside className="form-panel" aria-labelledby="form-title">
            <div className="section-heading">
              <p className="eyebrow">Новый маршрут</p>
              <h2 id="form-title">{editingRoute ? 'Изменить маршрут' : 'Добавить маршрут'}</h2>
            </div>
            <RouteForm
              key={editingRoute?.id ?? 'new-route'}
              initialRoute={editingRoute}
              onSave={saveRoute}
              onCancel={() => setEditingRouteId(null)}
            />
            <p className="storage-note">
              Данные сохраняются локально в браузере и не отправляются на сервер.
            </p>
          </aside>

          <section className="routes-section" aria-labelledby="routes-title">
            <div className="routes-heading">
              <div className="section-heading">
                <p className="eyebrow">Ваши поездки</p>
                <h2 id="routes-title">Сохранённые маршруты</h2>
                <p className="route-stat">
                  Общая длина: <strong>{totalDistanceKm.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} км</strong>
                </p>
              </div>
              <span className="route-count">{visibleRoutes.length} из {routes.length}</span>
            </div>

            <div className="filters" aria-label="Поиск и фильтрация маршрутов">
              <label className="search-field">
                <span className="visually-hidden">Поиск по начальной и конечной точке</span>
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Найти точку маршрута"
                />
              </label>
              <label className="filter-field">
                <span className="visually-hidden">Фильтр по уровню пробок</span>
                <select
                  value={trafficFilter}
                  onChange={(event) => setTrafficFilter(event.target.value)}
                >
                  <option value="all">Все пробки</option>
                  <option value="low">Свободно</option>
                  <option value="medium">Умеренно</option>
                  <option value="high">Плотно</option>
                </select>
              </label>
            </div>

            {storageError && <p className="storage-error" role="status">{storageError}</p>}

            {!storageReady ? (
              <div className="empty-state" role="status">Загружаем маршруты…</div>
            ) : visibleRoutes.length > 0 ? (
              <div className="route-list" aria-live="polite">
                {visibleRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onEdit={() => setEditingRouteId(route.id)}
                    onDelete={() => deleteRoute(route.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon" aria-hidden="true">⌖</span>
                <h3>{routes.length === 0 ? 'Список пока пуст' : 'Маршруты не найдены'}</h3>
                <p>
                  {routes.length === 0
                    ? 'Добавьте первый маршрут с помощью формы.'
                    : 'Измените поисковый запрос или выберите другой уровень пробок.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <p>Учебный интерфейс управления маршрутами</p>
        <span>React · useState · useEffect · localStorage</span>
      </footer>
    </div>
  );
}

export default App;
