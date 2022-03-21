import {ParsedUrlQuery} from "querystring";
import {getRoom, joinRoom, leaveRoom} from "../../utils/api";
import {Room} from "../../types/room";
import {useCallback, useEffect, useState} from "react";
import {Header, Modal, PokerTable} from "../../components";
import {Session} from "../../types/session";
import {updateDisplayName, withSession} from "../../utils/session";
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
    const [displayName, setDisplayName] = useState<string>("");

    const hasJoinedRoom = room.members.find((member) => member.id === session?.id);

    const refresh = useCallback(async () => {
        setRoom((await getRoom(props.id))!)
    }, [props.id]);

    useEffect(() => {
        const session = withSession();

        setSession(session);
        setDisplayName(session.displayName);
    }, []);

    useEffect(() => {
        const interval = setInterval(refresh, 2000);

        return () => clearInterval(interval);
    }, [refresh]);

    useEffect(() => {
        window.onbeforeunload = () => {
            if (session?.id && hasJoinedRoom) {
                leaveRoom(room.id, session.id);
            }
            return null;
        };
    }, [room.id, session?.id, hasJoinedRoom]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(event.target.value);
    };

    const handleConfirmation = async () => {
        await updateDisplayName(displayName);
        await joinRoom(room.id, session!.id, displayName);
        await refresh();
    }

    const currentPlayer = room.members.find((member) => member.id === session?.id);

    return (
        <div className={styles.container}>
            <Header />
            <Modal
                mandatory
                open={!hasJoinedRoom}
                callback={handleConfirmation}
            >
                <div className={styles.join}>
                    <label className={styles.name}>Your name</label>
                    <input type="text" value={displayName} onChange={handleChange} />
                </div>
            </Modal>

            <div className={styles.content}>
                <h1 className={styles.name}>{room.name}</h1>

                <PokerTable room={room} currentPlayer={currentPlayer} refresh={refresh} />
            </div>
        </div>
    );
};

export { PlanningRoom as default, getServerSideProps };
