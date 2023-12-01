import Offcanvas from 'react-bootstrap/Offcanvas'

interface LibraryOffCanvasProps {
    showLibrary: boolean;
    handleClose: () => void;
}

function LibraryOffCanvas(props: LibraryOffCanvasProps) {
    const { showLibrary, handleClose } = props;

    return (
        <Offcanvas show={showLibrary} onHide={handleClose} placement="start" className="offcanvas">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Library</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default LibraryOffCanvas;