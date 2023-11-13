import { useState, useEffect } from 'react';
import { MusicStructure, setMusic } from './Player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../assets/styles/MainBottom.css'

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
        const music = musics[index];
        setMusic(music);
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
                {musics?.map((music, index) => (
                    <div className='music' key={music.name + index}>
                        <img src={music.imageURL} alt={`Music ${music.name}`} style={{ opacity: highlightedIndex === index ? 0.2 : 1 }} className='musicimagemainbottom' onMouseEnter={() => reproductionIconMouseEnter(index)} onMouseLeave={() => reproductionIconMouseLeave()}/>
                        <FontAwesomeIcon icon={faPlay} size="4x" style={{ position: 'relative', bottom: '6rem', opacity: highlightedIndex === index ? 1 : 0, }} className={`reproductionicon${index}`} onMouseEnter={() => reproductionIconMouseEnter(index)} onMouseLeave={() => reproductionIconMouseLeave()} onClick={() => musicReproduction(index)} key={index}/>
                        <h3>{music.name}</h3>
                        <p>{music.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainBottom;