import Navigation from './navigation/Navigation'
import React from "react";
import { Link } from "react-router-dom";

function Welcome()  {
        return (
            <>
            <Navigation></Navigation>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Welcome to the  Debt Management System</h1>
                </header>
                <main style={styles.main}>
                    <p style={styles.description}>
                        Manage and track debts efficiently. Navigate to the respective sections below to get started.
                    </p>
                    <div style={styles.navigation}>
                        <Link to="/inventory" style={styles.link}>
                            <button style={styles.button}>Item list</button>
                        </Link>
                        <Link to="/debt" style={styles.link}>
                            <button style={styles.button}>Debtor List</button>
                        </Link>
                    </div>
                </main>
                <footer style={styles.footer}>
                    <p>&copy; 2024 Inventory & Debt Management System </p>
                </footer>
            </div>
            </>
            
        );
    };
    
    const styles = {
        container: {
            position: 'fixed',
            top: "70px",
            left: "70px",
            right: 0,
            bottom: 0,
            fontFamily: "Arial, sans-serif",
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
            fontSize: "2rem",
        },
        main: {
            flex: 1,
            padding: "20px",
        },
        description: {
            fontSize: "1.2rem",
            marginBottom: "30px",
        },
        navigation: {
            display: "flex",
            justifyContent: "center",
            gap: "20px",
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
            fontSize: "1rem",
            cursor: "pointer",
        },
        buttonHover: {
            backgroundColor: "#D499B9",
        },
        footer: {
            position: 'absolute',
            bottom: "60px",
            backgroundColor: "#2E294E",
            padding: "10px",
            left: 0,
            right: 0,
        },
    };

export default Welcome