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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);    

    useEffect(() => {
        const path = location.pathname;
        let tab = path.substring(1) || 'home';
        if(tab === 'playlist') {
            tab = 'library'
        }
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
            {windowWidth > 600 && <h1>Tabely</h1>}
            <nav>
                <ul>
                    <li className={activeTab === 'home' ? 'active' : ''} onClick={() => handleTabChange('home')}>
                        {getCookie('loginToken') && windowWidth > 600 ? (
                            <Link to="/">Home</Link>
                        ) : getCookie('loginToken') && windowWidth <= 600 ? (
                            <Link to="/"><svg data-encore-id="icon" role="img" aria-hidden="true" className="Svg-sc-ytk21e-0 iYxpxA home-icon" viewBox="0 0 24 24" fill='white'><path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path></svg></Link>
                        ) : (
                            <Link to="/login">Home</Link>
                        )}
                    </li>
                    <li className={activeTab === 'browse' ? 'active' : ''} onClick={() => handleTabChange('browse')}>
                        {getCookie('loginToken') && windowWidth > 600 ? (
                            <Link to="/">Browse</Link>
                        ) : getCookie('loginToken') && windowWidth <= 600 ? (
                            <Link to="/"><svg data-encore-id="icon" role="img" aria-hidden="true" className="Svg-sc-ytk21e-0 iYxpxA search-icon" viewBox="0 0 24 24" fill='white'><path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path></svg></Link>
                        ) : ( 
                            <Link to="/login">Browse</Link>
                        )}
                    </li>
                    <li className={activeTab === 'library' ? 'active' : ''} onClick={() => handleTabChange('library')}>
                        {getCookie('loginToken') && windowWidth > 600 ? (
                            <button className="library" onClick={() => setShowLibrary(true)}>
                                Library
                            </button> 
                        ) : getCookie('loginToken') && windowWidth <= 600 ? (
                            <svg onClick={() => setShowLibrary(true)} data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 iYxpxA" fill='white'><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path></svg>
                        ) : (
                            <Link to="/login">Library</Link>
                        )}
                    </li>
                </ul>
            </nav>
            <div className="login-info" onMouseLeave={() => setDropdownVisible(false)}>
                {!getCookie('loginToken') ? 
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login
                    </button> 
                :
                <>
                    {windowWidth > 600 && <p style={{ cursor: 'pointer', textDecoration: 'underline' }} onMouseEnter={() => setDropdownVisible(true)} onClick={() => navigate(`/user?userId=${decodeToken('', 'loginToken').id}`)}>
                        Logged as {capitalizeFirstLetter(decodeToken('', 'loginToken').name)}
                    </p>}
                </>
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