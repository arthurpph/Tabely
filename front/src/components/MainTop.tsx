import searchImg from '../assets/images/Search_fill.png'
import bannerImg from '../assets/images/banner.png'
import '../assets/styles/MainTop.css'

function MainTop() {
    return (
        <div className='maintopcontainer'>
            <div className='searchdiv'>
                <label htmlFor="search" className="searchimg">
                    <img src={searchImg} alt="searchImg"/>
                </label>
                <input type="text" id="search" placeholder='Search'/>
            </div>
            <div className="bannerimg">
                <img src={bannerImg} alt="bannerImg" id="bannerimg"/>
            </div>
        </div>
    );
}

export default MainTop;