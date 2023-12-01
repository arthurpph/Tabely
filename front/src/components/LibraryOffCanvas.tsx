import Offcanvas from 'react-bootstrap/Offcanvas'
import '../assets/styles/LibraryOffCanvas.css'
import ModalComponent from './ModalComponent';

interface LibraryOffCanvasProps {
    showLibrary: boolean;
    handleLibraryClose: () => void;
    showModal: boolean;
    handleModalClose: () => void;
    handleModalOpen: () => void;
}

function LibraryOffCanvas(props: LibraryOffCanvasProps) {
    const { showLibrary, handleLibraryClose, showModal, handleModalClose, handleModalOpen } = props;

    return (
        <div className="modal show">
            <Offcanvas show={showLibrary} onHide={handleLibraryClose} placement="start" className="offcanvas">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Library</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='library-offcanvas'>
                    <p>You don't have any playlist</p>
                    <button onClick={handleModalOpen}>Create a playlist</button>
                </Offcanvas.Body>
            </Offcanvas>
            <ModalComponent showModal={showModal} handleModalClose={handleModalClose} />
        </div>
    );
}

export default LibraryOffCanvas;