import React, { useEffect, useRef, useState } from 'react'
import playButton from '../assets/images/PlayButton.png'
import previousTrack from '../assets/images/Polygon 2-1.png'
import nextTrack from '../assets/images/Polygon 2.png'
import musicTest from '../assets/images/music test.png'
import '../assets/styles/Player.css'

function Player() {
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioDurationRef = useRef<HTMLSpanElement | null>(null);

    const handlePlayPause = () => {
        const audio = audioRef.current
        if(audio){
            if(audio.readyState === 0){
                audio.load();
                audio.addEventListener('canplaythrough', () => audio.play());
            }
            else {
                if(audio.paused) audio.play();
                else audio.pause();
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

    const loadMusicDuration = () => {
        const audioDuration = audioDurationRef.current;
        if(audioDuration && audioRef.current){
            if(isNaN(audioRef.current.duration)){
                setTimeout(() => loadMusicDuration(), 500);
            } 
            else {
                audioDuration.textContent = (audioRef.current.duration / 60).toFixed(2).replace('.', ':');
            }
        }
    }

    useEffect(() => {
        const audio = audioRef.current;
        if(audio){
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime)
            });
            loadMusicDuration();
        }
    }, []);

    return (
        <div className="player">
            <img src={musicTest} alt="musicTest" id="musicphoto"/>
            <div className="playerinfo">
                <div className='playercommands'>
                    <button><img src={previousTrack} alt="previousTrackButton" /></button>
                    <button onClick={() => {
                        handlePlayPause() 
                        loadMusicDuration()
                    }}><img src={playButton} alt="playButton" /></button>
                    <button><img src={nextTrack} alt="nextTrackButton" /></button>
                </div>
                <audio ref={audioRef} preload="metadata">
                    <source src="https://drive.google.com/u/5/uc?id=1eYI_LYbwtmWlFakB0zP8n4U2iGzMO58q&export=download" type="audio/mpeg"/>
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
                    <span ref={audioDurationRef}>Loading...</span>
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