import Image from "next/image";
// @ts-ignore
import spinner from "../../public/static/assets/loading.svg";
// @ts-ignore
import styles from "./Spinner.module.css";

const Spinner = ({className}: {className?: string;}) => {
  return (
      <div className={`${styles.container} ${className ? className : ''}`}>
          <img className={styles.spinner} src={spinner.src} alt="Loading" />
      </div>
  );
};

export { Spinner };
