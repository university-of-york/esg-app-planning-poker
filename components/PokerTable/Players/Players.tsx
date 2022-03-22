import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faHourglass} from "@fortawesome/free-solid-svg-icons";
import {Member} from "../../../types/room";
// @ts-ignore
import styles from "./Players.module.css";

const Players = (
    {
        state,
        host,
        player,
        members
    }: {
        state: "HIDDEN" | "REVEALED";
        host?: Member;
        player?: Member;
        members: Member[];
    }) => {
    const players = members?.map((member) => {
        let choice;

        if (state === "REVEALED") {
            choice = <span className={`${styles.choice} ${styles.revealed}`}>{member.choice ? member.choice : '??'}</span>
        } else {
            if (member.choice === "") {
                choice = <FontAwesomeIcon className={`${styles.choice} ${styles.icon}`} icon={faHourglass}/>;
            } else {
                choice = <FontAwesomeIcon className={`${styles.choice} ${styles.icon}`} icon={faCheck}/>;
            }
        }

        return (
            <div
                className={`${styles.player} ${host?.id === member.id ? styles.host : ''} ${player?.id === member.id ? styles.current : ''}`}
                key={member.id}
            >
                <span className={styles.display}>{member.displayName}</span>

                {choice}
            </div>
        );
    });

    return (
        <div className={styles.container}>
            {players}
        </div>
    );
};

export {Players};
