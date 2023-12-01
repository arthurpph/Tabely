import { useState } from 'react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { audioDB } from '../App';
import { MusicStructure } from '../interfaces/musicStructure';
import axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas';
import DownloadIcon from '../assets/images/DownloadIcon.png';
import '../assets/styles/QueueOffCanvas.css';

interface QueueOffCanvasProps {
    showQueue: boolean;
    handleClose: () => void;
    queue: MusicStructure[];
    setMusic: (music: MusicStructure) => void;
    changeQueue: (index: number) => void;
}

function QueueOffCanvas(props: QueueOffCanvasProps) {
    const { showQueue, handleClose, queue, setMusic, changeQueue } = props;

    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const reproductionIconMouseEnter = (index: number) => {
        setHighlightedIndex(index);
    }

    const reproductionIconMouseLeave = () => {
        setHighlightedIndex(-1);
    }

    const downloadMusicOnIndexedDB = async (musicName: string, musicURL: string) => {
        try {
            const response = await axios.get(musicURL, { responseType: 'blob' });
            await audioDB.addData(musicName, response.data);
        } catch (err) {
            console.log('Error: ' + err);
        }
    }

    return (
        <Offcanvas show={showQueue} onHide={handleClose} placement="end" className="offcanvas">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Queue</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="queue-container">
                    {queue.map((music, index) => (
                        <div key={index}>
                            {index + 1}
                            <img 
                                src={music.imageURL} 
                                alt={`Music Image ${index}`}
                                style={{ opacity: highlightedIndex === index ? 0.2 : 1, transition: 'opacity 0.4s ease' }} 
                                onMouseEnter={() => reproductionIconMouseEnter(index)} 
                                onMouseLeave={() => reproductionIconMouseLeave()}
                                onClick={() => {
                                    setMusic(music);
                                    changeQueue(index + 1);
                                }} 
                            />
                            <FontAwesomeIcon 
                                icon={faPlay} 
                                size="2x" 
                                style={{ position: 'relative', bottom: '5rem', opacity: highlightedIndex === index ? 1 : 0, transition: 'opacity 0.4s ease' }}
                                className='reproductioniconqueue'
                                onMouseEnter={() => reproductionIconMouseEnter(index)} 
                                onMouseLeave={() => reproductionIconMouseLeave()}
                                onClick={() => {
                                    setMusic(music);
                                    changeQueue(index + 1);
                                }}
                                key={index}
                            />
                            {music.name}
                            <div className="musicdownload-container">
                                <button className="musicdownload" onClick={() => downloadMusicOnIndexedDB(music.name, music.musicURL)}>
                                    <img src={DownloadIcon}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default QueueOffCanvas;