import React, {useState} from "react";
import {Modal} from "../Modal/Modal";
import {setTicket} from "../../utils/api";
import type {Room} from "../../types/room";
import type {Session} from "../../types/session";
// @ts-ignore
import styles from "./NowEstimating.module.css";

const NowEstimating = ({ room, session }: { room: Room, session: Session }) => {
    const [ticketId, setTicketId] = useState<string>(room.ticketId);
    const [isJira, setIsJira] = useState<boolean>(true);

    const host = room.members.find((member) => member.id === room.hostId);
    const player = room.members.find((member) => member.id === session.id);

    const playerIsHost = host!.id === player!.id;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTicketId(event.target.value);
    };

    const handleSubmit = async () => {
        await setTicket(room.id, ticketId);
    };

    if (playerIsHost) {
        const text = room.ticketId ? `Now estimating: ${room.ticketId}` : "What are you estimating?";
        return (
            <Modal className={styles.modal} trigger={<span className={`${styles.ticket} ${room.ticketId ? '' : styles.blank} ${styles.editable}`}>{text}</span>} callback={handleSubmit}>
                <div className={styles.id}>
                    <label>Ticket ID</label>
                    <input type="text" value={ticketId} onChange={handleChange}/>
                </div>
                <div className={styles.jira}>
                    <input type="checkbox" checked={isJira} onChange={() => setIsJira(!isJira)}/>
                    <label>This is a JIRA ticket</label>
                </div>
            </Modal>
        );
    } else {
        if (room.ticketId) {
            const display = <span className={styles.ticket}>Now estimating: {room.ticketId}</span>;

            return isJira ? <a href={`https://jira.york.ac.uk/browse/${room.ticketId}`} target="_blank" rel="noopener noreferrer">{display}</a> : display;
        } else {
            return <></>;
        }
    }
};

export {NowEstimating};
