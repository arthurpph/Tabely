import { useEffect } from "react";
import { getCookie } from "../helpers/getCookie";
import MainComponent from "../components/MainComponent";
import Navbar from "../components/Navbar";

function Main() {
    useEffect(() => {
        if(!getCookie('loginToken')) {
            window.location.href = "/welcome"
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