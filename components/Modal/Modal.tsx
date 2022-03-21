import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
import styles from "./Modal.module.css";

const Modal = ({
    open,
    mandatory = false,
    trigger,
    children,
    className,
    callback,
    onClose,
}: {
    open?: boolean;
    mandatory?: boolean;
    trigger?: any;
    children: any;
    className?: string;
    callback?: () => void | Promise<void>;
    onClose?: () => void | Promise<void>;
}) => {
    const [_open, setIsOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const _trigger = trigger
        ? React.cloneElement(trigger, {
              className: className,
              onClick: () => setIsOpen(true),
          })
        : "";

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
        <div className={styles.container}>
            {_trigger}

            <div className={`${styles.overlay} ${isOpen ? "" : styles.hidden}`} onClick={close} />

            <div
                className={`${styles.content} ${isOpen ? "" : styles.hidden}`}
                onClick={(event) => event.preventDefault()}
            >
                {children}
                <ModalControls confirm={confirm} close={close} isMandatory={mandatory} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
};

const ModalControls = ({ confirm, close, isMandatory, isSubmitting }: { confirm: () => void; close: () => void; isMandatory: boolean; isSubmitting: boolean }) => {
    return isMandatory ? (
        <div className={`${styles.controls} ${styles.single}`}>
            <Button className={styles.control} isSubmitting={isSubmitting} onClick={confirm}>
                <FontAwesomeIcon className={styles.icon} icon={faCheck} />
                Confirm
            </Button>
        </div>
    ) : (
        <div className={styles.controls}>
            <Button className={styles.control} isSubmitting={isSubmitting} onClick={confirm}>
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
