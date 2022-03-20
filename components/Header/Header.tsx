import React from "react";
import Head from "next/head";
import Link from "next/link";
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
                <Link href="/" passHref>
                    <img
                        className={styles.logo}
                        src="https://www.york.ac.uk/static/stable/img/logo.svg"
                        alt="University of York Logo"
                    />
                </Link>
                <h1 className={styles.title}>Planning Poker</h1>
            </div>
        </header>
    );
};

export { Header };
