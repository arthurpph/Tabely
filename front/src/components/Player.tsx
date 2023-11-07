import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import playButton from '../assets/images/PlayButton.png'
import previousTrack from '../assets/images/Polygon 2-1.png'
import nextTrack from '../assets/images/Polygon 2.png'
import '../assets/styles/Player.css'

interface MusicStructure {
    name: string,
    artist: string,
    imageURL: string,
    musicURL: string,
    duration: string
}

function Player() {
    const [queue, setQueue] = useState<MusicStructure[]>([]);
    const [reproducedMusics, setReproducedMusics] = useState<MusicStructure[]>([]);
    const [currentMusicIndex, setCurrentMusicIndex] = useState<number>(-1);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [musicName, setMusicName] = useState<string>('');
    const [musicDuration, setMusicDuration] = useState<string>('');
    const [musicImage, setMusicImage] = useState<string>('');
    const [firstMusicSetup, setFirstMusicSetup] = useState<boolean>(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const buildQueue = async () => {
        const musics = await axios.get(`${import.meta.env.VITE_API_URL}/musics`);
        const data = musics.data;
        const newQueue = [...queue];

        for(let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomMusic = data[randomIndex];
            newQueue.push({
                name: randomMusic.name,
                artist: randomMusic.artist,
                imageURL: randomMusic.imageURL,
                musicURL: randomMusic.musicURL,
                duration: randomMusic.duration
            });
        }

        setQueue(newQueue);
    }

    const handlePlayPause = () => {
        const audio = audioRef.current
        if(audio){
            if(!audio.src) {
                goToNextMusic();
            }

            if(audio.paused) {
                audio.play();
            }
            else {
                audio.pause();
            }
        }
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current
        if(audio){
            audio.currentTime = parseFloat(event.target.value)
        }
    }

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current
        if(audio){
            audio.volume = parseFloat(event.target.value) / 100
        }
    }

    const goToNextMusic = () => {
        const audio = audioRef.current;
        let nextMusic;

        if(currentMusicIndex !== reproducedMusics.length - 1) {
            const currentMusicIndexScope: number = currentMusicIndex + 1;
            setCurrentMusicIndex(currentMusicIndexScope);
            nextMusic = reproducedMusics[currentMusicIndexScope];
        } else if(queue.length > 0) {
            nextMusic = queue[0];
            setReproducedMusics([...reproducedMusics, {
                name: nextMusic.name,
                artist: nextMusic.artist,
                imageURL: nextMusic.imageURL,
                musicURL: nextMusic.musicURL,
                duration: nextMusic.duration
            }]);
            setQueue(queue.length > 1 ? [...queue.slice(1)] : []);
        }

        if(audio && nextMusic) {
            audio.src = nextMusic.musicURL;
            setMusicImage(nextMusic.imageURL);
            setMusicName(nextMusic.name);
            setMusicDuration(nextMusic.duration);
            setCurrentTime(audio.currentTime);
            setCurrentMusicIndex(currentMusicIndex + 1);
        }
    }

    const goToPreviousMusic = () => {
        const audio = audioRef.current;
        if(audio) {
            if(currentTime >= 1) {
                audio.currentTime = 0;
                return;
            }

            if(currentMusicIndex === 0) {
                return;
            }

            let currentMusicIndexScope: number = currentMusicIndex - 1;
            setCurrentMusicIndex(currentMusicIndexScope);
            
            const previousMusic = reproducedMusics[currentMusicIndexScope];

            if(previousMusic) {
                audio.src = previousMusic.musicURL;
                audio.currentTime = 0;
                setMusicImage(previousMusic.imageURL);
                setMusicName(previousMusic.name);
                setMusicDuration(previousMusic.duration);
            }
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if(event.key === 'MediaTrackPrevious') {
            goToPreviousMusic();
        } 
        else if(event.key === 'MediaTrackNext') {
            goToNextMusic();
        }
    }

    useEffect(() => {
        const audio = audioRef.current;
        if(audio){
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime);
            });

            audio.addEventListener('canplaythrough', () => {
                audio.play();
            });

            audio.addEventListener('error', () => {
                audio.load();
            });

            buildQueue();
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if(audio && queue.length > 0){
            audio.addEventListener('ended', () => {
                goToNextMusic();
            });

            if(firstMusicSetup) {
                goToNextMusic();
                setFirstMusicSetup(false);
            }
        } 
        else if(queue.length === 0) {
            buildQueue();
        }
    }, [queue]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [queue, currentTime])

    return (
        <div className="player" style={{ fontFamily: 'Inter, sans-serif' }}>
            <img src={musicImage} alt="musicImage" className="musicphoto"/>
            <p className='musicname'>{musicName}</p>
            <div className="playerinfo">
                <div className='playercommands'>
                    <button onClick={goToPreviousMusic}><img src={previousTrack} id='musiccontrollerbutton' alt="previousTrackButton"/></button>
                    <button onClick={handlePlayPause}><img src={playButton} alt="playButton"/></button>
                    <button onClick={goToNextMusic}><img src={nextTrack} id='musiccontrollerbutton' alt="nextTrackButton"/></button>
                </div>
                <audio ref={audioRef} preload="metadata">
                    <source type="audio/mpeg"/>
                </audio>
                <div className='musicinteraction'>
                    <span>{Math.floor((currentTime % 3600) / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                    <input
                        id="musictimerange"
                        type="range"
                        min="0"
                        max={audioRef.current && !isNaN(audioRef.current.duration) ? audioRef.current.duration : 100}
                        value={currentTime}
                        onChange={handleTimeChange}
                    />
                    <span>{musicDuration}</span>
                    <svg data-encore-id="icon" aria-label="Volume alto" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>
                    <input
                        id="musicvolumerange"
                        type="range"
                        min="0"
                        max="100"
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Player;
