import styles from "./Info.module.scss";

export const Info = () => {
  return (
    <div className={styles.info}>
      <div className={styles.info__subtitle}> ГРАФІК ВІДКЛЮЧЕНЬ</div>
      <h1 className={styles.info__title}>Полтавська область</h1>
      <p className={styles.info__description}>
        Актуальний графік погодинних відключень електроенергії для вашої області та черги.
      </p>
    </div>
  );
};