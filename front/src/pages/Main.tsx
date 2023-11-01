import Leftbar from "../components/Leftbar";
import MainBottom from "../components/MainBottom";
import MainTop from "../components/MainTop";
import Player from "../components/Player";

function Main() {
    return (
        <div>
            <MainTop/>
            <MainBottom/>
            <Leftbar/>
            <Player/>
        </div>  
    );
}

export default Main;