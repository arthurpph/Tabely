import { useState, ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../assets/styles/ModalComponent.css';

interface ModalProps {
    showModal: boolean;
    handleModalClose: () => void;
}

function ModalComponent(props: ModalProps) {
    const { showModal, handleModalClose } = props;

    const [inputValue, setInputValue] = useState<string>('');
    const [validationValue, setValidationValue] = useState<string>('');

    const resetValues = (): void => {
        setInputValue('');
        setValidationValue('');
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSubmit = (): void => {
        if(inputValue.trim() === '') {
            setValidationValue("Please enter a correct value");
            return;
        }

        resetValues();
        handleModalClose();
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