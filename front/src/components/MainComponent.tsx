import { useState, useEffect } from 'react';
import { setMusic } from './Player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { MusicStructure } from '../interfaces/musicStructure';
import { PlaylistStructure } from '../interfaces/playlistStructure';
import { decodeToken } from '../helpers/decodeToken';
import axios from 'axios';
import CustomMenu from './CustomMenu';
import '../assets/styles/MainComponent.css'

function MainBottom() {
    const [isMusicsLoaded, setIsMusicsLoaded] = useState<boolean>(false);
    const [musics, setMusics] = useState<MusicStructure[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [playlists, setPlaylists] = useState<PlaylistStructure[]>([]);

    const reproductionIconMouseEnter = (index: number) => {
        setHighlightedIndex(index);
    }

    const reproductionIconMouseLeave = () => {
        setHighlightedIndex(-1);
    }

    const musicReproduction = (index: number) => {
        setMusic(musics[index]);
    }

    const handleContextMenu = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.preventDefault();
        setContextMenuVisible(true);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
    }

    useEffect(() => {
        const loadMusics = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/musics`);
            const musicsData: MusicStructure[] = response.data;
            
            const allMusics: MusicStructure[] = [];
        
            musicsData.forEach(music => {
                allMusics.push({
                    name: music.name,
                    artist: music.artist,
                    imageURL: music.imageURL,
                    musicURL: music.musicURL,
                    duration: music.duration
                });
            });
        
            setMusics(allMusics);
            setIsMusicsLoaded(true);
        }

        const getUserPlaylists = async (): Promise<void> => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/playlists?email=${decodeToken('', 'loginToken').email}`);
            const data = response.data;
            console.log(data)
            setPlaylists(data);
        }
    
        loadMusics();
        getUserPlaylists();
    }, []);

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }} className='mainbottom' onClick={() => setContextMenuVisible(false)}>
            <div className='musicstab'>
                <p>Songs available</p>
                {isMusicsLoaded ?
                    <div className='musicsdisplay'>
                        {musics?.map((music, index) => (
                            <div className='music' key={music.name + index}>
                                <img 
                                    src={music.imageURL} 
                                    alt={`Music ${music.name}`} 
                                    style={{ opacity: highlightedIndex === index ? 0.2 : 1, transition: 'opacity 0.4s ease' }} 
                                    className='music_image_main_bottom' 
                                    onMouseEnter={() => reproductionIconMouseEnter(index)} 
                                    onMouseLeave={() => reproductionIconMouseLeave()}
                                    onClick={() => musicReproduction(index)}
                                    onContextMenu={handleContextMenu}
                                />
                                <FontAwesomeIcon 
                                    icon={faPlay} 
                                    size="2x" 
                                    style={{ position: 'relative', bottom: '5rem', opacity: highlightedIndex === index ? 1 : 0, transition: 'opacity 0.4s ease' }} 
                                    className={`reproductionicon${index}`} 
                                    onMouseEnter={() => reproductionIconMouseEnter(index)} 
                                    onMouseLeave={() => reproductionIconMouseLeave()}
                                    onClick={() => musicReproduction(index)} 
                                    key={index}
                                />
                                    <CustomMenu contextMenuVisible={contextMenuVisible} contextMenuPosition={contextMenuPosition} menuItems={[{ text: 'Add to Playlist', subMenu: playlists.map(playlist => ({ text: playlist.name }) )}]} />
                                <h3>{music.name}</h3>
                                <p>{music.artist}</p>
                            </div>
                        ))}
                    </div>
                : 
                    <TailSpin
                        height="80"
                        width="80"
                        color="#808080"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                }
            </div>
        </div>
    );
}

export default MainBottom;