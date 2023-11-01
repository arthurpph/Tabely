import { Link } from 'react-router-dom';
import searchImg from '../assets/images/Search_fill.png'
import bannerImg from '../assets/images/banner.png'
import '../assets/styles/MainTop.css'

function MainTop() {
    return (
        <div className='maintopcontainer'>
            <div className='login'>
                <button style={{ fontFamily: 'Inter, sans-serif' }} id='login'><Link to="/login" style={{textDecoration: 'none', color: 'white'}}>LOGIN</Link></button>
            </div>
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