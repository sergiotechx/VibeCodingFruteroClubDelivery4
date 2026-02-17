import { useEffect, useState } from 'react';
import './IntroScreen.css';

interface IntroScreenProps {
    onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) return;

        // Fallback: auto-advance after 10 seconds if video doesn't load/play
        const timeout = setTimeout(onComplete, 10000);
        return () => clearTimeout(timeout);
    }, [hasStarted, onComplete]);

    if (!hasStarted) {
        return (
            <div className="intro-screen" onClick={() => setHasStarted(true)} style={{ cursor: 'pointer' }}>
                <div className="intro-overlay">
                    <h1 className="intro-title" style={{ animation: 'none', opacity: 1 }}>ELEMON</h1>
                    <div className="loading-text" style={{ marginTop: '20px', animation: 'blink 1s infinite' }}>
                        CLICK TO START
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="intro-screen" onClick={onComplete}>
            <video
                className="intro-video"
                src="/assets/intro.mp4"
                autoPlay
                playsInline
                onEnded={onComplete}
                onError={() => {
                    console.warn('Video failed to load, advancing to start screen');
                    onComplete();
                }}
            />
            <div className="intro-overlay">
                <div className="loading-text">LOADING WORLD...</div>
                <h1 className="intro-title">ELEMON</h1>
            </div>
        </div>
    );
}
