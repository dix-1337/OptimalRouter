const { Route } = require('../models');

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getRouteData(body) {
  const data = body || {};

  if (
    typeof data.origin !== 'string' ||
    !data.origin.trim() ||
    typeof data.destination !== 'string' ||
    !data.destination.trim()
  ) {
    return null;
  }

  return {
    origin: data.origin.trim(),
    destination: data.destination.trim(),
    distanceKm: data.distanceKm ?? 0,
    durationMin: data.durationMin ?? 0,
    traffic: data.traffic ?? 'low',
    trafficDelayMin: data.trafficDelayMin ?? 0,
  };
}

async function getAll(req, res, next) {
  try {
    const routes = await Route.findAll({
      order: [['id', 'ASC']],
    });

    res.json(routes);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ error: 'Некорректный ID маршрута' });
    }

    const route = await Route.findByPk(id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = getRouteData(req.body);

    if (!data) {
      return res.status(400).json({
        error: 'Поля origin и destination обязательны',
      });
    }

    const route = await Route.create(data);

    res.status(201).json(route);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ error: 'Некорректный ID маршрута' });
    }

    const data = getRouteData(req.body);

    if (!data) {
      return res.status(400).json({
        error: 'Поля origin и destination обязательны',
      });
    }

    const [updatedCount] = await Route.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const updatedRoute = await Route.findByPk(id);

    res.json(updatedRoute);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ error: 'Некорректный ID маршрута' });
    }

    const route = await Route.findByPk(id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    await Route.destroy({
      where: { id },
    });

    res.json(route);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};