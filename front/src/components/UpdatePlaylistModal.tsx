import { useState, ChangeEvent } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import '../assets/styles/UpdatePlaylistModal.css';

interface UpdatePlaylistModalProps {
    showUpdatePlaylistModal: boolean;
    setShowUpdatePlaylistModal: any;
    setPlaylistName: any;
}

function UpdatePlaylistModal(props: UpdatePlaylistModalProps) {
    const { showUpdatePlaylistModal, setShowUpdatePlaylistModal, setPlaylistName } = props;

    const [inputValue, setInputValue] = useState<string>('');
    const [validationValue, setValidationValue] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = async () => {
        if(inputValue.trim() === '') {
            setValidationValue('Please enter a correct value');
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const playlistId = params.get('playlistId');

        await axios.put(`${import.meta.env.VITE_API_URL}/playlist`, {
            playlistId: playlistId,
            playlistName: inputValue
        });

        setPlaylistName(inputValue);

        setInputValue('');
        setShowUpdatePlaylistModal(false);
    }

    return (
        <Modal show={showUpdatePlaylistModal} onHide={() => {
            setInputValue('');
            setShowUpdatePlaylistModal(false);
        }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Update Playlist Name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='update-playlist-modal-body'>
                <input type="text" placeholder="Enter the new playlist name" onChange={handleInputChange}/>
            </Modal.Body>
            <Modal.Footer>
                <span>{validationValue}</span>
                <Button variant="primary" onClick={handleSubmit}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdatePlaylistModal;