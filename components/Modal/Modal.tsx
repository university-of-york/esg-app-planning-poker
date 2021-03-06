import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
// @ts-ignore
import styles from "./Modal.module.css";

const Modal = ({
    open,
    mandatory = false,
    valid = true,
    trigger,
    children,
    className,
    callback,
    onClose,
}: {
    open?: boolean;
    mandatory?: boolean;
    valid?: boolean;
    trigger?: any;
    children: any;
    className?: string;
    callback?: () => void | Promise<void>;
    onClose?: () => void | Promise<void>;
}) => {
    const [_open, setIsOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    let _trigger;

    if (trigger) {
        _trigger = React.cloneElement(trigger, {
            onClick: () => setIsOpen(true),
        });
    }

    const close = async () => {
        if (onClose) {
            await onClose();
        }

        setIsOpen(false);
    };

    const confirm = async () => {
        setIsSubmitting(true);

        if (callback) {
            await callback();
        }

        setIsSubmitting(false);
        await close();
    };

    const isOpen = open || _open;

    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            {_trigger}

            <div className={`${styles.overlay} ${isOpen ? "" : styles.hidden}`} onClick={close} />

            <div
                className={`${styles.content} ${isOpen ? "" : styles.hidden}`}
                onClick={(event) => event.preventDefault()}
            >
                {children}
                <ModalControls
                    confirm={confirm}
                    close={close}
                    isMandatory={mandatory}
                    isValid={valid}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

const ModalControls = ({
    confirm,
    close,
    isMandatory,
    isValid,
    isSubmitting,
}: {
    confirm: () => void;
    close: () => void;
    isMandatory: boolean;
    isValid: boolean;
    isSubmitting: boolean;
}) => {
    return isMandatory ? (
        <div className={`${styles.controls} ${styles.single}`}>
            <Button className={styles.control} isSubmitting={isSubmitting} isDisabled={!isValid} onClick={confirm}>
                <FontAwesomeIcon className={styles.icon} icon={faCheck} />
                Confirm
            </Button>
        </div>
    ) : (
        <div className={styles.controls}>
            <Button className={styles.control} isSubmitting={isSubmitting} isDisabled={!isValid} onClick={confirm}>
                <FontAwesomeIcon className={styles.icon} icon={faCheck} />
                Confirm
            </Button>
            <Button className={styles.control} onClick={close}>
                <FontAwesomeIcon className={styles.icon} icon={faXmark} />
                Cancel
            </Button>
        </div>
    );
};

export { Modal };
