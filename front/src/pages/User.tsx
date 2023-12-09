import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { PlaylistStructure } from '../interfaces/playlistStructure';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../assets/styles/User.css';

function User() {
    //const [userImage, setUserImage] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [userPlaylistsCounter, setUserPlaylistsCounter] = useState<number>(0);
    const [userPlaylists, setUserPlaylists] = useState<{ _id: string, name: string }[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserInfo = async () => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userId');

            if(!userId) {
                console.error('Invalid user ID');
            }

            const user = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}`);
            const data = user.data;
            
            setUserName(data.name);
            setUserPlaylistsCounter(data.playlists.length);
            setUserPlaylists(data.playlists.map((playlist: PlaylistStructure) => ({
                _id: playlist._id,
                name: playlist.name
            })));
            setIsLoaded(true);
        }

        getUserInfo();
    }, [])

    return (
        <div>
            <Navbar/>
                {isLoaded ?
                    <div className='user-page'>
                        <h2>{userName}</h2>
                        <span>{`${userPlaylistsCounter} ${userPlaylistsCounter <= 1 ? 'playlist' : 'playlists'}`}</span>
                        <button>Follow</button>
                        <div className='user-playlists'>
                            <h5>Playlists</h5>
                            <div>
                                {userPlaylists.map((playlist, index) => (
                                    <h6 key={index} onClick={() => navigate(`/playlist?playlistId=${playlist._id}`)}>{playlist.name}</h6>
                                ))}
                            </div>
                        </div>
                    </div>
                :
                    <div className='user-page'>
                        <TailSpin
                            height="80"
                            width="80"
                            color="#808080"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                }
        </div>
    );
}

export default User;