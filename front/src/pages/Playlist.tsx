import { useState, useEffect } from "react";
import { MusicStructure } from "../interfaces/musicStructure";
import { TailSpin } from 'react-loader-spinner';
import axios from "axios";
import Navbar from "../components/Navbar";
import "../assets/styles/Playlist.css"

function Playlist() {
    const [IsPlaylistLoaded, setIsPlaylistLoaded] = useState<boolean>(false);
    const [playlistName, setPlaylistName] = useState<string>('');
    const [playlistOwnerName, setPlaylistOwnerName] = useState<string>('');
    const [playlistMusics, setPlaylistMusics] = useState<MusicStructure[]>([]);
    const [playlistImageURL, setPlaylistImageURL] = useState<string>('');
    const [customImage, setCustomImage] = useState<boolean>(false);

    useEffect(() => {
        const getPlaylistInfo = async (): Promise<void> => {
            try {
                const params = new URLSearchParams(window.location.search);
                const playlistId = params.get('playlistId');
                console.log(playlistId)
                const playlist = await axios.get(`${import.meta.env.VITE_API_URL}/playlist?playlistId=${playlistId}`);
                const playlistData = playlist.data;

                setPlaylistName(playlistData.name);
                setPlaylistMusics(playlistData.musics);
                setPlaylistImageURL(playlistData.imageURL);

                const user = await axios.get(`${import.meta.env.VITE_API_URL}/user/${playlistData.ownerId}`);
                const userData = user.data;

                setPlaylistOwnerName(userData.name);
                setIsPlaylistLoaded(true);
            } catch (err) {
                console.error(err);
            }
        }

        getPlaylistInfo();
    }, [])

    return (
        <div>
            <Navbar/>
                {IsPlaylistLoaded ?
                    <div className="playlist-container">
                        <div className="playlist-info">
                            {!playlistImageURL ? 
                                <button className="playlist-image-icon">
                                    <svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="playlist" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 iYxpxA image-icon" fill="black"><path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 eKvNOM change-image"><path d="M17.318 1.975a3.329 3.329 0 1 1 4.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 0 1-1.28-1.28l1.581-4.376a4.726 4.726 0 0 1 1.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 0 0-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 0 0 1.001-.636L20.611 5.268a1.329 1.329 0 0 0 0-1.879z"></path></svg>
                                    <p className="change-image-text">Change Image</p>
                                </button>
                            :
                            <>
                                <p>teste</p>
                                {setCustomImage(true)}
                            </>
                            }
                            <div className="playlist-info-name">
                                <p className="playlist-info-playlist-name">{playlistName}</p>
                                <button><p className="playlist-info-owner-name">{playlistOwnerName}</p></button>
                            </div>
                        </div>
                        <div className="musics-container">
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>
                                <div>
                                    <p>Teste</p>
                                    <p>Teste</p>
                                </div>

                            {playlistMusics.map((music, index) => (
                                <div key={index}>
                                    <p>{music.name}</p>
                                    <p>{music.artist}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                :
                    <div className="playlist-container">
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
            {customImage && 
                    <img className="background-image" src={playlistImageURL}/>
            } 
        </div>
    );
}

export default Playlist;