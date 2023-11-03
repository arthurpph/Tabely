import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import cookies from 'js-cookie';
import searchImg from '../assets/images/Search_alt.png'
import musicImg from '../assets/images/Music_fill.png'
import headphoneImg from '../assets/images/Headphones_fill.png'
import micImg from '../assets/images/Mic.png'
import starImg from '../assets/images/Star.png'
import videoImg from '../assets/images/Video_file_fill.png'
import '../assets/styles/Leftbar.css'

interface JwtDecodeInterface {
    email: string,
    iat?: number,
    name: string,
    password: string
}

function Leftbar() {
    const [jwtTokenName, setJwtTokenName] = useState('');
    
    useEffect(() => {
        const token = cookies.get('loginToken')
        if(token) {
            const decodedToken = jwtDecode<JwtDecodeInterface>(token);
            if(decodedToken) {
                setJwtTokenName(decodedToken.name);
            }
        }
    }, []);

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }} className="container">
            <div className="top">
                {jwtTokenName !== '' && (
                    <p className='welcome'>Bem-vindo {jwtTokenName.charAt(0).toUpperCase() + jwtTokenName.slice(1)}</p>
                )}
                <div className="flexcolumn">
                    <p>BROWSE</p>
                    <div className="flex">
                        <img src={searchImg} alt="searchImg"/>
                        <p>DISCOVER</p>
                    </div>
                    <div className="flex">
                        <img src={musicImg} alt="musicImg" />
                        <p>GENRE</p>
                    </div>
                    <div className="flex">
                        <img src={headphoneImg} alt="headphoneImg"/>
                        <p>TOP CHARTS</p>
                    </div>
                    <div className="flex">
                        <img src={micImg} alt="micImg"/>
                        <p>PODCAST</p>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="flexcolumn">
                    <p>LIBRARY</p>
                    <div className="flex">
                        <img src={starImg} alt="starImg"/>
                        <p>FAVOURITES</p>
                    </div>
                    <div className="flex">
                        <img src={videoImg} alt="videoImg" />
                        <p>PLAYLIST</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leftbar;