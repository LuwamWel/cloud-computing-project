import { useState, MouseEvent } from 'react';
import { register } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSignUp = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const user = await register({ name, email, password })
        login(user.email, user.name)
        navigate("/profile")
    };

    return (
        <>
            <h1>Create account</h1>
            <form>
                <p>
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        placeholder="Enter your name here"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </p>
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
                <button type="button" onClick={handleSignUp}>Submit</button>
            </form>
        </>
    );
}
