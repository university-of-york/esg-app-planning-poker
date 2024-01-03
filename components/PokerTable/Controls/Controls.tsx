import { useState } from "react";
import type { Room } from "../../../types/room";
import { Button } from "../../Button/Button";
import { resetRoom, revealRoom } from "../../../utils/api";
// @ts-ignore
import styles from "./Controls.module.css";

const Controls = ({ room, refresh }: { readonly room: Room; readonly refresh: () => Promise<void> }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const allChoicesMade = !room.members.find((member) => member.choice === "");

    if (!allChoicesMade && room.state === "HIDDEN") {
        return null;
    }

    const handleReveal = () => {
        const reveal = async () => {
            await revealRoom(room.id);
            await refresh();

            // 1 second delay before button is re-enabled to prevent user double-clicking without seeing the button change
            setTimeout(() => setIsSubmitting(false), 1000);
        };

        setIsSubmitting(true);
        reveal();
    };

    const handleReset = () => {
        const reset = async () => {
            await resetRoom(room.id);
            await refresh();

            // 1 second delay before button is re-enabled to prevent user double-clicking without seeing the button change
            setTimeout(() => setIsSubmitting(false), 1000);
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
