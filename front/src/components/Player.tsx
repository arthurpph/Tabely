import React, { useEffect, useRef, useState } from 'react'
import playButton from '../assets/images/PlayButton.png'
import previousTrack from '../assets/images/Polygon 2-1.png'
import nextTrack from '../assets/images/Polygon 2.png'
import musicTest from '../assets/images/music test.png'
import audioTest from '../assets/musics/VAPO VAPO VS POCOTÓ - MC PR - Fica de quatro nós bota sem dó (DJ Menor da B) (320 kbps).mp3'
import '../assets/styles/Player.css'

function Player() {
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = () => {
        const audio = audioRef.current
        if(audio){
            if(audio.paused){
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

    useEffect(() => {
        const audio = audioRef.current;
        if(audio){
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime)
            });
        }
    });

    return (
        <div className="player">
            <img src={musicTest} alt="musicTest" id="musicphoto"/>
            <div className="playerinfo">
                <div className='playercommands'>
                    <button><img src={previousTrack} alt="previousTrackButton" /></button>
                    <button onClick={handlePlayPause}><img src={playButton} alt="playButton" /></button>
                    <button><img src={nextTrack} alt="nextTrackButton" /></button>
                </div>
                <audio ref={audioRef}>
                    <source src={audioTest} type="audio/mpeg"/>
                </audio>
                <input 
                    id="musictimerange"
                    type="range"
                    min="0"
                    max={audioRef.current ? audioRef.current.duration : 100}
                    value={currentTime}
                    onChange={handleTimeChange}
                />
                <input 
                    type="range"
                    min="0"
                    max="100"
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
}

export default Player;