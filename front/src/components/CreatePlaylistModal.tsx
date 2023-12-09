import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../helpers/decodeToken';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../assets/styles/CreatePlaylistModal.css';

interface ModalProps {
    showModal: boolean;
    handleModalClose: () => void;
}

function ModalComponent(props: ModalProps) {
    const { showModal, handleModalClose } = props;

    const [inputValue, setInputValue] = useState<string>('');
    const [validationValue, setValidationValue] = useState<string>('');
    const navigate = useNavigate();

    const resetValues = (): void => {
        setInputValue('');
        setValidationValue('');
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = async (): Promise<void> => {
        if(inputValue.trim() === '') {
            setValidationValue("Please enter a correct value");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/playlist`, {
                name: inputValue,
                ownerId: decodeToken('', 'loginToken').id
            });
            navigate('/');
            setTimeout(() => navigate(`/playlist?playlistId=${response.data.playlistId}`), 1);
        } catch (err) {
            console.error(err);
        } finally {
            resetValues();
            handleModalClose();
        }
    }

    return (
        <Modal show={showModal} onHide={() => {
            resetValues();
            handleModalClose();
        }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create a Playlist
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="text" placeholder="Enter playlist name" onChange={handleInputChange}/>
            </Modal.Body>
            <Modal.Footer>
                <span>{validationValue}</span>
                <Button variant="primary" onClick={handleSubmit}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalComponent;