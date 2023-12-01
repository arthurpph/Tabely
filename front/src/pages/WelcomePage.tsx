import { useNavigate } from 'react-router-dom';
import AppImage from '../assets/images/AppImage.png'
import NavBar from "../components/Navbar";
import '../assets/styles/WelcomePage.css'

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <NavBar/>
            <main>
                <section className="main-section">
                    <div>
                        <h1>
                            Don’t Stop<br/> 
                            Play It Till You Feel The<br/>
                            Groove
                        </h1>
                        <h4>
                            Choose any song to add to your customized playlist and<br/>
                            never worry about changing your song while you work
                        </h4>
                        <button onClick={() => navigate('/register')}>Create Your Account</button>
                    </div>
                    <img src={AppImage} alt="App Image"/>
                </section>
            </main>
        </div>
    );
}

export default WelcomePage;