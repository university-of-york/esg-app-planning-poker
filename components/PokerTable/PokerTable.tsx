import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHourglass } from "@fortawesome/free-solid-svg-icons";
import {Room, Member} from "../../types/room";
import {resetRoom, revealRoom, submitChoice} from "../../utils/api";
import {Button} from "../Button/Button";
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

    const handleReveal = () => {
        if (!currentPlayer) {
            return;
        }

        const reveal = async () => {
            await revealRoom(room.id);
            await refresh();
        }

        reveal();
    }

    const handleReset = () => {
        if (!currentPlayer) {
            return;
        }

        const reset = async () => {
            await resetRoom(room.id);
            await refresh();
        }

        reset();
    }

    const allChoicesMade = !room.members.find((member) => member.choice === "");
    const currentPlayerIsHost = room.hostId === currentPlayer?.id;

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

            {allChoicesMade && currentPlayerIsHost ? room.state === "HIDDEN" ? (
                <Button
                    className={styles.reveal}
                    onClick={handleReveal}
                >
                    Reveal
                </Button>
            ) : (
                <Button
                    className={styles.reset}
                    onClick={handleReset}
                >
                    Reset table
                </Button>
            ) : undefined}

            <div className={styles.players}>
                {room.members?.map((member) => {
                    let choice;

                    if (room.state === "REVEALED") {
                        choice = <span className={`${styles.choice} ${styles.revealed}`}>{member.choice}</span>
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
