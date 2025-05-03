import "./AudioPlayer.scss";
import {MusicNote, MusicOff, Shuffle} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useAudio} from "../../providers/AudioProvider.tsx";

function AudioPlayer() {
    const {isPlaying, playPause, nextTrack} = useAudio()

    return (
        <div className="audio-btn-wrapper">
            <Button variant="contained" color="inherit"
                    onClick={playPause}>
                {isPlaying ? <MusicNote/> : <MusicOff/>}
            </Button>

            <Button className="next-button" variant="contained" color="inherit"
                    onClick={nextTrack}>
                <Shuffle/>
            </Button>
        </div>
    );
}

export default AudioPlayer;