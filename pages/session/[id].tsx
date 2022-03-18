import {ParsedUrlQuery} from "querystring";
import {getRoom} from "../../utils/api";
import {Room} from "../../types/room";
import {useEffect, useState} from "react";
import {Header} from "../../components";
import styles from "../../styles/Room.module.css";

const getServerSideProps = async ({params}: {params: ParsedUrlQuery}) => {
    const id = params.id! as string;

    const room = await getRoom(id);

    if (!room) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    } else {
        return {
            props: {id, room}
        }
    }
};

declare type PlanningRoomProps = {
    id: string;
    room: Room;
};

const PlanningRoom = (props: PlanningRoomProps) => {
    const [room, setRoom] = useState<Room>(props.room);

    useEffect(() => {
        const fetchRoom = async () => {
            setRoom(await getRoom(props.id) as Room);
        }

        const interval = setInterval(fetchRoom, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [props.id]);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <h1 className={styles.name}>{room.name}</h1>
            </div>
        </div>
    );
};

export {PlanningRoom as default, getServerSideProps};
