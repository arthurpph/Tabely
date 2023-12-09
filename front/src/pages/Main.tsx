import { useEffect } from "react";
import MainComponent from "../components/MainComponent";
import Navbar from "../components/Navbar";

function Main() {
    const getCookie = (name: string) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');
      
        for(let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].split('=');
          if(cookie[0] === name) {
            return cookie[1];
          }
        }
      
        return null;
      }

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