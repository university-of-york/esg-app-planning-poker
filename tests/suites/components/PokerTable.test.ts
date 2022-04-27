import type { Room } from "../../types/room";
import type { Session } from "../../types/session";
import { Controls } from "./Controls/Controls";
import { Results } from "./Results/Results";
import { Players } from "./Players/Players";
import { Cards } from "./Cards/Cards";
// @ts-ignore
import styles from "./PokerTable.module.css";

const PokerTable = ({ room, session, refresh }: { room: Room; session: Session; refresh: () => Promise<void> }) => {
    const host = room.members.find((member) => member.id === room.hostId);
    const player = room.members.find((member) => member.id === session.id);

    return (
        <div className={styles.container}>
            {player!.id === host?.id ? <Controls room={room} refresh={refresh} /> : undefined}

            <Results room={room} />
            <Players state={room.state} host={host} player={player} members={room.members} />
            <Cards room={room} player={player!} refresh={refresh} />
        </div>
    );
};

export { PokerTable };
