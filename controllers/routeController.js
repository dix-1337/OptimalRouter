const routeModel = require('../models/routeModel');

function getAll(req, res) {
  res.json(routeModel.findAll());
}

function getById(req, res) {
  const route = routeModel.findById(Number(req.params.id));
  if (!route) return res.status(404).json({ error: 'Route not found' });
  res.json(route);
}

function create(req, res) {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Поля origin и destination обязательны' });
  }
  const route = routeModel.create(req.body);
  res.status(201).json(route);
}

function update(req, res) {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Поля origin и destination обязательны' });
  }
  const route = routeModel.update(Number(req.params.id), req.body);
  if (!route) return res.status(404).json({ error: 'Route not found' });
  res.json(route);
}

function remove(req, res) {
  const deleted = routeModel.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Route not found' });
  res.json(deleted);
}

module.exports = { getAll, getById, create, update, remove };