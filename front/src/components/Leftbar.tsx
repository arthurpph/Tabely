import searchImg from '../assets/images/Search_alt.png'
import musicImg from '../assets/images/Music_fill.png'
import headphoneImg from '../assets/images/Headphones_fill.png'
import micImg from '../assets/images/Mic.png'
import starImg from '../assets/images/Star.png'
import videoImg from '../assets/images/Video_file_fill.png'
import '../assets/styles/Leftbar.css'

function Leftbar() {
    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }} className="container">
            <div className="top">
                <div className="flexcolumn">
                    <p>BROWSE</p>
                    <div className="flex">
                        <img src={searchImg} alt="searchImg"/>
                        <p>DISCOVER</p>
                    </div>
                    <div className="flex">
                        <img src={musicImg} alt="musicImg" />
                        <p>GENRE</p>
                    </div>
                    <div className="flex">
                        <img src={headphoneImg} alt="headphoneImg"/>
                        <p>TOP CHARTS</p>
                    </div>
                    <div className="flex">
                        <img src={micImg} alt="micImg"/>
                        <p>PODCAST</p>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="flexcolumn">
                    <p>LIBRARY</p>
                    <div className="flex">
                        <img src={starImg} alt="starImg"/>
                        <p>FAVOURITES</p>
                    </div>
                    <div className="flex">
                        <img src={videoImg} alt="videoImg" />
                        <p>PLAYLIST</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leftbar;