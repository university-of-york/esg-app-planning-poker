import { useState } from "react";
import type { NextPage } from "next";
import { Button, Header, Modal } from "../components";
import { createRoom } from "../utils/api";
import { updateDisplayName } from "../utils/session";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    const [form, setForm] = useState({
        roomName: "",
        displayName: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name;
        const value = event.target.value;

        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        updateDisplayName(form.displayName);

        await createRoom(form.roomName);
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.intro}>
                    <span>Welcome to planning poker!</span>
                    <p>Click the button below to create a new room</p>
                </div>
                <Modal trigger={<Button className={styles.create}>Create a new room</Button>} callback={handleSubmit}>
                    <div className={styles.form}>
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
            </div>
        </div>
    );
};

export default Home;
