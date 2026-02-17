import { useState, useEffect, useRef, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { db } from '../services/supabase';

export function useAudioPlayer(audioUrl: string, isExternalPaused: boolean = false) {
    const { user } = usePrivy();
    const [isMuted, setIsMuted] = useState(false); // Default unmuted, will load from DB
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ... (loadSettings and toggleMute remain the same)

    // Load mute preference from Supabase
    useEffect(() => {
        if (!user?.id) return;

        const loadSettings = async () => {
            try {
                const userData = await db.getUser(user.id);
                if (userData) {
                    setIsMuted(userData.is_muted);
                } else {
                    // Create user if not exists (default settings)
                    await db.createOrUpdateUser(user.id);
                }
            } catch (error) {
                console.error('Failed to load audio settings:', error);
            }
        };

        loadSettings();
    }, [user?.id]);

    // Save mute preference to Supabase
    const toggleMute = useCallback(async () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (user?.id) {
            try {
                // Ensure user exists before updating
                await db.createOrUpdateUser(user.id);
                await db.updateSettings(user.id, newMutedState);
            } catch (error) {
                console.error('Failed to save audio settings:', error);
            }
        }
    }, [isMuted, user?.id]);

    // Initialize audio element
    useEffect(() => {
        if (!audioUrl) {
            audioRef.current = null;
            return;
        }

        const audio = new Audio(audioUrl);
        audio.loop = true;
        audioRef.current = audio;

        // Try to play immediately if not muted and not paused externally
        if (!isMuted && !isExternalPaused) {
            audio.play().catch(() => {
                // Autoplay policy might block this, expected
            });
        }

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [audioUrl]); // Re-init if URL changes

    // Control playback based on mute state AND external pause
    useEffect(() => {
        if (!audioRef.current) return;

        if (isMuted || isExternalPaused) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((error: unknown) => {
                console.error('Failed to play audio:', error);
            });
        }
    }, [isMuted, isExternalPaused]);

    return {
        isMuted,
        toggleMute,
    };
}
