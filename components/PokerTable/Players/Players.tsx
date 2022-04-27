import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHourglass } from "@fortawesome/free-solid-svg-icons";
import {getHost, getUser, userIsHost} from "../../../utils/session";
import type {Member, Room} from "../../../types/room";
// @ts-ignore
import styles from "./Players.module.css";

const Players = ({room}: { room: Room }) => {
    const user = getUser(room);
    const host = getHost(room);

    const players = room.members?.map((member) => {
        let choice;

        if (room.state === "REVEALED") {
            choice = (
                <span className={`${styles.choice} ${styles.revealed}`}>{member.choice ? member.choice : "??"}</span>
            );
        } else {
            if (member.choice === "") {
                choice = <FontAwesomeIcon className={`${styles.choice} ${styles.icon}`} icon={faHourglass} />;
            } else {
                choice = <FontAwesomeIcon className={`${styles.choice} ${styles.icon}`} icon={faCheck} />;
            }
        }

        return (
            <div
                className={`${styles.player} ${host?.id === member.id ? styles.host : ""} ${
                    user?.id === member.id ? styles.current : ""
                }`}
                key={member.id}
            >
                <span className={styles.display}>{member.displayName}</span>

                {choice}
            </div>
        );
    });

    return <div className={styles.container}>{players}</div>;
};

export { Players };
