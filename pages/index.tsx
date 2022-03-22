import {useEffect, useState} from "react";
import type { NextPage } from "next";
import Link from "next/link";
import {Session} from "../types/session";
import { Button, Header, Modal } from "../components";
import { createRoom } from "../utils/api";
import {addRoomToHistory, updateDisplayName, withSession} from "../utils/session";
import styles from "../styles/Home.module.css";
import {DateTime} from "luxon";

const Home: NextPage = () => {
    const [roomCreated, setRoomCreated] = useState<boolean>(false);
    const [session, setSession] = useState<Session>();
    const [form, setForm] = useState({
        roomName: "",
        displayName: "",
    });

    useEffect(() => {
        const session = withSession();

        setSession(session);
        setForm({...form, displayName: session.displayName});
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name;
        const value = event.target.value;

        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        updateDisplayName(form.displayName);

        const result = await createRoom(form.roomName);

        if (result.success) {
            addRoomToHistory(result.id, form.roomName);

            window.location.replace(`/table/${result.id}`);
        }

        setRoomCreated(true);
    };

    const historyLength = session?.history ? session.history.length : 0;

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.intro}>
                    <span>Welcome to planning poker!</span>
                    <p>Click the button below to create a new room</p>
                    <p>Creating the room automatically makes you the host</p>
                    <p>Only the host has the ability to reveal & reset the table</p>
                </div>

                <Modal
                    trigger={
                        <Button className={styles.create} isDisabled={roomCreated}>
                            {roomCreated ? "Loading room..." : "Create a new room"}
                        </Button>
                    }
                    callback={handleSubmit}
                >
                    <div className={styles.create}>
                        <label htmlFor="room-name">Room name:</label>
                        <input
                            type="text"
                            id="room-name"
                            name="roomName"
                            value={form.roomName}
                            onChange={handleChange}
                        />

                        <label htmlFor="display-name">Your name:</label>
                        <input
                            type="text"
                            id="display-name"
                            name="displayName"
                            value={form.displayName}
                            onChange={handleChange}
                        />
                    </div>
                </Modal>

                <div className={styles.context}>
                    <p>This application is based on and designed for the estimation & refinement practices of the Digital Services Teaching & Learning team</p>
                    <p>Use this app during planning sessions to determine blind/unbiased estimates for tasks</p>
                    <p>This app currently only supports estimation in T-shirt sizes</p>
                </div>

                {historyLength > 0 ? (
                    <div className={styles.history}>
                        <h2>Recent rooms:</h2>
                        <table>
                            <tbody>
                            {session!.history.map((room) => (
                                <Link href={`/table/${room.roomId}`} passHref key={room.roomId}>
                                    <tr className={styles.room}>
                                        <td className={styles.name}>{room.roomName}</td>
                                        <td className={styles.timestamp}>{DateTime.fromISO(room.lastVisited).toRelative()}</td>
                                    </tr>
                                </Link>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : undefined}
            </div>
        </div>
    );
};

export default Home;
