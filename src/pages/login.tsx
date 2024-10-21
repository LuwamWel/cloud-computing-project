import { useState, MouseEvent } from 'react';
import { signin } from '../services/auth.service';
import { useAuth } from '../context/auth.context';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await signin({ email, password })
        login(response.data.email, response.data.name)
        navigate("/profile")
    };

    return (
        <>
            <h1>Login </h1>
            <form>
                <p>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        placeholder="Enter your email here"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </p>
                <p>
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        placeholder="Enter your password here"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </p>
                <button type="button" onClick={handleLogin}>Submit</button>
                
                {/* Example usage of 'user' */}
                {user && <p>Logged in as: {user.email}</p>}
            </form>
        </>
    );
}
