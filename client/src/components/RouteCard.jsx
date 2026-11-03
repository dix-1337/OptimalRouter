const trafficLabels = {
  low: 'Свободно',
  medium: 'Умеренно',
  high: 'Плотно',
};

const distanceFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 1,
});

function RouteCard({ route, onEdit, onDelete }) {
  const trafficLabel = trafficLabels[route.traffic] ?? 'Не указано';

  return (
    <article className="route-card">
      <div className="route-card__main">
        <div className="route-card__points">
          <div className="route-point">
            <span className="route-point__marker route-point__marker--start" aria-hidden="true" />
            <span className="route-point__label">Начало</span>
            <strong>{route.origin}</strong>
          </div>
          <span className="route-point__connector" aria-hidden="true" />
          <div className="route-point">
            <span className="route-point__marker route-point__marker--finish" aria-hidden="true" />
            <span className="route-point__label">Назначение</span>
            <strong>{route.destination}</strong>
          </div>
        </div>

        <div className="route-card__details">
          <div className="route-detail">
            <span className="detail-icon" aria-hidden="true">↔</span>
            <span><strong>{distanceFormatter.format(Number(route.distanceKm))}</strong> км</span>
          </div>
          <div className="route-detail">
            <span className="detail-icon" aria-hidden="true">◷</span>
            <span><strong>{route.durationMin}</strong> мин</span>
          </div>
          <div className="route-detail">
            <span className={`traffic-indicator traffic-indicator--${route.traffic}`} aria-hidden="true" />
            <span>{trafficLabel}</span>
          </div>
          <div className="route-detail">
            <span className="detail-icon" aria-hidden="true">＋</span>
            <span>Задержка <strong>{route.trafficDelayMin}</strong> мин</span>
          </div>
        </div>
      </div>

      <div className="route-card__actions">
        <button className="button button--quiet" type="button" onClick={onEdit}>
          Изменить
        </button>
        <button className="button button--delete" type="button" onClick={onDelete}>
          Удалить
        </button>
      </div>
    </article>
  );
}

export default RouteCard;
