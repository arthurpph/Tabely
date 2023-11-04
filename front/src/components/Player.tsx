import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import playButton from '../assets/images/PlayButton.png'
import previousTrack from '../assets/images/Polygon 2-1.png'
import nextTrack from '../assets/images/Polygon 2.png'
import musicTest from '../assets/images/music test.png'
import '../assets/styles/Player.css'

function Player() {
    const [currentTime, setCurrentTime] = useState(0);
    const [queue, setQueue] = useState<{ name: string, artist: string, musicURL: string, duration: string }[]>([]);
    const [musicName, setMusicName] = useState('');
    const [musicDuration, setMusicDuration] = useState('');
    const [stage, setStage] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const buildQueue = async () => {
        const musics = await axios.get(`${import.meta.env.VITE_API_URL}/musics`);
        const data = musics.data;
        const newQueue = [...queue];

        for(let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            newQueue.push({
                name: data[randomIndex].name,
                artist: data[randomIndex].artist,
                musicURL: data[randomIndex].musicURL,
                duration: data[randomIndex].duration
            });
        }

        setQueue(newQueue);
    }

    const handlePlayPause = () => {
        const audio = audioRef.current
        if(audio){
            if(!audio.src) {
                nextMusic();
            }

            if(audio.paused) audio.play();
            else audio.pause();
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

    const nextMusic = () => {
        const audio = audioRef.current;
        if(audio && queue.length > 0) {
            audio.src = queue[0].musicURL;
            setMusicName(queue[0].name);
            setMusicDuration(queue[0].duration);
            setCurrentTime(audio.currentTime);
            setQueue(queue.length > 1 ? [...queue.slice(1)] : []);
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

            buildQueue();
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if(audio && queue.length > 0){
            audio.addEventListener('ended', () => {
                nextMusic();
            });

            if(!stage) {
                nextMusic()
                setStage(true)
            }
        }
    }, [queue])

    return (
        <div className="player" style={{ fontFamily: 'Inter, sans-serif' }}>
            <img src={musicTest} alt="musicTest" id="musicphoto"/>
            <p>{musicName}</p>
            <div className="playerinfo">
                <div className='playercommands'>
                    <button><img src={previousTrack} alt="previousTrackButton" style={{ width: '1rem', height: '1rem' }}/></button>
                    <button onClick={handlePlayPause}><img src={playButton} alt="playButton" /></button>
                    <button><img src={nextTrack} alt="nextTrackButton" style={{ width: '1rem', height: '1rem' }}/></button>
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