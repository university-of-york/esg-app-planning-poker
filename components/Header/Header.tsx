import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
// @ts-ignore
import styles from "./Header.module.css";

const Header = () => {
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

                <a href="/">
                    <h1 className={styles.title}>Planning Poker</h1>
                </a>

                <Link href="https://github.com/university-of-york/esg-app-planning-poker" passHref>
                    <FontAwesomeIcon
                        className={styles.github}
                        icon={faGithubSquare}
                        title="View the source code for this application on Github"
                    />
                </Link>
            </div>
        </header>
    );
};

export { Header };
