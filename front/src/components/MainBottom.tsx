import { useState, useEffect } from 'react';
import { setMusic } from './Player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { audioDB } from '../App';
import { MusicStructure } from '../interfaces/musicStructure';
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
                {musics?.map((music, index) => (
                    <div className='music' key={music.name + index}>
                        <img src={music.imageURL} alt={`Music ${music.name}`} style={{ opacity: highlightedIndex === index ? 0.2 : 1 }} className='musicimagemainbottom' onMouseEnter={() => reproductionIconMouseEnter(index)} onMouseLeave={() => reproductionIconMouseLeave()}/>
                        <FontAwesomeIcon icon={faPlay} size="4x" style={{ position: 'relative', bottom: '6rem', opacity: highlightedIndex === index ? 1 : 0, }} className={`reproductionicon${index}`} onMouseEnter={() => reproductionIconMouseEnter(index)} onMouseLeave={() => reproductionIconMouseLeave()} onClick={() => musicReproduction(index)} key={index}/>
                        <h3>{music.name}</h3>
                        <p>{music.artist}</p>
                        <button className="musicdownload" onClick={() => downloadMusic(music.name, music.musicURL)}>Download</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainBottom;