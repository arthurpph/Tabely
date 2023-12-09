import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MusicStructure } from "../interfaces/musicStructure";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { setMusic } from "../components/Player";
import axios from "axios";
import Navbar from "../components/Navbar";
import CustomMenu from "../components/CustomMenu";
import UpdatePlaylistModal from "../components/UpdatePlaylistModal";
import SearchMusicModal from "../components/SearchMusicModal";
import "../assets/styles/Playlist.css"

function Playlist() {
    const [IsPlaylistLoaded, setIsPlaylistLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [playlistId, setPlaylistId] = useState<string | null>('');
    const [playlistName, setPlaylistName] = useState<string>('');
    const [playlistOwnerName, setPlaylistOwnerName] = useState<string>('');
    const [playlistOwnerId, setPlaylistOwnerId] = useState<string>('');
    const [playlistMusics, setPlaylistMusics] = useState<MusicStructure[]>([]);
    const [playlistImageURL, setPlaylistImageURL] = useState<string>('');
    const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showUpdatePlaylistModel, setShowUpdatePlaylistModel] = useState<boolean>(false);
    const [showSearchMusicModel, setShowSearchMusicModel] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const handleContextMenu = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.preventDefault();
        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
    }

    const deletePlaylist = async () => {
        if(confirm('You want to delete this playlist?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/playlist?playlistId=${playlistId}`);
                navigate('/');
            } catch (err) {
                console.error(err);
            }
        }
    }

    const handleChangeImageClick = () => {
        const fileInput = fileInputRef.current;
        fileInput?.click();
    }

    const handleFileSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
        setIsPlaylistLoaded(false)
        const params = new URLSearchParams(window.location.search);
        const playlistId = params.get('playlistId');

        if(e.target.files?.[0]) {
            const formData = new FormData();
            formData.append('image', e.target.files?.[0])

            await axios.post(`${import.meta.env.VITE_API_URL}/playlist/image?playlistId=${playlistId}`, formData);

            window.location.href = `/playlist?playlistId=${playlistId}`;
        }
        setIsPlaylistLoaded(true);
    }

    const getPlaylistInfo = async (): Promise<void> => {
        try {
            setIsPlaylistLoaded(false);
            const params = new URLSearchParams(window.location.search);
            const playlistId = params.get('playlistId');

            const playlist = await axios.get(`${import.meta.env.VITE_API_URL}/playlist?playlistId=${playlistId}`);
            const playlistData = playlist.data;

            setPlaylistId(playlistId);
            setPlaylistName(playlistData.name);
            setPlaylistMusics(playlistData.musics);
            setPlaylistImageURL(playlistData.imageURL);

            const user = await axios.get(`${import.meta.env.VITE_API_URL}/user/${playlistData.ownerId}`);
            const userData = user.data;

            setPlaylistOwnerName(userData.name);
            setPlaylistOwnerId(userData.id);
            setIsPlaylistLoaded(true);
        } catch (err) {
            setIsError(true);
            console.error(err);
        }
    }

    useEffect(() => {
        getPlaylistInfo();
    }, [])

    return (
        <div onClick={() => setContextMenuVisible(false)}>
            <Navbar/>
                {IsPlaylistLoaded ?
                    <div className="playlist-container">
                        <div className="playlist-info">
                            {!playlistImageURL ? 
                                <button className="playlist-image-icon" onClick={handleChangeImageClick}>
                                    <svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="playlist" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 iYxpxA image-icon" fill="black"><path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 eKvNOM change-image"><path d="M17.318 1.975a3.329 3.329 0 1 1 4.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 0 1-1.28-1.28l1.581-4.376a4.726 4.726 0 0 1 1.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 0 0-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 0 0 1.001-.636L20.611 5.268a1.329 1.329 0 0 0 0-1.879z"></path></svg>
                                    <p className="change-image-text">Change Image</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileSubmit}
                                        accept="image/*"
                                    />
                                </button>
                            :
                            <>
                                <img src={playlistImageURL} alt="Playlist Image" id="playlist-image"/>
                            </>
                            }
                            <div className="playlist-info-name">
                                <p className="playlist-info-playlist-name" style={{ cursor: 'pointer' }} onContextMenu={handleContextMenu} onClick={() => setShowUpdatePlaylistModel(true)}>{playlistName}</p>
                                <CustomMenu contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition} menuItems={[{ text: 'Delete Playlist', function: deletePlaylist }]}/>
                                <button onClick={() => navigate(`/user?userId=${playlistOwnerId}`)}><p className="playlist-info-owner-name">{playlistOwnerName}</p></button>
                            </div>
                        </div>
                        <button id="add-music-button" onClick={() => setShowSearchMusicModel(true)}>Add Music</button>
                        <div className="musics-container">
                            {playlistMusics.map((music, index) => (
                                <div key={index}>
                                    <span className="counter">{index + 1}</span>
                                    <img 
                                        src={music.imageURL} 
                                        alt={`Music Image ${index}`} 
                                        style={{ opacity: highlightedIndex === index ? 0.2 : 1, transition: 'opacity 0.4s ease', cursor: 'pointer' }}
                                        onMouseEnter={() => setHighlightedIndex(index)} 
                                        onMouseLeave={() => setHighlightedIndex(-1)}
                                        onClick={() => {
                                            setMusic(music, playlistMusics, playlistName);
                                        }}
                                    />
                                    <FontAwesomeIcon 
                                        icon={faPlay} 
                                        size="2x" 
                                        style={{ position: 'relative', right: '3.7rem' , opacity: highlightedIndex === index ? 1 : 0, transition: 'opacity 0.4s ease', cursor: 'pointer' }} 
                                        className={`reproductionicon${index}`} 
                                        onMouseEnter={() => setHighlightedIndex(index)} 
                                        onMouseLeave={() => setHighlightedIndex(-1)}
                                        onClick={() => {
                                            setMusic(music, playlistMusics, playlistName);
                                        }}
                                        key={index}
                                    />
                                    <div>
                                        <p>{music.name}</p>
                                        <span>{music.artist}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                :
                    <>
                        {isError ? 
                            <div className="playlist-container">
                                Playlist doesn't exist
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
                        
                    </>
                    
                      
                }

            {playlistImageURL && 
                <img className="background-image" src={playlistImageURL}/>
            }

            <UpdatePlaylistModal showUpdatePlaylistModal={showUpdatePlaylistModel} setShowUpdatePlaylistModal={setShowUpdatePlaylistModel} setPlaylistName={setPlaylistName}/>
            <SearchMusicModal showSearchMusicModal={showSearchMusicModel} setShowSearchMusicModal={setShowSearchMusicModel} getPlaylistInfo={getPlaylistInfo}/>
        </div>
    );
}

export default Playlist;