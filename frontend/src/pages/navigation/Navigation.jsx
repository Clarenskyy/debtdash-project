import { Outlet, Link, NavLink } from 'react-router-dom'
import Header from '../../header/Header.jsx'
import style from './Navigation.module.css'
import homeLogo from '../../assets/navigation-logo/home-logo.png'
import debtListLogo from '../../assets/navigation-logo/debt-list-logo.png'
import inventoryLogo from '../../assets/navigation-logo/inventory-logo.png'
import NavDisplay from '../../global-use/NavDisplay.jsx'

function Navigation() {

    return(
        <div>
            <Header />
            <main>
                <nav className={style.navBar}>
                    <div>
                        <Link to="/">
                            <NavDisplay imageUrl={homeLogo} textName="Home" />
                        </Link>
                    </div>
                    <div>
                        <Link to="/debt">
                        <NavDisplay imageUrl={debtListLogo} textName="Debtor List" /> 
                        </Link>
                    </div>
                    <div>
                        <Link to="/inventory"> 
                        <NavDisplay imageUrl={inventoryLogo} textName="Inventory List" />
                        </Link>
                    </div>
                </nav>
                <Outlet>
                </Outlet>
            </main>

        </div>
    )
}

export default Navigation