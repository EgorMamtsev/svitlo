import styles from "./ScheduleChart.module.scss";
import scheduleData from "../../../api/cherhi.json";

export const ScheduleChart = () => {
  const { queues } = scheduleData;
  const formattedUpdate = "Оновлено: 06.10.2025 14:32";

  return (
    <div className={styles.chart}>
      <div className={styles.chart__header}>
        <div className={styles.chart__dateWrapper}>
          <div className={styles.chart__date}>
            <span className={styles.chart__icon}>📅</span>
            Сьогодні, 6 жовтня 2025
          </div>
          <div className={styles.chart__updated}>
            <span className={styles.chart__updatedDot}></span>
            {formattedUpdate}
          </div>
        </div>
        <div className={styles.chart__nav}>
          <button className={styles.chart__navButton}>←</button>
          <button className={styles.chart__navButton}>→</button>
        </div>
      </div>

      {/* Сітка графіка */}
      <div className={styles.chart__grid}>
        {/* Порожній кут зліва зверху */}
        <div className={styles.chart__corner}></div>

        {/* Шкала часу (беремо час з першої черги) */}
        <div className={styles.chart__timeScale}>
          {queues[0].schedule.map((slot, index) => (
            <div key={index} className={styles.chart__timeLabel}>
              {slot.time}
            </div>
          ))}
        </div>

        {/* Рядки з чергами */}
        {queues.map((queue) => (
          <div key={queue.id} className={styles.chart__row}>
            {/* Назва черги */}
            <div className={styles.chart__queueName}>
              <span
                className={`${styles.chart__dot} ${queue.id === 1 ? styles.chart__dot_active : ""}`}
              ></span>
              {queue.name}
            </div>

            {/* Комірки зі статусом */}
            <div className={styles.chart__cells}>
              {queue.schedule.map((slot, index) => (
                <div
                  key={index}
                  className={`${styles.chart__cell} ${
                    slot.status === "on"
                      ? styles.chart__cell_green
                      : styles.chart__cell_red
                  }`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
