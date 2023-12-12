import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaylistStructure } from '../interfaces/playlistStructure';
import { decodeToken } from '../helpers/decodeToken';
import axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas';
import CreatePlaylistModal from './CreatePlaylistModal';
import '../assets/styles/LibraryOffCanvas.css';
import DownloadedSongsModal from './DownloadedSongsModal';

interface LibraryOffCanvasProps {
    showLibrary: boolean;
    handleLibraryClose: () => void;
    showModal: boolean;
    handleModalClose: () => void;
    handleModalOpen: () => void;
}

function LibraryOffCanvas(props: LibraryOffCanvasProps) {
    const { showLibrary, handleLibraryClose, showModal, handleModalClose, handleModalOpen } = props;

    const [playlists, setPlaylists] = useState<PlaylistStructure[]>([]);
    const [showDownloadedSongsModal, setShowDownloadedSongsModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const getUserPlaylists = async (): Promise<void> => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/playlists?email=${decodeToken('', 'loginToken').email}`);
        const data = response.data;
        setPlaylists(data);
    }

    useEffect(() => {
        getUserPlaylists();
    }, [showLibrary]);

    return (
        <div className="modal show">
            <Offcanvas show={showLibrary} onHide={handleLibraryClose} placement="start" className="offcanvas">
                <Offcanvas.Header className="library-offcanvas-header">
                    <Offcanvas.Title>Library</Offcanvas.Title>
                    <button style={{ background: 'transparent'}} onClick={handleModalClose}><svg style={{ width: '1.5rem', height: '1rem' }} fill="#FFFFFF" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460.775 460.775"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg></button>
                </Offcanvas.Header>
                <Offcanvas.Body className='library-offcanvas'>
                    <div className="playlist-section">
                        {playlists.map((playlist, index) => (
                            <div className="playlist" key={index} style={{ cursor: 'pointer' }} onClick={() => {
                                    navigate('/');
                                    setTimeout(() => {
                                        navigate(`/playlist?playlistId=${playlist._id}`);
                                    }, 0.1)
                                }
                            }>
                                {playlist.imageURL ?
                                    <img src={playlist.imageURL} alt="Playlist Image"/>
                                :
                                    <button>
                                        <svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="playlist" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 iYxpxA" fill="black"><path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                                    </button>
                                }
                                <div className="playlist-info-offcanvas">
                                    <h5>{playlist.name}</h5>
                                    <span>Playlist</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {playlists.length === 0 ? 
                        <div className="create-a-playlist">
                            <p>You don't have any playlist</p>
                            <button className="create-new-playlist-button" onClick={handleModalOpen}>Create a playlist</button>
                        </div>
                    :
                        <div className="create-new-playlist">
                            <button className='downloaded-songs-button' onClick={() => setShowDownloadedSongsModal(true)}>Downloaded Songs</button>
                            <button className="create-new-playlist-button" onClick={handleModalOpen}>Create new playlist</button>
                        </div>
                    }
                </Offcanvas.Body>
            </Offcanvas>
            <CreatePlaylistModal showModal={showModal} handleModalClose={handleModalClose} />
            <DownloadedSongsModal showModal={showDownloadedSongsModal} setShowModal={setShowDownloadedSongsModal}/>
        </div>
    );
}

export default LibraryOffCanvas;