import Link from "next/link";
import styles from "./Button.module.css";

declare type ButtonProps = {
    className?: string;
    children: any;
    link?: string;
    onClick?: () => void;
    isSubmitting?: boolean;
};

const Button = ({ className, children, link, onClick, isSubmitting = false }: ButtonProps) => {
    const button = (
        <button
            className={`${styles.button} ${className ? className : ""} ${isSubmitting ? styles.submitting : ""}`}
            onClick={!isSubmitting ? onClick : undefined}
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
