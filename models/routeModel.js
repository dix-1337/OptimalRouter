let routes = [
  { id: 1, origin: 'пл. Победы', destination: 'Аэропорт Минск', distanceKm: 26.4, durationMin: 35, traffic: 'low' },
  { id: 2, origin: 'Вокзал', destination: 'ТЦ Galileo', distanceKm: 3.2, durationMin: 18, traffic: 'high' },
];
let nextId = 3;

function findAll() {
  return routes;
}

function findById(id) {
  return routes.find((r) => r.id === id);
}

function create(data) {
  const route = {
    id: nextId++,
    origin: data.origin,
    destination: data.destination,
    distanceKm: data.distanceKm ?? 0,
    durationMin: data.durationMin ?? 0,
    traffic: data.traffic ?? 'low',
  };
  routes.push(route);
  return route;
}

function update(id, data) {
  const route = findById(id);
  if (!route) return null;
  Object.assign(route, data, { id }); 
  return route;
}

function remove(id) {
  const idx = routes.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  return routes.splice(idx, 1)[0];
}

module.exports = { findAll, findById, create, update, remove };