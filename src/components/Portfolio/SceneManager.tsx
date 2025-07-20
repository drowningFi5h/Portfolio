import { useState, useEffect } from 'react';
import HomepageScene from './HomepageScene';
import AboutScene from './AboutScene';

export default function SceneManager() {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            e.preventDefault();

            if (e.deltaY > 0 && sceneIndex === 0 && !isZooming) {
                setIsFading(true);
                setTimeout(() => {
                    setIsZooming(true);
                    setTimeout(() => {
                        setSceneIndex(1);
                        setIsZooming(false);
                        setIsFading(false);
                    }, 2000); // Zoom duration
                }, 500); // Fade duration
            }

            if (e.deltaY < 0 && sceneIndex === 1) {
                setIsFading(true);
                setTimeout(() => {
                    setSceneIndex(0);
                    setIsFading(false);
                }, 500); // Fade duration
            }
        };

        window.addEventListener('wheel', handleScroll, { passive: false });
        return () => window.removeEventListener('wheel', handleScroll);
    }, [sceneIndex, isZooming]);

    const renderScene = () => {
        switch (sceneIndex) {
            case 0:
                return <HomepageScene isZooming={isZooming} />;
            case 1:
                return <AboutScene />;
            default:
                return <HomepageScene isZooming={false} />;
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {renderScene()}
            {isFading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                        opacity: 0.5,
                        animation: 'fadeEffect 0.5s ease-in-out',
                    }}
                />
            )}
            <style>
                {`
                    @keyframes fadeEffect {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 0.5;
                        }
                    }
                `}
            </style>
        </div>
    );
}