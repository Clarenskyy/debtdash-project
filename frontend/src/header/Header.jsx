import textLogo from '../assets/logo/text-logo.png';
import imageLogo from '../assets/logo/image-logo.png';
import style from './Header.module.css';

function Header() {
    return(
            <header className={style.headerContainer}>
                <div>
                    <img className={style.imageLogo} src={imageLogo} alt="" />
                </div>
                <div>
                    <img className={style.textLogo} src={textLogo} alt="asd" />
                </div>
                <div></div>
            </header>
    );
}

export default Header