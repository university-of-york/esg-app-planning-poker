import { userIsHost } from "../../utils/session";
import type { Room } from "../../types/room";
import { Controls } from "./Controls/Controls";
import { Results } from "./Results/Results";
import { Players } from "./Players/Players";
import { Cards } from "./Cards/Cards";
// @ts-ignore
import styles from "./PokerTable.module.css";

const PokerTable = ({ room, refresh }: { readonly room: Room; readonly refresh: () => Promise<void> }) => {
    return (
        <div className={styles.container}>
            {userIsHost(room) ? <Controls room={room} refresh={refresh} /> : undefined}

            <Results room={room} />
            <Players room={room} refresh={refresh} />
            <Cards room={room} refresh={refresh} />
        </div>
    );
};

export { PokerTable };
