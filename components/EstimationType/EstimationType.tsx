import React, {useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import type { Room } from "../../types/room";
import { userIsHost } from "../../utils/session";
import { switchEstimation } from "../../utils/api";
import { ESTIMATION_SCHEMES } from "../../constants/estimates";
// @ts-ignore
import styles from "./EstimationType.module.css";

const EstimationType = ({ room, refresh }: { room: Room; refresh: () => Promise<void> }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            if (room.state === "REVEALED") {
                setIsOpen(false);
            }
        };
    }, [room]);

    if (!userIsHost(room)) {
        return <></>;
    }

    const handleSelect = async (scheme: string) => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        await switchEstimation(room.id, scheme);

        await refresh();

        setIsSubmitting(false);
    };

    const remainingOptions = Object.keys(ESTIMATION_SCHEMES).filter((option) => option !== room.estimation);

    const options = remainingOptions.map((scheme) => (
        <div className={styles.option} key={scheme} onClick={async () => handleSelect(scheme)}>
            {ESTIMATION_SCHEMES[scheme].display}
        </div>
    ));

    const roomRevealed = room.state === "REVEALED";

    return (
        <div className={`${styles.container} ${isOpen ? styles.open : ""} ${isSubmitting ? styles.submitting : ""}`}>
            <div className={`${styles.selected} ${roomRevealed ? styles.disabled : ''}`} onClick={roomRevealed ? undefined : () => setIsOpen(!isOpen)}>
                <div className={styles.display}>{ESTIMATION_SCHEMES[room.estimation].display}</div>
                <FontAwesomeIcon className={styles.caret} icon={faCaretDown} />
            </div>
            <div className={styles.options}>{options}</div>
        </div>
    );
};

export { EstimationType };
