import { useNavigate } from "react-router-dom";
import { getCookie } from "../helpers/getCookie";
import MainComponent from "../components/MainComponent";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

function Main() {
    const navigate = useNavigate();

    useEffect(() => {
        if(!getCookie('loginToken')) {
            navigate('/welcome');
        }
    }, [])

    return (
        <div>
            <Navbar/>
            <MainComponent/>
        </div>
    );
}

export default Main;