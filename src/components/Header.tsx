import { usePrivy } from '@privy-io/react-auth';

export const Header = () => {
    const { ready, authenticated, user, logout } = usePrivy();

    if (!ready || !authenticated || !user) return null;

    // Helper to get user display info
    // Prioritize Google info since we're using Google login
    const googleProfile = user.google;
    const avatarUrl = (googleProfile as any)?.picture;
    const displayName = (googleProfile as any)?.name || user.email?.address || 'Explorer';

    // Debug logging
    console.log('User object:', user);
    console.log('Google profile:', googleProfile);
    console.log('Avatar URL:', avatarUrl);
    console.log('Display name:', displayName);

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        }}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Profile"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        imageRendering: 'pixelated'
                    }}
                />
            ) : (
                <div className="nes-container is-rounded is-dark" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    {displayName}
                </div>
            )}

            <button
                className="nes-btn is-error"
                onClick={logout}
                style={{ fontSize: '0.8rem' }}
            >
                Logout
            </button>
        </div>
    );
};
