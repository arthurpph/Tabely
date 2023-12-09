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
                <Offcanvas.Header className="library-offcanvas-header" closeButton>
                    <Offcanvas.Title>Library</Offcanvas.Title>
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