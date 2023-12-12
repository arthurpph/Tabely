import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MusicStructure } from "../interfaces/musicStructure";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopFile, faPlay } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { addMusicToQueue, setMusic } from "../components/Player";
import { audioDB } from "../App";
import axios from "axios";
import Navbar from "../components/Navbar";
import CustomMenu from "../components/CustomMenu";
import UpdatePlaylistModal from "../components/UpdatePlaylistModal";
import SearchMusicModal from "../components/SearchMusicModal";
import Notification from "../components/Notification";
import DownloadIcon from '../assets/images/DownloadIcon.png';
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
    const [deletePlaylistContextMenuVisible, setDeletePlaylistContextMenuVisible] = useState<boolean>(false);
    const [deletePlaylistContextMenuPosition, setDeletePlaylistContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showUpdatePlaylistModel, setShowUpdatePlaylistModel] = useState<boolean>(false);
    const [showSearchMusicModel, setShowSearchMusicModel] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [addToQueueContextMenuPosition, setAddToQueueContextMenuPosition] = useState({ x: 0, y: 0});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [musicContextMenuVisible, setMusicContextMenuVisible] = useState<boolean[]>(Array(playlistMusics.length).fill(false));
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [musicsDownloaded, setMusicsDownloaded] = useState<boolean[]>(Array(playlistMusics.length).fill(false));
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const handleDeletePlaylistContextMenu = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.preventDefault();
        setDeletePlaylistContextMenuVisible(true);
        setDeletePlaylistContextMenuPosition({ x: e.clientX, y: e.clientY });
    }

    const handleAddToQueueContextMenu = (e: React.MouseEvent<HTMLParagraphElement>, index: number) => {
        e.preventDefault();
        const updatedVisibility = [...musicContextMenuVisible];
        updatedVisibility[index] = true;
        setMusicContextMenuVisible(updatedVisibility);
        setAddToQueueContextMenuPosition({ x: e.clientX, y: e.clientY });
    }

    const closeContextMenu = () => {
        setDeletePlaylistContextMenuVisible(false);
        const temp = [...musicContextMenuVisible];
        temp.fill(false);
        setMusicContextMenuVisible(temp);
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

    const downloadPlaylistMusics = () => {
        playlistMusics.forEach(async (music, index) => {
            const response = await axios.get(music.musicURL, { responseType: 'blob' });
            if(response) {
                await audioDB.addData(music.name, response.data);
                const temp = [...musicsDownloaded];
                temp[index] = true;
                setMusicsDownloaded(temp);
            }
        });
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
            setMusicsDownloaded(Array(playlistData.musics.length).fill(false));

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
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
      
        window.addEventListener('resize', handleResize);

        getPlaylistInfo();
      
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const temp = [...musicsDownloaded];
        playlistMusics.forEach(async (music, index) => {
            const response = await audioDB.checkIfKeyExists(music.name);
            if(response) {
                temp[index] = true;
            }
        });

        setMusicsDownloaded(temp);
    }, [playlistMusics]);

    return (
        <div>
            <Navbar/>
                {IsPlaylistLoaded ?
                    <div className="playlist-container" onClick={closeContextMenu}>
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
                                    <img src={playlistImageURL} alt="Playlist Image" id="playlist-image" onClick={handleChangeImageClick}/>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileSubmit}
                                        accept="image/*"
                                    />
                                </>
                            }
                            <div className="playlist-info-name">
                                <div>
                                    <p 
                                        className="playlist-info-playlist-name" 
                                        style={{ cursor: 'pointer' }} 
                                        onContextMenu={handleDeletePlaylistContextMenu} 
                                        onClick={() => setShowUpdatePlaylistModel(true)}
                                    >
                                        {playlistName}
                                    </p>
                                    {windowWidth <= 600 && <svg onClick={deletePlaylist} fill="#000000" version="1.1" id="Capa_1" className="trash-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408.483 408.483"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316 H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293 c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329 c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355 c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356 c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"></path> <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916 c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"></path> </g> </g> </g></svg>}
                                </div>
                                <CustomMenu contextMenuVisible={deletePlaylistContextMenuVisible} contextMenuPosition={deletePlaylistContextMenuPosition} menuItems={[{ text: 'Delete Playlist', function: deletePlaylist }]}/>
                                <button className="playlist-info-owner-name-button" onClick={() => navigate(`/user?userId=${playlistOwnerId}`)}><p className="playlist-info-owner-name">{playlistOwnerName}</p></button>
                                {musicsDownloaded.every(boolean => boolean === true) ?
                                    <svg style={{ width: '2rem' }} className="playlist-downloaded" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M31.667 45.024V18.024" stroke="#426AB2"></path> <path d="M22.667 39.024L31.667 45.024L40.666 39.024" stroke="#426AB2"></path> <path d="M31.667 58.191C46.3948 58.191 58.334 46.2518 58.334 31.5241C58.334 16.7963 46.3948 4.85706 31.667 4.85706C16.9392 4.85706 5 16.7963 5 31.5241C5 46.2518 16.9392 58.191 31.667 58.191Z" stroke="#000000"></path> </g></svg>
                                :
                                    <button className="musicdownload" onClick={downloadPlaylistMusics}>
                                        <img src={DownloadIcon}/>
                                    </button>
                                }
                            </div>
                        </div>
                        <button id="add-music-button" onClick={() => setShowSearchMusicModel(true)}>Add Music</button>
                        <div className="musics-container">
                            {playlistMusics.map((music, index) => (
                                <div key={index} onContextMenu={(e) => handleAddToQueueContextMenu(e, index)} className="music-container">
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
                                        {musicsDownloaded[index] ?
                                            <div>
                                                <svg style={{ minWidth: '1.5rem', width: '1.5rem' }} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M31.667 45.024V18.024" stroke="#426AB2"></path> <path d="M22.667 39.024L31.667 45.024L40.666 39.024" stroke="#426AB2"></path> <path d="M31.667 58.191C46.3948 58.191 58.334 46.2518 58.334 31.5241C58.334 16.7963 46.3948 4.85706 31.667 4.85706C16.9392 4.85706 5 16.7963 5 31.5241C5 46.2518 16.9392 58.191 31.667 58.191Z" stroke="#000000"></path> </g></svg>
                                                <span>{music.artist}</span>
                                            </div>
                                        :
                                            <span>{music.artist}</span>
                                        }  
                                    </div>
                                    {windowWidth <= 600 && <svg onClick={() => { addMusicToQueue(music); setShowNotification(true)} } data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dCszzJ add-to-queue"><path d="M16 15H2v-1.5h14V15zm0-4.5H2V9h14v1.5zm-8.034-6A5.484 5.484 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2H7.966zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2h2z"></path></svg>}
                                    <CustomMenu contextMenuVisible={musicContextMenuVisible[index]} contextMenuPosition={addToQueueContextMenuPosition} menuItems={[{ text: 'Add to Queue', function: () => { addMusicToQueue(music); setShowNotification(true) } }]} />
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
            
            <Notification text={'Added to Queue'} showNotification={showNotification} setShowNotification={setShowNotification} />
            <UpdatePlaylistModal showUpdatePlaylistModal={showUpdatePlaylistModel} setShowUpdatePlaylistModal={setShowUpdatePlaylistModel} setPlaylistName={setPlaylistName}/>
            <SearchMusicModal showSearchMusicModal={showSearchMusicModel} setShowSearchMusicModal={setShowSearchMusicModel} getPlaylistInfo={getPlaylistInfo}/>
        </div>
    );
}

export default Playlist;