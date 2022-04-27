import { useState } from "react";
import type { Member, Room } from "../../../types/room";
import { submitChoice } from "../../../utils/api";
import { TSHIRT_SIZES } from "../../../constants/estimates";
import { Spinner } from "../../Spinner/Spinner";
// @ts-ignore
import styles from "./Cards.module.css";

const Cards = ({ room, player, refresh }: { room: Room; player: Member; refresh: () => Promise<void> }) => {
    const [submittingChoice, setSubmittingChoice] = useState<string>();

    const handleChoice = (choice: string) => {
        const submit = async () => {
            setSubmittingChoice(choice);
            await submitChoice(room.id, player.id, choice);
            await refresh();
            setSubmittingChoice(undefined);
        };

        submit();
    };

    const isDisabled = room.state === "REVEALED";

    return (
        <div className={`${styles.container} ${isDisabled ? styles.disabled : ""}`}>
            {TSHIRT_SIZES.map((option) => (
                <div
                    className={`${styles.card} ${option === player.choice ? styles.selected : ""} ${
                        submittingChoice === option ? styles.submitting : ""
                    }`}
                    key={option}
                    onClick={isDisabled ? undefined : () => handleChoice(option)}
                >
                    {submittingChoice === option ? (
                        <Spinner className={styles.spinner} />
                    ) : (
                        <span className={styles.option}>{option}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export { Cards };
