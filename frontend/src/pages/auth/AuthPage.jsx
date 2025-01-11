import React from 'react';
import { Link } from 'react-router-dom';
import imageLogo from '../../assets/logo/image-logo.png';
import styles from './AuthPage.module.css';
import '../../index.css'
import 'animate.css';

function AuthPage() {
    return (
 <div className={styles.bg}>

    <div className={`${styles.container}`}>
        <img src={imageLogo} alt="Logo" className={`${styles.logo} ${"animate__lightSpeedInLeft"}`} 
        />
        <h1 className={styles.heading}>Welcome to the Debt Management System</h1>
        <p className={styles.description}>
            Manage your debts efficiently and securely. Get started by logging in or signing up.
        </p>
        <div className={styles.buttons}>
            <Link to="/login" className={styles.link}>
                <button className={styles.button}>Login</button>
            </Link>
            <Link to="/signup" className={styles.link}>
                <button className={styles.button}>Signup</button>
            </Link>
        </div>
    </div>
        </div>

    );
}

export default AuthPage;
