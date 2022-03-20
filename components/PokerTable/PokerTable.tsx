import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHourglass } from "@fortawesome/free-solid-svg-icons";
import {Room, Member} from "../../types/room";
import {submitChoice} from "../../utils/api";
import {Button} from "../Button/Button";
import {BASE_URL} from "../../utils/environment";
// @ts-ignore
import styles from "./PokerTable.module.css";

const options = ["XS", "S", "M", "L", "XL"];

const PokerTable = ({room, currentPlayer, refresh}: {room: Room, currentPlayer?: Member, refresh: () => Promise<void>}) => {

    const handleChoice = (choice: string) => {
        if (!currentPlayer) {
            return;
        }

        const submit = async () => {
            await submitChoice(room.id, currentPlayer.id, choice);
            await refresh();
        }

        submit();
    }

    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <span className={styles.memberCount}>{room.members.length} people</span>
            </div>

            <Button
                className={styles.invite}
                onClick={() => {navigator.clipboard.writeText(`https://${window.location.host}/table/${room.id}`)}}
            >
                Copy invite link
            </Button>

            <div className={styles.players}>
                {room.members?.map((member) => {
                    let choice;

                    if (room.state === "REVEALED") {
                        choice = <span className={styles.choice}>{member.choice}</span>
                    } else {
                        if (member.choice === "") {
                            choice = <FontAwesomeIcon className={`${styles.choice} ${styles.icon}`} icon={faHourglass}/>;
                        } else {
                            choice = <FontAwesomeIcon className={`${styles.choice} ${styles.icon}`} icon={faCheck}/>;
                        }
                    }

                    return (
                        <div
                            className={`${styles.player} ${room.hostId === member.id ? styles.host : ''} ${currentPlayer?.id === member.id ? styles.current : ''}`}
                            key={member.id}
                        >
                            <span className={styles.display}>{member.displayName}</span>

                            {choice}
                        </div>
                    );
                })}
            </div>

            <div className={styles.hand}>
                {options.map((option) =>
                    <div
                        className={`${styles.card} ${option === currentPlayer?.choice ? styles.selected : ''}`}
                        key={option}
                        onClick={() => handleChoice(option)}
                    >
                        <span>{option}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export { PokerTable };
