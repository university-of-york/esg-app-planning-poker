import {ParsedUrlQuery} from "querystring";
import {getRoom, joinRoom, leaveRoom} from "../../utils/api";
import {Room} from "../../types/room";
import {useCallback, useEffect, useState} from "react";
import {Button, Header, Modal, PokerTable} from "../../components";
import {Session} from "../../types/session";
import {addRoomToHistory, updateDisplayName, withSession} from "../../utils/session";
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
    const [linkCopied, setLinkCopied] = useState<boolean>(false);

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
                leaveRoom(room.id, session.id);
            }
            return null;
        };
    }, [room.id, session?.id, hasJoinedRoom]);

    const handleInvite = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);

        setTimeout(() => setLinkCopied(false), 5000);
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(event.target.value);
    };

    const handleConfirmation = async () => {
        updateDisplayName(displayName);

        await joinRoom(room.id, session!.id, displayName);

        addRoomToHistory(room.id, room.name);

        await refresh();
    }

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
                    <input type="text" value={displayName} onChange={handleNameChange} />
                </div>
            </Modal>

            <div className={styles.content}>
                <h1 className={styles.name}>{room.name}</h1>

                <Button
                    className={styles.invite}
                    onClick={handleInvite}
                >
                    {linkCopied ? "Link copied!" : "Copy invite link"}
                </Button>

                <span className={styles.count}>
                    {room.members.length} {room.members.length === 1 ? 'person' : 'people'} present
                </span>

                {hasJoinedRoom ? (
                    <PokerTable
                        room={room}
                        session={session!}
                        refresh={refresh}
                    />
                ) : undefined}
            </div>
        </div>
    );
};

export { PlanningRoom as default, getServerSideProps };
