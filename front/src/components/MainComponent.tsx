import { useState, useEffect } from 'react';
import { setMusic } from './Player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { audioDB } from '../App';
import { MusicStructure } from '../interfaces/musicStructure';
import axios from 'axios';
import '../assets/styles/MainComponent.css'

function MainBottom() {
    const [musics, setMusics] = useState<MusicStructure[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const reproductionIconMouseEnter = (index: number) => {
        setHighlightedIndex(index);
    }

    const reproductionIconMouseLeave = () => {
        setHighlightedIndex(-1);
    }

    const musicReproduction = (index: number) => {
        setMusic(musics[index]);
    }

    const downloadMusic = async (musicName: string, musicURL: string) => {
        try {
            const response = await axios.get(musicURL, { responseType: 'blob' });
            await audioDB.addData(musicName, response.data);
        } catch (err) {
            console.log('Error: ' + err);
        }
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
        }
    
        loadMusics();
    }, []);

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }} className='mainbottom'>
            <div className='musicstab'>
                <p>Songs available</p>
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
                            <h3>{music.name}</h3>
                            <p>{music.artist}</p>
                            {/* <button className="musicdownload" onClick={() => downloadMusic(music.name, music.musicURL)}>Download</button>*/}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainBottom;