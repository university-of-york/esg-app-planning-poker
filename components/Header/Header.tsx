import React from "react";
import Link from "next/link";
import Head from "next/head";
import styles from './Header.module.css';

declare type HeaderProps = {
    title: string;
}

const Header = ({title}: HeaderProps) => {
  return (
    <header className={styles.container}>
        <Head>
            <title>{title} | Planning Poker</title>
            <meta name="author" content="University of York" />
            <meta name="application-name" content="Planning Poker" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" type="image/png" href="https://www.york.ac.uk/static/stable/img/favicons/favicon-64x64.png" />
            <link rel="favicon" type="image/png" href="https://www.york.ac.uk/static/stable/img/favicons/favicon-64x64.png" />
        </Head>
        <div className={styles.content}>
            <Link href="/" passHref>
                <img className={styles.logo} src="https://www.york.ac.uk/static/stable/img/logo.svg" alt="University of York Logo" />
            </Link>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.name}>Planning Poker</span>
        </div>
    </header>
  );
};

export { Header };
