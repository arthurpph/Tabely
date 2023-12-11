import React, { useEffect, useRef, useState } from 'react';
import { decodeToken } from '../helpers/decodeToken';
import { MusicStructure } from '../interfaces/musicStructure';
import { UserInterface } from '../interfaces/userInterface';
import { getCookie } from '../helpers/getCookie';
import { audioDB } from '../App';
import axios from 'axios';
import QueueOffCanvas from './QueueOffCanvas';
import playButton from '../assets/images/PlayButton.svg';
import PauseButton from '../assets/images/PauseButton.svg';
import PreviousTrack from '../assets/images/PreviousTrack.svg';
import NextTrack from '../assets/images/NextTrack.svg';
import Button from 'react-bootstrap/Button';
import '../assets/styles/Player.css';

let setMusic: (music: MusicStructure, buildQueueMusics?: MusicStructure[], playlistName?: string) => void;

function Player() {
    const [playButtonImage, setPlayImageButton] = useState<string>(playButton);
    const [isMusicImageLoadad, setIsMusicImageLoaded] = useState<boolean>(false);
    const [showQueue, setShowQueue] = useState<boolean>(false);
    const [queue, setQueue] = useState<MusicStructure[]>([]);
    const [reproducedMusics, setReproducedMusics] = useState<MusicStructure[]>([]);
    const [currentMusicIndex, setCurrentMusicIndex] = useState<number>(-1);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentVolume, setCurrentVolume] = useState<number>(0);
    const [musicName, setMusicName] = useState<string>('');
    const [musicArtist, setMusicArtist] = useState<string>('');
    const [musicDuration, setMusicDuration] = useState<string>('');
    const [musicImage, setMusicImage] = useState<string>('');
    const [firstMusicSetup, setFirstMusicSetup] = useState<boolean>(true);
    const [downloadedMusics, setDownloadedMusics] = useState<{ name: string, blobURL: string }[]>([]);
    const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const downloadMusic = async (name: string, musicURL: string): Promise<void> => {
        const music = await axios.get(musicURL, { responseType: 'blob' });
        const blobURL = URL.createObjectURL(music.data);
        setDownloadedMusics([...downloadedMusics, {
            name: name,
            blobURL: blobURL
        }]);
    }

    setMusic = (music: MusicStructure, buildQueueMusics?: MusicStructure[], playlistName?: string): void => {
        const audio = audioRef.current;
        if(audio) {
            changeMusic(music);
            setReproducedMusics([...reproducedMusics, {
                name: music.name,
                artist: music.artist,
                imageURL: music.imageURL,
                musicURL: music.musicURL,
                duration: music.duration
            }]);
            setCurrentMusicIndex(reproducedMusics.length);
        }

        setCurrentPlaylist(playlistName ? playlistName : null);

        if(buildQueueMusics) {
            buildQueue(buildQueueMusics);
        }
    }

    const getMusics = async (): Promise<MusicStructure[] | undefined> => {
        try {
            const musics = await axios.get(`${import.meta.env.VITE_API_URL}/musics`);
            const data = musics.data;
            return data;
        } catch (err) {
            console.error(err);
        }
    }

    const buildQueue = async (musics: MusicStructure[] | undefined): Promise<void> => {
        if(!musics) {
            return;
        }

        const newQueue = [];

        for(let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * musics.length);
            const randomMusic = musics[randomIndex];
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

    const changeQueue = (index: number): void => {
        setTimeout(() => {
            setQueue(queue.slice(index));
        }, 500);
    }

    const handlePlayPause = (): void => {
        const audio = audioRef.current
        if(audio){
            if(!audio.src) {
                goToNextMusic();
            }

            if(audio.paused) {
                setPlayImageButton(PauseButton);
                audio.play();
            }
            else {
                setPlayImageButton(playButton);
                audio.pause();
            }
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const audio = audioRef.current;
        if(audio){
            if(audio.paused) {
                audio.currentTime = parseFloat(e.target.value);
                audio.pause();
            } else {
                audio.currentTime = parseFloat(e.target.value);
            }
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const audio = audioRef.current;
        const value = parseFloat(e.target.value) / 100;
        localStorage.setItem('player-volume', value.toString());
        if(audio){
            audio.volume = value;
        }
        setCurrentVolume(parseFloat(e.target.value));
    }

    const goToNextMusic = (): void => {
        let nextMusic: MusicStructure | null = null;

        if(currentMusicIndex !== reproducedMusics.length - 1) {
            const currentMusicIndexScope: number = currentMusicIndex + 1;
            setCurrentMusicIndex(currentMusicIndexScope);
            nextMusic = reproducedMusics[currentMusicIndexScope];
        } 
        else if(queue.length > 0) {
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

        if(nextMusic) {
            changeMusic(nextMusic);
            setCurrentMusicIndex(currentMusicIndex + 1);
            if(firstMusicSetup) {
                setPlayImageButton(playButton);
            }
        }
    }

    const goToPreviousMusic = (): void => {
        const audio = audioRef.current;
        if(audio) {
            if(currentTime >= 1) {
                audio.currentTime = 0;
                return;
            }

            if(currentMusicIndex === 0) {
                return;
            }

            const currentMusicIndexScope: number = currentMusicIndex - 1;
            setCurrentMusicIndex(currentMusicIndexScope);
            
            const previousMusic = reproducedMusics[currentMusicIndexScope];

            if(previousMusic) {
                changeMusic(previousMusic)
            }
        }
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
        if(event.key === 'MediaTrackPrevious') {
            goToPreviousMusic();
            return;
        }

        if(event.key === 'MediaPlayPause') {
            handlePlayPause();
            return;
        }
        
        if(event.key === 'MediaTrackNext') {
            goToNextMusic();
        }
    }

    const changeAudioSrc = async (musicName: string, musicURL: string): Promise<void> => {
        const audio = audioRef.current;
        if(audio) {
            const musicIsOnCache = downloadedMusics.filter(downloadedMusic => downloadedMusic.name === musicName);
            const musicIsDownloaded = await audioDB.checkIfKeyExists(musicName);
            if(musicIsDownloaded instanceof Blob) {
                audio.src = URL.createObjectURL(musicIsDownloaded);
            } else if(musicIsOnCache.length > 0) {
                audio.src = musicIsOnCache[0].blobURL;
            } else {
                downloadMusic(musicName, musicURL);
                audio.src = musicURL;
            }
        }
    }

    const changeAccountCurrentMusic = async (music: MusicStructure): Promise<void> => {
        const token = getCookie('loginToken');
        if(token) {
            await axios.put(`${import.meta.env.VITE_API_URL}/music/user/${decodeToken(token).id}`, {
                music: music
            });
        }
    }

    const changeMusic = (music: MusicStructure): void => {
        const audio = audioRef.current;
        changeAccountCurrentMusic(music);
        changeAudioSrc(music.name, music.musicURL);
        setMusicName(music.name);
        setMusicArtist(music.artist);
        setMusicImage(music.imageURL);
        setMusicDuration(music.duration);
        setPlayImageButton(PauseButton);
        if(!firstMusicSetup) {
            setTimeout(() => {
                if(audio?.paused) {
                    setTimeout(() => {
                        audio?.play();
                    }, 100);
                }
            }, 100);
            
            audio?.addEventListener('canplaythrough', () => {
                audio.play();
            });
        } else {
            audio?.pause();
        }
    }

    const getUser = async (): Promise<UserInterface> => {
        const user = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
            params: {
                email: decodeToken('', 'loginToken').email
            }
        });

        return user.data;
    }
    
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsMusicImageLoaded(true);
        e.currentTarget?.classList.remove('unloaded');
    }

    useEffect(() => {
        const componentBuild = async () => {
            const audio = audioRef.current;
            if(audio) {
                audio.addEventListener('timeupdate', () => {
                    setCurrentTime(audio.currentTime);
                });

                audio.addEventListener('error', () => {
                    audio.load();
                });

                buildQueue(await getMusics());

                const musicVolume = localStorage.getItem('player-volume');

                if(musicVolume) {
                    audio.volume = parseFloat(musicVolume);
                    setCurrentVolume(audio.volume * 100);
                } else {
                    audio.volume = 0.5;
                    setCurrentVolume(40);
                }
            }
        }

        componentBuild();
    }, []);

    /*useEffect(() => {
        const handleBeforeUnload = () => {
            const saveMusicTime = async () => {
                if(audioRef.current) {
                    await axios.put(`${import.meta.env.VITE_API_URL}/music/user/time/${audioRef.current.currentTime}`, {
                        userId: decodeToken('', 'loginToken').id
                    });
                }
            };
        
            saveMusicTime();
          };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [currentTime]);*/

    useEffect(() => {
        const queueUseEffect = async (): Promise<void> => {
            const audio = audioRef.current;
            if(audio && queue.length > 0){
                audio.addEventListener('ended', () => {
                    goToNextMusic();
                });

                if(firstMusicSetup) {
                    if(getCookie('loginToken')) {
                        const user = await getUser();
                        if(user.currentMusic) {
                            changeMusic(user.currentMusic);
                            setPlayImageButton(playButton);
                       
                            /*if(user.currentTime) {
                                setTimeout(() => setCurrentTime(user.currentTime), 1)
                            }*/
                        } else {
                            goToNextMusic();
                        }
                    } else {
                        goToNextMusic();
                    }
                    setFirstMusicSetup(false);
                }
            } else if(queue.length === 0) {
                buildQueue(await getMusics());
            }
        }

        queueUseEffect();

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [queue, currentTime]);

    useEffect(() => {
        if('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: musicName || 'Unknown Music',
                artist: musicArtist || 'Unknown Artist',
                artwork: [
                    { src: musicImage, sizes: '96x96', type: 'image/jpeg' },
                ],
            });

            navigator.mediaSession.setActionHandler('play', function () {
                handlePlayPause();
            });

            navigator.mediaSession.setActionHandler('pause', function () {
                handlePlayPause();
            });

            navigator.mediaSession.setActionHandler('nexttrack', function () {
                goToNextMusic();
            });

            navigator.mediaSession.setActionHandler('previoustrack', function () {
                goToPreviousMusic();
            });
        }

    }, [musicName, musicArtist, musicImage])

    return (
        <div className="player" style={{ fontFamily: 'Inter, sans-serif' }}>
            <img src={musicImage} alt="musicImage" className="musicphoto unloaded" onLoad={handleImageLoad}/>
            {isMusicImageLoadad ? <p className='musicname'>{musicName}</p> : <p className='musicnameloading'>Loading...</p>}
            <div className="playerinfo">
                <div className='playercommands'>
                    <button onClick={goToPreviousMusic}><img src={PreviousTrack} id='musiccontrollerbutton' alt="previousTrackButton"/></button>
                    <button onClick={handlePlayPause}><img src={playButtonImage} alt="playButton" className='play-button'/></button>
                    <button onClick={goToNextMusic}><img src={NextTrack} id='musiccontrollerbutton' alt="nextTrackButton"/></button>
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
                    <div className='alternativecommands'>
                        <div className='volumecommand'>
                            <svg data-encore-id="icon" aria-label="Volume alto" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" fill='white'><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>
                            <input
                                id="musicvolumerange"
                                type="range"
                                min="0"
                                max="100"
                                value={currentVolume}
                                onChange={handleVolumeChange}
                            />
                        </div>
                        <Button className='queue-button' style={{ background: 'transparent', border: 'none' }} variant="primary" onClick={() => setShowQueue(true)}>
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="queue" fill="white"><path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path></svg>
                        </Button>
                        <QueueOffCanvas 
                            showQueue={showQueue}
                            handleClose={() => setShowQueue(false)}
                            queue={queue}
                            setMusic={setMusic}
                            changeQueue={changeQueue}
                            currentPlaylist={currentPlaylist}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { setMusic }

export default Player;
