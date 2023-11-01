import playButton from '../assets/images/PlayButton.png'
import previousTrack from '../assets/images/Polygon 2-1.png'
import nextTrack from '../assets/images/Polygon 2.png'
import trackTime from '../assets/images/TrackTime.png'
import musicTest from '../assets/images/music test.png'
import '../assets/styles/Player.css'

function Player() {
    return (
        <div className="player">
            <img src={musicTest} alt="musicTest" id="musicphoto"/>
            <div className="playerinfo">
                <div className='playercommands'>
                    <button><img src={previousTrack} alt="previousTrackButton" /></button>
                    <button><img src={playButton} alt="playButton" /></button>
                    <button><img src={nextTrack} alt="nextTrackButton" /></button>
                </div>
                <img src={trackTime} alt="trackTime" id="tracktime"/>
            </div>
        </div>
    );
}

export default Player;