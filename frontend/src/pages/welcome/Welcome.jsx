import Navigation from '../navigation/Navigation';
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import imageLogo from '../../assets/logo/image-logo.png';
import './Welcome.css'; // Import the CSS file for animations

function Welcome() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/'); // Redirect to the authentication page
    };

    return (
        <>
            <Navigation />
            <div className="animated-container" style={styles.container}>
                <header className="animated-header" style={styles.header}>
                    <h1 className="animated-title" style={styles.title}>Welcome to the Debt Management System</h1>
                </header>
                <main className="animated-main" style={styles.main}>
                    <img src={imageLogo} alt="" className="animated-logo logo" />
                    <p className="animated-description" style={styles.description}>
                        Manage and track debts efficiently. Navigate to the respective sections below to get started.
                    </p>
                    <div className="animated-navigation" style={styles.navigation}>
                        <Link to="/inventory" className="animated-link" style={styles.link}>
                            <button className="animated-button" style={styles.button}>Item List</button>
                        </Link>
                        <Link to="/debt" className="animated-link" style={styles.link}>
                            <button className="animated-button" style={styles.button}>Debtor List</button>
                        </Link>
                        <button className="animated-button" style={styles.button} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}

const styles = {
    container: {
        position: 'fixed',
        top: "70px",
        left: "70px",
        right: 0,
        bottom: 0,
        fontFamily: "'Roboto', sans-serif", 
        textAlign: "center",
        backgroundColor: "#011638",
        color: "white",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    header: {
        backgroundColor: "#2E294E",
        padding: "20px",
    },
    title: {
        margin: 0,
        fontSize: "2.5rem",
        fontWeight: "bold",
    },
    main: {
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    description: {
        fontSize: "1.2rem",
        marginBottom: "30px",
        maxWidth: "600px",
        lineHeight: "1.5", 
        color: 'white',
    },
    navigation: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",  
    },
    link: {
        textDecoration: "none",
    },
    button: {
        backgroundColor: "#9055A2",
        border: "none",
        borderRadius: "8px",
        color: "white",
        padding: "15px 30px",
        fontSize: "1.2rem", 
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease", 
    },
    buttonHover: {
        backgroundColor: "#D499B9",
    },
    footer: {
        position: 'absolute',
        bottom: "20px", 
        backgroundColor: "#2E294E",
        padding: "10px",
        left: 0,
        right: 0,
        fontSize: "0.9rem", 
    },
};

export default Welcome;
