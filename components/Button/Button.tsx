/* eslint-disable react/button-has-type */

import Link from "next/link";
// @ts-ignore
import styles from "./Button.module.css";

declare type ButtonProps = {
    readonly className?: string;
    readonly children: any;
    readonly link?: string;
    readonly onClick?: () => void;
    readonly isSubmitting?: boolean;
    readonly isDisabled?: boolean;
};

const Button = ({ className, children, link, onClick, isSubmitting = false, isDisabled = false }: ButtonProps) => {
    const button = (
        <button
            className={`${styles.button} ${className ?? ""} ${isSubmitting ? styles.submitting : ""} ${
                isDisabled ? styles.disabled : ""
            }`}
            onClick={isDisabled ? undefined : onClick}
        >
            {children}
        </button>
    );

    if (link) {
        return (
            <Link passHref href={link}>
                {button}
            </Link>
        );
    } else {
        return button;
    }
};

export { Button };
