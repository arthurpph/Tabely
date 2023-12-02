import { useState, useEffect } from 'react';
import { PlaylistStructure } from '../interfaces/playlistStructure';
import { decodeToken } from '../helpers/decodeToken';
import axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas'
import ModalComponent from './ModalComponent';
import '../assets/styles/LibraryOffCanvas.css'

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
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Library</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='library-offcanvas'>
                    {playlists.map((playlist, index) => (
                            <div key={index}>
                                <p>{playlist.name}</p>
                                <span>Playlist</span>
                            </div>
                    ))}
                    {playlists.length === 0 && 
                        <div className="create-a-playlist">
                            <p>You don't have any playlist</p>
                            <button onClick={handleModalOpen}>Create a playlist</button>
                        </div>
                    }
                </Offcanvas.Body>
            </Offcanvas>
            <ModalComponent showModal={showModal} handleModalClose={handleModalClose} />
        </div>
    );
}

export default LibraryOffCanvas;