import {useState} from "react";
import {Member, Room} from "../../../types/room";
import {submitChoice} from "../../../utils/api";
import {TSHIRT_SIZES} from "../../../constants/cards";
// @ts-ignore
import styles from "./Cards.module.css";

const Cards = ({room, player, refresh}: {room: Room; player: Member; refresh: () => Promise<void>;}) => {
    const [isSubmittingChoice, setIsSubmittingChoice] = useState<boolean>(false);

    const handleChoice = (choice: string) => {
        const submit = async () => {
            setIsSubmittingChoice(true);
            await submitChoice(room.id, player.id, choice);
            await refresh();
            setIsSubmittingChoice(false);
        }

        submit();
    }

    return (
        <div className={styles.container}>
            {TSHIRT_SIZES.map((option) =>
                <div
                    className={`${styles.card} ${option === player.choice ? styles.selected : ''}`}
                    key={option}
                    onClick={() => handleChoice(option)}
                >
                    <span>{option}</span>
                </div>
            )}
        </div>
    );
};

export { Cards };
