import styles from "./DebtorDetailComponents.module.css";

function DebtList({debtor}) {

    return(
        <>
        <h2>Debts:</h2>
        <ul>
            {debtor.debts.length === 0 ? (
                <p>No debts found.</p>
            ) : (
                debtor.debts.map((debt, index) => (
                    <li key={index}>
                        <p>
                            {debt.description}: {debt.amount.toFixed(2)}
                            <br />
                            (Added on:{" "}
                            {new Date(debt.date).toLocaleString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour12: false,
                            })}
                            )
                        </p>
                    </li>
                ))
            )}
        </ul>
        </>
    )
}

export default DebtList;