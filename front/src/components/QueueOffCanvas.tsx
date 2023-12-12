import { useEffect, useState } from 'react';
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
    currentPlaylist: string | null;
}

function QueueOffCanvas(props: QueueOffCanvasProps) {
    const { showQueue, handleClose, queue, setMusic, changeQueue, currentPlaylist } = props;

    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [musicsDownloaded, setMusicsDownloaded] = useState<boolean[]>(Array(queue.length).fill(false));

    const reproductionIconMouseEnter = (index: number) => {
        setHighlightedIndex(index);
    }

    const reproductionIconMouseLeave = () => {
        setHighlightedIndex(-1);
    }

    /*const downloadMusicOnIndexedDB = async (musicName: string, musicURL: string) => {
        try {
            const response = await axios.get(musicURL, { responseType: 'blob' });
            await audioDB.addData(musicName, response.data);
        } catch (err) {
            console.log('Error: ' + err);
        }
    }*/

    useEffect(() => {
        const updateDownloadedStatus = async () => {
            const temp = [...musicsDownloaded];
        
            for(let [index, music] of queue.entries()) {
                const response = await audioDB.checkIfKeyExists(music.name);
                temp[index] = !!response; 
            }
        
            setMusicsDownloaded(temp);
        };
        
        updateDownloadedStatus();
    }, [queue]);

    return (
        <Offcanvas show={showQueue} onHide={handleClose} placement="end" className="offcanvas">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Queue</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="queue-container">
                    {currentPlaylist && 
                        <h5>Playing: {currentPlaylist}</h5>
                    }
                    {queue.map((music, index) => (
                        <div key={index}>
                            {index + 1}
                            <div className='queue-container-image'>
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
                                <div className='reproductionicon-container'>
                                    <FontAwesomeIcon 
                                        icon={faPlay} 
                                        size="2x" 
                                        style={{ opacity: highlightedIndex === index ? 1 : 0, transition: 'opacity 0.4s ease' }}
                                        className='reproductioniconqueue'
                                        onMouseEnter={() => reproductionIconMouseEnter(index)} 
                                        onMouseLeave={() => reproductionIconMouseLeave()}
                                        onClick={() => {
                                            setMusic(music);
                                            changeQueue(index + 1);
                                        }}
                                        key={index}
                                    />
                                </div>
                            </div>
                            <p>
                                {musicsDownloaded[index] &&                             
                                    <svg style={{ minWidth: '1.2rem', width: '1.2rem' }} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M31.667 45.024V18.024" stroke="#426AB2"></path> <path d="M22.667 39.024L31.667 45.024L40.666 39.024" stroke="#426AB2"></path> <path d="M31.667 58.191C46.3948 58.191 58.334 46.2518 58.334 31.5241C58.334 16.7963 46.3948 4.85706 31.667 4.85706C16.9392 4.85706 5 16.7963 5 31.5241C5 46.2518 16.9392 58.191 31.667 58.191Z" stroke="#000000"></path> </g></svg>
                                }
                                {music.name}
                            </p>
                        </div>
                    ))}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default QueueOffCanvas;