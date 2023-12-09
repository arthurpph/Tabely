import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { audioDB } from "../App";
import '../assets/styles/DownloadedSongs.css';

interface DownloadedSongsModalProps {
    showModal: boolean;
    setShowModal: any;
}

function DownloadedSongsModal(props: DownloadedSongsModalProps) {
    const { showModal, setShowModal } = props;

    const [downloadedSongs, setDownloadedSongs] = useState<string[]>([]);

    const getAllDownloadedSongs = async () => {
        const downloadedSongsResponse = await audioDB.getAllKeys();
        setDownloadedSongs(downloadedSongsResponse);
    }

    const handleDeleteSong = async (key: string) => {
        if(confirm('You sure you want to delete this song?')) {
            await audioDB.deleteKey(key);
            await getAllDownloadedSongs();
        }
    }

    useEffect(() => {
        getAllDownloadedSongs();
    }, []);

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Downloaded Songs
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {downloadedSongs.map((song, index) => (
                    <div className="downloadedSong" key={index}>
                        <svg onClick={() => handleDeleteSong(song)} style={{ color: "red", cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="red"></path> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="red"></path> </svg>
                        <h6>{song}</h6>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

export default DownloadedSongsModal;