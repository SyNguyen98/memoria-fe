import "./AudioPlayer.scss";
import {useEffect, useState} from "react";
import {Howl} from "howler";
import {MusicNote, MusicOff, Shuffle} from "@mui/icons-material";
import {Button} from "@mui/material";

const tracks = [
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/meeting_and_passing.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/coral_coronation.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/for_riddles_for_wonders.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/hanachirusato.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/lover_oath.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/moonlike_smile.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/pluie_sur_la_ville.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/ruu_song.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/say_my_name.mp3",
    "https://cdn.jsdelivr.net/gh/SyNguyen98/image-storage@main/audios/tender_strength.mp3",
];

function AudioPlayer() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [playedTracks, setPlayedTracks] = useState<(string | number)[]>([]);
    const [sound, setSound] = useState<Howl | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (sound) {
            sound.unload(); // Unload previous sound before playing a new one
        }

        setSound(new Howl({
            src: [tracks[currentTrackIndex]],
            loop: true,
            volume: 0.5,
            onend: () => {
                handleNextTrack(); // Auto-move to next song when it ends
            }
        }));

        return () => {
            if (sound) sound.unload();
        };
    }, [currentTrackIndex]);

    useEffect(() => {
        if (sound) {
            if (isPlaying) {
                sound.play();
            } else {
                sound.pause();
            }
        }
    }, [isPlaying, sound]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleNextTrack = () => {
        let availableTracks = tracks.map((_, i) => i).filter(i => !playedTracks.includes(i));

        if (availableTracks.length === 0) {
            // All songs played, reset the list
            setPlayedTracks([]);
            availableTracks = tracks.map((_, i) => i);
        }

        const randomIndex = availableTracks[Math.floor(Math.random() * availableTracks.length)];

        setPlayedTracks([...playedTracks, randomIndex]);
        setCurrentTrackIndex(randomIndex);
        setIsPlaying(true);
    };

    return (
        <div className="audio-btn-wrapper">
            <Button variant="contained" color="inherit"
                    onClick={handlePlayPause}>
                {isPlaying ? <MusicNote/> : <MusicOff/>}
            </Button>

            <Button className="next-button" variant="contained" color="inherit"
                    onClick={handleNextTrack}>
                <Shuffle/>
            </Button>
        </div>
    );
}

export default AudioPlayer;