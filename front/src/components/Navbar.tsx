import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from '../helpers/getCookie';
import { decodeToken } from '../helpers/decodeToken';
import LibraryOffCanvas from './LibraryOffCanvas';
import '../assets/styles/Navbar.css';

function Navbar() {
    const [activeTab, setActiveTab] = useState<string>('home');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [showLibrary, setShowLibrary] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = location.pathname;
        const tab = path.substring(1) || 'home';
        setActiveTab(tab);
    }, [location]);

    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
    }

    const handleLogout = (): void => {
        localStorage.removeItem('loginToken');
        window.location.href = '/login';
        setDropdownVisible(!dropdownVisible);
    }

    const handleLibraryClose = (): void => {
        setShowLibrary(false);
        handleTabChange('home');
    }

    const capitalizeFirstLetter = (name: string): string => {
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
                        {getCookie('loginToken') ? <button onClick={() => setShowLibrary(true)}>Library</button> : <Link to="/login">Library</Link>}
                    </li>
                </ul>
            </nav>
            <div className="login-info" onMouseLeave={() => setDropdownVisible(false)}>
                {!getCookie('loginToken') ? 
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login
                    </button> 
                : 
                <p style={{ cursor: 'pointer', textDecoration: 'underline' }} onMouseEnter={() => setDropdownVisible(true)} onClick={() => navigate(`/user?userId=${decodeToken('', 'loginToken').id}`)}>
                    Logged as {capitalizeFirstLetter(decodeToken('', 'loginToken').name)}
                </p>
                }
                {dropdownVisible && (
                    <div className="dropdown-content">
                        <button className="dropdown-content-button" onClick={handleLogout}>Log out</button>
                    </div>
                )}
            </div>
            <LibraryOffCanvas showLibrary={showLibrary} handleLibraryClose={handleLibraryClose} showModal={showModal} handleModalClose={() => {
                setShowModal(false);
                handleLibraryClose();
            }} handleModalOpen={() => setShowModal(true)} />
        </header>
    );
}

export default Navbar;