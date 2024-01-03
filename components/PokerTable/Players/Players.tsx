import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHourglass, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { Room } from "../../../types/room";
import { getHost, getUser, userIsHost } from "../../../utils/session";
import { kickMember } from "../../../utils/api";
// @ts-ignore
import styles from "./Players.module.css";

const Players = ({ room, refresh }: { room: Room; refresh: () => Promise<void> }) => {
    const user = getUser(room);
    const host = getHost(room);

    const handleKickPlayer = async (memberId: string) => {
        await kickMember(room.id, memberId);

        await refresh();
    };

    const players = room.members?.map((member) => {
        let choice;

        if (room.state === "REVEALED") {
            choice = <span className={`${styles.choice} ${styles.revealed}`}>{member.choice ?? "??"}</span>;
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
                {userIsHost(room) && member.id !== user?.id ? (
                    <FontAwesomeIcon
                        className={styles.kick}
                        icon={faXmark}
                        title={`Kick ${member.displayName}`}
                        onClick={async () => handleKickPlayer(member.id)}
                    />
                ) : (
                    ""
                )}

                <span className={styles.display}>{member.displayName}</span>

                {choice}
            </div>
        );
    });

    return <div className={styles.container}>{players}</div>;
};

export { Players };
