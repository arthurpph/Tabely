import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { PlaylistStructure } from '../interfaces/playlistStructure';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../assets/styles/User.css';

function User() {
    const [userName, setUserName] = useState<string>('');
    const [userPlaylistsCounter, setUserPlaylistsCounter] = useState<number>(0);
    const [userPlaylists, setUserPlaylists] = useState<{ _id: string, name: string, imageURL: string }[]>([]);
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
                name: playlist.name,
                imageURL: playlist.imageURL
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
                                    <div className='playlist' key={index} onClick={() => navigate(`/playlist?playlistId=${playlist._id}`)}>
                                        {playlist.imageURL ? 
                                            <img src={playlist.imageURL} alt="Playlist Image" />
                                        :
                                            <button>
                                                <svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="playlist" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 iYxpxA" fill="black"><path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                                            </button>
                                        }
                                        <h6>{playlist.name}</h6>
                                    </div>
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