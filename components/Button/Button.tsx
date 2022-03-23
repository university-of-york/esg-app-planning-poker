import Link from "next/link";
import styles from "./Button.module.css";

declare type ButtonProps = {
    className?: string;
    children: any;
    link?: string;
    onClick?: () => void;
    isSubmitting?: boolean;
    isDisabled?: boolean;
};

const Button = ({ className, children, link, onClick, isSubmitting = false, isDisabled = false }: ButtonProps) => {
    const button = (
        <button
            className={`${styles.button} ${className ? className : ""} ${isSubmitting ? styles.submitting : ""} ${
                isDisabled ? styles.disabled : ""
            }`}
            onClick={isDisabled ? undefined : onClick}
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
