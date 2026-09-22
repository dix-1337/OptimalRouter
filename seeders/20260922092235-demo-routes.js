'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Routes', [
      {
        origin: 'пл. Победы',
        destination: 'Аэропорт Минск',
        distanceKm: 26.4,
        durationMin: 35,
        traffic: 'low',
        trafficDelayMin: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        origin: 'Вокзал',
        destination: 'ТЦ Galileo',
        distanceKm: 3.2,
        durationMin: 18,
        traffic: 'high',
        trafficDelayMin: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Routes', null, {});
  },
};