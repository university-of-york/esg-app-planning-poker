import React, { useState } from "react";
import { Modal } from "../Modal/Modal";
import { setTicket } from "../../utils/api";
import { userIsHost } from "../../utils/session";
import type { Room } from "../../types/room";
// @ts-ignore
import styles from "./NowEstimating.module.css";

const NowEstimating = ({ room }: { readonly room: Room }) => {
    const [ticketId, setTicketId] = useState<string>(room.ticketId);
    const [isJira, setIsJira] = useState<boolean>(room.jiraTicket);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTicketId(event.target.value);
    };

    const handleSubmit = async () => {
        await setTicket(room.id, ticketId, isJira);
    };

    if (userIsHost(room)) {
        const text = room.ticketId ? `Now estimating: ${room.ticketId}` : "What are you estimating?";
        return (
            <Modal
                className={styles.modal}
                trigger={
                    <span
                        className={`${styles.ticket} ${room.ticketId ? "" : styles.blank} ${styles.editable} ${
                            room.jiraTicket ? styles.linked : ""
                        }`}
                    >
                        {text}
                    </span>
                }
                callback={handleSubmit}
            >
                <div className={styles.id}>
                    <label>Ticket ID</label>
                    <input type="text" value={ticketId} onChange={handleChange} />
                </div>
                <div className={`${styles.jira} ${isJira ? styles.checked : ""}`} onClick={() => setIsJira(!isJira)}>
                    <input type="checkbox" checked={isJira} />
                    <label>This is a JIRA ticket</label>
                </div>
            </Modal>
        );
    } else if (room.ticketId) {
        const display = (
            <span className={`${styles.ticket} ${room.jiraTicket ? styles.linked : ""}`}>
                Now estimating: <strong>{room.ticketId}</strong>
            </span>
        );

        return room.jiraTicket ? (
            <a
                className={styles.link}
                href={`https://uoy.atlassian.net/browse/${room.ticketId}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {display}
            </a>
        ) : (
            display
        );
    }
};

export { NowEstimating };
