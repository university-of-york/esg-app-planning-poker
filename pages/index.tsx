import type {NextPage} from 'next'
import {Header} from "../components";
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Header title="Home"/>
            <div className={styles.content}>
                
            </div>
        </div>
    )
}

export default Home
