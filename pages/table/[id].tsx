import React, { useCallback, useEffect, useState } from "react";
import type { Room } from "../../types/room";
import type { Session } from "../../types/session";
import { EstimationType, Header, Modal, NowEstimating, PokerTable } from "../../components";
import { getRoom, joinRoom, leaveRoom } from "../../utils/api";
import { addRoomToHistory, updateDisplayName, withSession } from "../../utils/session";
// @ts-ignore
import styles from "../../styles/Room.module.css";

const getServerSideProps = async ({ params }: { params: any }) => {
    const id = params.id! as string;

    const room = await getRoom(id);

    if (room) {
        return {
            props: { id, room },
        };
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
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
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    const hasJoinedRoom = room.members.find((member) => member.id === session?.id);

    const refresh = useCallback(async () => {
        const room = await getRoom(props.id);
        if (room) {
            setRoom(room);
        }
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
                setIsLeaving(true);
                leaveRoom(room.id, session.id);
            }

            return null;
        };
    }, [room.id, session?.id, hasJoinedRoom]);

    const handleJoinRoom = async () => {
        updateDisplayName(displayName);

        await joinRoom(room.id, session!.id, displayName);

        addRoomToHistory(room.id, room.name);

        await refresh();
    };

    return (
        <div className={styles.container}>
            <Header room={room} refresh={refresh} />

            <Modal mandatory open={!hasJoinedRoom && !isLeaving} valid={displayName !== ""} callback={handleJoinRoom}>
                <div className={styles.join}>
                    <label className={styles.name}>Your name</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
            </Modal>

            <div className={styles.wrapper}>
                <div className={styles.content}>
                    {hasJoinedRoom ? (
                        <>
                            <EstimationType room={room} refresh={refresh} />

                            <NowEstimating room={room} />

                            <PokerTable room={room} refresh={refresh} />
                        </>
                    ) : undefined}
                </div>
            </div>
        </div>
    );
};

export { PlanningRoom as default, getServerSideProps };
