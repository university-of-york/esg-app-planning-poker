import React, { useEffect, useState } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { Room } from "../../types/room";
import { userIsHost } from "../../utils/session";
import { renameRoom } from "../../utils/api";
// @ts-ignore
import styles from "./Header.module.css";

const Header = ({ room, refresh }: { room?: Room; refresh?: () => Promise<void> }) => {
    const [roomName, setRoomName] = useState<string | undefined>(room?.name);
    const [editable, setEditable] = useState<boolean>(false);
    const [linkCopied, setLinkCopied] = useState<boolean>(false);
    const [renameModelOpen, setRenameModalOpen] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            if (!room) {
                setEditable(false);
                return;
            }

            if (userIsHost(room)) {
                setEditable(true);
            }
        };
    }, [room]);

    const handleInvite = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);

        setTimeout(() => setLinkCopied(false), 5000);
    };

    const handleRenameRoom = async () => {
        await renameRoom(room!.id, roomName!);

        await refresh!();

        setRenameModalOpen(false);
    };

    return (
        <header className={styles.container}>
            <Head>
                <title>Planning Poker</title>
                <meta name="author" content="University of York" />
                <meta name="application-name" content="Planning Poker" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://fonts.googleapis.com/css?family=Ubuntu:regular,medium,bold&subset=Latin&display=swap"
                />
                <link
                    rel="icon"
                    type="image/png"
                    href="https://www.york.ac.uk/static/stable/img/favicons/favicon-64x64.png"
                />
                <link
                    rel="favicon"
                    type="image/png"
                    href="https://www.york.ac.uk/static/stable/img/favicons/favicon-64x64.png"
                />
            </Head>
            <div className={styles.content}>
                <img
                    className={styles.logo}
                    src="https://www.york.ac.uk/static/stable/img/logo.svg"
                    alt="University of York Logo"
                />

                <div className={styles.info}>
                    <a href="/">
                        <h1 className={styles.title}>Planning Poker</h1>
                    </a>

                    {room ? (
                        <>
                            <div className={styles.room}>
                                <h1
                                    className={`${styles.name} ${editable ? styles.editable : ""}`}
                                    onClick={editable ? () => setRenameModalOpen(true) : undefined}
                                >
                                    {room.name}
                                </h1>

                                <span className={styles.count}>
                                    {room.members.length}
                                    <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                                </span>
                            </div>

                            <Button className={styles.invite} onClick={handleInvite}>
                                {linkCopied ? "Link copied!" : "Copy invite link"}
                            </Button>
                        </>
                    ) : (
                        ""
                    )}
                </div>

                {room ? (
                    <Modal open={renameModelOpen} callback={handleRenameRoom} onClose={() => setRenameModalOpen(false)}>
                        <div className={styles.rename}>
                            <label className={styles.name}>Room name</label>
                            <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                        </div>
                    </Modal>
                ) : (
                    ""
                )}

                <a
                    className={styles.githubLink}
                    href="https://github.com/university-of-york/esg-app-planning-poker"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon
                        className={styles.github}
                        icon={faGithubSquare}
                        title="View the source code for this application on Github"
                    />
                </a>
            </div>
        </header>
    );
};

export { Header };
