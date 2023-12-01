import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from '../helpers/getCookie';
import { decodeToken } from '../helpers/decodeToken';
import { removeCookie } from '../helpers/removeCookie';
import '../assets/styles/Navbar.css';

function Navbar() {
    const [activeTab, setActiveTab] = useState<string>('home');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = location.pathname;
        const tab = path.substring(1) || 'home';
        setActiveTab(tab);
    }, [location]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    }

    const handleLogout = () => {
        removeCookie('loginToken');
        navigate('/login');
        setDropdownVisible(!dropdownVisible)
    }

    const capitalizeFirstLetter = (name: string) => {
        return name.charAt(0).toUpperCase() + name.substring(1);
    }

    return (
        <header>
            <h1>Tabely</h1>
            <nav>
                <ul>
                    <li className={activeTab === 'home' ? 'active' : ''} onClick={() => handleTabChange('home')}>
                        {getCookie('loginToken') ? <Link to="/">Home</Link> : <Link to="/login">Home</Link>}
                    </li>
                    <li className={activeTab === 'browse' ? 'active' : ''} onClick={() => handleTabChange('browse')}>
                        {getCookie('loginToken') ? <Link to="/">Browse</Link> : <Link to="/login">Browse</Link>}
                    </li>
                    <li className={activeTab === 'library' ? 'active' : ''} onClick={() => handleTabChange('library')}>
                        {getCookie('loginToken') ? <Link to="/library">Library</Link> : <Link to="/login">Library</Link>}
                    </li>
                </ul>
            </nav>
            <div>
                {!getCookie('loginToken') ? <button className="login-button" onClick={() => navigate('/login')}>Login</button> : <p onClick={() => setDropdownVisible(!dropdownVisible)}>Logged as {capitalizeFirstLetter(decodeToken('', 'loginToken').name)}</p>}
                {dropdownVisible && (
                    <div className="dropdown-content" onMouseLeave={() => setDropdownVisible(false)}>
                        <button onClick={handleLogout}>Log out</button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;