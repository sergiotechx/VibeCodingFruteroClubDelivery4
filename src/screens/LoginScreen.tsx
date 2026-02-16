import { usePrivy } from '@privy-io/react-auth';

export const LoginScreen = () => {
    const { login } = usePrivy();

    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <div className="nes-container is-dark with-title">
                <p className="title">Authentication</p>
                <p style={{ marginBottom: '2rem' }}>Please log in to continue your journey.</p>

                <button
                    className="nes-btn is-primary"
                    onClick={login}
                    style={{ minWidth: '200px' }}
                >
                    Login with Google
                </button>
            </div>
        </div>
    );
};
