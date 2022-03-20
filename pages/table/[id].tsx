import { ParsedUrlQuery } from "querystring";
import { getRoom, joinRoom } from "../../utils/api";
import { Room } from "../../types/room";
import { useEffect, useState } from "react";
import {Header, Modal, PokerTable} from "../../components";
import { Session } from "../../types/session";
import { updateDisplayName, withSession } from "../../utils/session";
// @ts-ignore
import styles from "../../styles/Room.module.css";

const getServerSideProps = async ({ params }: { params: ParsedUrlQuery }) => {
    const id = params.id! as string;

    const room = await getRoom(id);

    if (!room) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    } else {
        return {
            props: { id, room },
        };
    }
};

declare type PlanningRoomProps = {
    id: string;
    room: Room;
};

const PlanningRoom = (props: PlanningRoomProps) => {
    const [room, setRoom] = useState<Room>(props.room);
    const [session, setSession] = useState<Session>();
    const [_displayName, setDisplayname] = useState<string>("");

    const hasJoinedRoom = room.members.find((member) => member.id === session?.id);

    const refresh = async () => setRoom(await getRoom(props.id) as Room);

    useEffect(() => {
        const interval = setInterval(refresh, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const getSession = async () => {
            setSession(await withSession());
        };

        getSession();
    }, [room]);

    useEffect(() => {
        if (session?.displayName && !hasJoinedRoom) {
            const join = async () => {
                await joinRoom(room.id, session.id, session.displayName);
                await refresh();
            };

            join();
        }
    }, [session]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayname(event.target.value);
    };

    const handleConfirmation = async () => {
        await updateDisplayName(_displayName);
    }

    const currentPlayer = room.members.find((member) => member.id === session?.id);

    return (
        <div className={styles.container}>
            <Header />
            <Modal
                className={styles.sessionModal}
                open={session?.displayName === ""}
                callback={handleConfirmation}
            >
                <label className={styles.name}>Your name</label>
                <input type="text" value={_displayName} onChange={handleChange} />
            </Modal>

            <div className={styles.content}>
                <h1 className={styles.name}>{room.name}</h1>

                <PokerTable room={room} currentPlayer={currentPlayer} refresh={refresh} />
            </div>
        </div>
    );
};

export { PlanningRoom as default, getServerSideProps };
