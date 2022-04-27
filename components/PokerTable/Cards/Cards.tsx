import { useState } from "react";
import type { Room } from "../../../types/room";
import { submitChoice } from "../../../utils/api";
import { getUser } from "../../../utils/session";
import { Spinner } from "../../Spinner/Spinner";
import { ESTIMATION_SCHEMES } from "../../../constants/estimates";
// @ts-ignore
import styles from "./Cards.module.css";

const Cards = ({ room, refresh }: { room: Room; refresh: () => Promise<void> }) => {
    const [submittingChoice, setSubmittingChoice] = useState<string>();

    const user = getUser(room);

    const handleChoice = (choice: string) => {
        const submit = async () => {
            setSubmittingChoice(choice);
            await submitChoice(room.id, user!.id, choice);
            await refresh();
            setSubmittingChoice(undefined);
        };

        submit();
    };

    const options = ESTIMATION_SCHEMES[room.estimation].options;

    const isDisabled = room.state === "REVEALED";
    const isNumerical = room.estimation !== "T-SHIRT";

    return (
        <div className={`${styles.container} ${isDisabled ? styles.disabled : ""}`}>
            {options.map((option) => (
                <div
                    className={`${styles.card} ${option === user!.choice ? styles.selected : ""} ${
                        submittingChoice === option ? styles.submitting : ""
                    } ${isNumerical ? styles.numerical : ""}`}
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
