import { useEffect } from "react";
import MainComponent from "../components/MainComponent";
import Navbar from "../components/Navbar";

function Main() {
    useEffect(() => {
        if(!localStorage.getItem('loginToken')) {
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