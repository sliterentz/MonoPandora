import styles from './theme-ui.module.css';

/* eslint-disable-next-line */
export interface ThemeUiProps {}

export function ThemeUi(props: ThemeUiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ThemeUi!</h1>
    </div>
  );
}

export default ThemeUi;
