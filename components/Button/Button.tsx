import Link from "next/link";
import styles from "./Button.module.css";

declare type ButtonProps = {
    className?: string;
    children: any;
    link?: string;
    onClick?: (() => {}) | (() => void);
}

const Button = ({className, children, link, onClick}: ButtonProps) => {
    const button = (
        <button
            className={`${styles.button} ${className ? className : ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );

    if (link) {
        return (
            <Link href={link} passHref>
                {button}
            </Link>
        );
    } else {
        return button;
    }
};

export { Button };
