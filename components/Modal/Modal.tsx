import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {Button} from "../Button/Button";
import styles from "./Modal.module.css";

const Modal = (
    {
        trigger,
        children,
        className,
        callback,
    }: {
        trigger: any;
        children: any;
        className?: string;
        callback?: (() => {});
    }) => {
    const [isOpen, setIsOpen] = useState(false);

    const _trigger = React.cloneElement(trigger, {
        className: className,
        onClick: () => setIsOpen(true),
    });

    return (
        <div className={styles.container}>
            {_trigger}

            <div className={`${styles.overlay} ${isOpen ? "" : styles.hidden}`} onClick={() => setIsOpen(false)} />

            <div
                className={`${styles.content} ${isOpen ? "" : styles.hidden}`}
                onClick={(event) => event.preventDefault()}
            >
                {children}
                <ModalControls
                    callback={callback}
                    closeFunc={() => setIsOpen(false)}
                />
            </div>
        </div>
    );
};

const ModalControls = ({
    callback,
    closeFunc,
}: {
    callback: (() => {}) | undefined;
    closeFunc: () => void;
}) => {
    return (
        <div className={styles.controls}>
            <div className={styles.left}>
                <Button className={styles.control} onClick={callback}>
                    <FontAwesomeIcon className={styles.icon} icon={faCheck}/>
                    Confirm
                </Button>
            </div>
            <div className={styles.right}>
                <Button className={styles.control} onClick={closeFunc}>
                    <FontAwesomeIcon className={styles.icon} icon={faXmark}/>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export { Modal };
