import type { Room } from "../../../types/room";
// @ts-ignore
import styles from "./Results.module.css";
import { ESTIMATION_SCHEMES } from "../../../constants/estimates";

const Results = ({ room }: { room: Room }) => {
    if (room.state === "HIDDEN") {
        return <></>;
    }

    const membersWithChoicesMade = room.members.filter((member) => member.choice !== "");

    if (!membersWithChoicesMade || membersWithChoicesMade.length === 0) {
        return <></>;
    }

    const options = ESTIMATION_SCHEMES[room.estimation].options;

    let votes = options.map((option) => {
        const numberVotes = membersWithChoicesMade.filter((member) => member.choice === option).length;

        return {
            option,
            votes: numberVotes,
        };
    });

    votes = votes.filter((it) => it.votes > 0);
    votes.sort((a, b) => b.votes - a.votes);

    const winningVote = votes[0];
    const winningPercentage = Math.floor((winningVote.votes / membersWithChoicesMade.length) * 100);

    const otherVotes = votes.filter((it) => it.option !== winningVote.option);
    const tiedVotes = otherVotes.filter((it) => it.votes === winningVote.votes);
    const isTied = tiedVotes.length > 0;

    let title, result;

    if (isTied) {
        const tiedOptions = tiedVotes.map((vote) => vote.option);

        title = "It's a draw!";
        result = `${winningVote.option} ${tiedOptions.join(" ")}`;
    } else {
        title = "We have a winner!";
        result = winningVote.option;
    }

    return (
        <div className={`${styles.container} ${isTied ? styles.tied : ""}`}>
            <h2 className={styles.title}>{title}</h2>
            <span className={styles.result}>{result}</span>
            <span className={styles.votes}>
                with <strong>{winningPercentage}%</strong> of the vote{isTied ? " each" : ""}
            </span>
        </div>
    );
};

export { Results };
