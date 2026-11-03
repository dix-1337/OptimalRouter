import { useState } from 'react';

const EMPTY_FORM = {
  origin: '',
  destination: '',
  distanceKm: '',
  durationMin: '',
  traffic: 'low',
  trafficDelayMin: '',
};

function RouteForm({ initialRoute, onSave, onCancel }) {
  const [validationError, setValidationError] = useState('');
  const [form, setForm] = useState(() =>
    initialRoute
      ? {
          origin: initialRoute.origin,
          destination: initialRoute.destination,
          distanceKm: String(initialRoute.distanceKm),
          durationMin: String(initialRoute.durationMin),
          traffic: initialRoute.traffic,
          trafficDelayMin: String(initialRoute.trafficDelayMin),
        }
      : EMPTY_FORM,
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setValidationError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const origin = form.origin.trim();
    const destination = form.destination.trim();

    if (!origin || !destination) {
      setValidationError('Введите начальную и конечную точки маршрута.');
      return;
    }

    onSave({
      origin,
      destination,
      distanceKm: Number(form.distanceKm),
      durationMin: Number(form.durationMin),
      traffic: form.traffic,
      trafficDelayMin: Number(form.trafficDelayMin),
    });
  }

  return (
    <form className="route-form" onSubmit={handleSubmit}>
      <label className="form-field form-field--wide">
        <span>Откуда</span>
        <input
          name="origin"
          type="text"
          value={form.origin}
          onChange={handleChange}
          placeholder="Например, площадь Победы"
          autoComplete="street-address"
          required
        />
      </label>

      <label className="form-field form-field--wide">
        <span>Куда</span>
        <input
          name="destination"
          type="text"
          value={form.destination}
          onChange={handleChange}
          placeholder="Например, железнодорожный вокзал"
          required
        />
      </label>

      <label className="form-field">
        <span>Расстояние, км</span>
        <input
          name="distanceKm"
          type="number"
          min="0"
          step="0.1"
          value={form.distanceKm}
          onChange={handleChange}
          placeholder="0"
          required
        />
      </label>

      <label className="form-field">
        <span>Время в пути, мин</span>
        <input
          name="durationMin"
          type="number"
          min="0"
          step="1"
          value={form.durationMin}
          onChange={handleChange}
          placeholder="0"
          required
        />
      </label>

      <label className="form-field">
        <span>Уровень пробок</span>
        <select name="traffic" value={form.traffic} onChange={handleChange}>
          <option value="low">Свободно</option>
          <option value="medium">Умеренно</option>
          <option value="high">Плотно</option>
        </select>
      </label>

      <label className="form-field">
        <span>Задержка, мин</span>
        <input
          name="trafficDelayMin"
          type="number"
          min="0"
          step="1"
          value={form.trafficDelayMin}
          onChange={handleChange}
          placeholder="0"
          required
        />
      </label>

      {validationError && (
        <p className="form-error form-field--wide" role="alert">{validationError}</p>
      )}

      <div className="form-actions form-field--wide">
        <button className="button button--primary" type="submit">
          {initialRoute ? 'Сохранить изменения' : 'Добавить маршрут'}
        </button>
        {initialRoute && (
          <button className="button button--quiet" type="button" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}

export default RouteForm;
