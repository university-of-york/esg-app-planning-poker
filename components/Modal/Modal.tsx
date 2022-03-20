import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
import styles from "./Modal.module.css";

const Modal = ({
    open,
    trigger,
    children,
    className,
    callback,
    onClose,
}: {
    open?: boolean;
    trigger?: any;
    children: any;
    className?: string;
    callback?: () => void | Promise<void>;
    onClose?: () => void | Promise<void>;
}) => {
    const [_open, setIsOpen] = useState(false);

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

    const isOpen = open || _open;

    return (
        <div className={styles.container}>
            {_trigger}

            <div className={`${styles.overlay} ${isOpen ? "" : styles.hidden}`} onClick={() => setIsOpen(false)} />

            <div
                className={`${styles.content} ${isOpen ? "" : styles.hidden}`}
                onClick={(event) => event.preventDefault()}
            >
                {children}
                <ModalControls callback={callback} closeFunc={() => setIsOpen(false)} />
            </div>
        </div>
    );
};

const ModalControls = ({ callback, closeFunc }: { callback: (() => void) | undefined; closeFunc: () => void }) => {
    return (
        <div className={styles.controls}>
            <div className={styles.left}>
                <Button className={styles.control} onClick={callback}>
                    <FontAwesomeIcon className={styles.icon} icon={faCheck} />
                    Confirm
                </Button>
            </div>
            <div className={styles.right}>
                <Button className={styles.control} onClick={closeFunc}>
                    <FontAwesomeIcon className={styles.icon} icon={faXmark} />
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export { Modal };
