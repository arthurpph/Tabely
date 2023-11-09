import { useState, useEffect } from 'react';
import { MusicStructure, setMusic } from './Player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../assets/styles/MainBottom.css'

function MainBottom() {
    const [musics, setMusics] = useState<MusicStructure[]>([]);
    const [isReproductionIconHovered, setIsReproductionIconHovered] = useState<boolean>(false);
    const [isMusicImageHovered, setIsMusicImageHovered] = useState<boolean>(false);
    //let musicCounter: number = 0;

    const reproductionIconMouseEnter = () => {
        setIsReproductionIconHovered(true);
    }

    const reproductionIconMouseLeave = () => {
        setIsReproductionIconHovered(false);
    }

    const musicImageMouseEnter = () => {
        setIsMusicImageHovered(true);
    }

    const musicImageMouseLeave = () => {
        setIsMusicImageHovered(false);
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
    }, [])

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }} className='mainbottom'>
            <div className='musicstab'>
                {musics?.map((music, index) => {
                    //musicCounter++
                    //if(musicCounter === 4) {
                        return (
                            <div className='music' key={music.name + index}>
                                <img src={music.imageURL} alt={`Music ${index}`} style={{ opacity: isReproductionIconHovered || isMusicImageHovered ? 0.2 : 1 }} className='musicimagemainbottom' onMouseEnter={musicImageMouseEnter} onMouseLeave={musicImageMouseLeave}/>
                                <FontAwesomeIcon icon={faPlay} size="4x" style={{ position: 'relative', bottom: '6rem', opacity: isReproductionIconHovered || isMusicImageHovered ? 1 : 0, }} className='reproductionicon' onMouseEnter={reproductionIconMouseEnter} onMouseLeave={reproductionIconMouseLeave} onClick={() => musicReproduction(index)} key={index}/>
                                <h3>{music.name}</h3>
                                <p>{music.artist}</p>
                            </div>
                        );
                        //musicCounter = 0;
                    /*} else {
                        return (
                                <div className='music' key={music.name + index}>
                                    <img src={music.imageURL} alt={`Music ${index}`}/>
                                    <h3>{music.name}</h3>
                                    <p>{music.artist}</p>
                                </div>
                        );
                    }*/
                })}
            </div>
        </div>
    );
}

export default MainBottom;