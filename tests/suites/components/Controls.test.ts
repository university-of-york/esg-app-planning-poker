import { useState } from "react";
import type { Room } from "../../../types/room";
import { Button } from "./Button.test";
import { resetRoom, revealRoom } from "../../../utils/api";
// @ts-ignore
import styles from "./Controls.module.css";

const Controls = ({ room, refresh }: { room: Room; refresh: () => Promise<void> }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const allChoicesMade = !room.members.find((member) => member.choice === "");

    if (!allChoicesMade && room.state === "HIDDEN") {
        return <></>;
    }

    const handleReveal = () => {
        const reveal = async () => {
            await revealRoom(room.id);
            await refresh();
            setIsSubmitting(false);
        };

        setIsSubmitting(true);
        reveal();
    };

    const handleReset = () => {
        const reset = async () => {
            await resetRoom(room.id);
            await refresh();
            setIsSubmitting(false);
        };

        setIsSubmitting(true);
        reset();
    };

    return (
        <div className={styles.container}>
            {room.state === "HIDDEN" ? (
                <Button className={styles.reveal} isSubmitting={isSubmitting} onClick={handleReveal}>
                    Reveal result
                </Button>
            ) : (
                <Button className={styles.reset} isSubmitting={isSubmitting} onClick={handleReset}>
                    Reset table
                </Button>
            )}
        </div>
    );
};

export { Controls };
