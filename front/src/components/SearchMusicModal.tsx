import { useEffect, useState } from 'react';
import { MusicStructure } from '../interfaces/musicStructure';
import { TailSpin } from 'react-loader-spinner';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../assets/styles/SearchMusicModel.css';

interface SearchMusicModalProps {
    showSearchMusicModal: boolean;
    setShowSearchMusicModal: any;
    getPlaylistInfo: () => void;
}

function SearchMusicModal(props: SearchMusicModalProps) {
    const { showSearchMusicModal, setShowSearchMusicModal, getPlaylistInfo } = props;
    
    const [search, setSearch] = useState<string>('');
    const [musics, setMusics] = useState<MusicStructure[]>([]);
    const [loadingIndex, setLoadingIndex] = useState<number>(-1);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const addPlaylistMusic = async (index: number, music: MusicStructure) => {
        const params = new URLSearchParams(window.location.search);
        const playlistId = params.get('playlistId');

        try {
            setLoadingIndex(index);

            await axios.put(`${import.meta.env.VITE_API_URL}/playlist/music`, {
                playlistId: playlistId,
                music: music
            });
            
            setShowSearchMusicModal(false);
            setSearch('');
            setLoadingIndex(-1);

            getPlaylistInfo();
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const getMusics = async (): Promise<void> => {
            try {
                const musics = await axios.get(`${import.meta.env.VITE_API_URL}/musics`);
                const data = musics.data;
                setMusics(data);
            } catch (err) {
                console.error(err);
            }
        }

        getMusics();
    }, [])

    return (
        <Modal show={showSearchMusicModal} onHide={() => {
            setShowSearchMusicModal(false);
            setSearch('');
        }}>
            <Modal.Header closeButton className='search-music-modal-header'>
                <Modal.Title className='search-music-modal-title'>
                    <input type="text" placeholder='Enter music name' onChange={(e) => setSearch(e.target.value)}/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='search-music-modal-body'>
                {musics.filter((music) => {
                    return search.toLowerCase() === '' 
                    ? music
                    : music.name.toLowerCase().includes(search);
                }).map((music, index) => {
                    return (
                        <div key={index}>
                            <img 
                                src={music.imageURL} 
                                alt="Music Image"
                                onMouseEnter={() => setHighlightedIndex(index)}
                                onMouseLeave={() => setHighlightedIndex(-1)}
                                onClick={() => addPlaylistMusic(index, music)} 
                                style={{ transition: 'opacity 0.2s ease-in-out', opacity: loadingIndex === index ? '0.2' : highlightedIndex === index ? '0.4' : '1' }}
                            />
                            <TailSpin
                                height="50"
                                width="50"
                                color="black"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                wrapperStyle={{ position: 'absolute', left: '-27px' }}
                                wrapperClass=""
                                visible={loadingIndex === index}
                            />
                            <div>
                                <span className='search-music-modal-music-name'>{music.name}</span>
                                <span className='reduced-font-size'>{music.artist}</span>
                                <span className='reduced-font-size'>{music.duration}</span>
                            </div>
                        </div>
                    )
                })}
            </Modal.Body>
        </Modal>
    );
}

export default SearchMusicModal;