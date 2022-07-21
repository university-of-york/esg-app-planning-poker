import React, {useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import type {Room} from "../../types/room";
import type {Session} from "../../types/session";
import {Button, EstimationType, Header, Modal, NowEstimating, PokerTable} from "../../components";
import {getRoom, joinRoom, leaveRoom, renameRoom} from "../../utils/api";
import {addRoomToHistory, updateDisplayName, userIsHost, withSession} from "../../utils/session";
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
    const [roomName, setRoomName] = useState<string>(room.name);
    const [displayName, setDisplayName] = useState<string>("");
    const [renameModelOpen, setRenameModalOpen] = useState<boolean>(false);
    const [linkCopied, setLinkCopied] = useState<boolean>(false);
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

    const handleInvite = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);

        setTimeout(() => setLinkCopied(false), 5000);
    };

    const handleJoinRoom = async () => {
        updateDisplayName(displayName);

        await joinRoom(room.id, session!.id, displayName);

        addRoomToHistory(room.id, room.name);

        await refresh();
    };

    const handleRenameRoom = async () => {
        await renameRoom(room.id, roomName);

        await refresh();

        setRenameModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <Header />
            <Modal
                mandatory
                open={!hasJoinedRoom && !isLeaving}
                valid={displayName !== ""}
                callback={handleJoinRoom}
            >
                <div className={styles.join}>
                    <label className={styles.name}>Your name</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
            </Modal>

            <Modal
                open={renameModelOpen}
                callback={handleRenameRoom}
                onClose={() => setRenameModalOpen(false)}
            >
                <div className={styles.rename}>
                    <label className={styles.name}>Room name</label>
                    <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                </div>
            </Modal>

            <div className={styles.content}>
                <div className={styles.info}>
                    <h1
                        className={`${styles.name} ${userIsHost(room) ? styles.editable : ''}`}
                        onClick={userIsHost(room) ? (() => setRenameModalOpen(true)) : undefined}
                    >{room.name}</h1>

                    <span className={styles.count}>
                        {room.members.length}
                        <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                    </span>
                </div>

                <Button className={styles.invite} onClick={handleInvite}>
                    {linkCopied ? "Link copied!" : "Copy invite link"}
                </Button>

                {hasJoinedRoom ? (
                    <>
                        <EstimationType room={room} refresh={refresh} />

                        <NowEstimating room={room} />

                        <PokerTable room={room} refresh={refresh} />
                    </>
                ) : undefined}
            </div>
        </div>
    );
};

export { PlanningRoom as default, getServerSideProps };
