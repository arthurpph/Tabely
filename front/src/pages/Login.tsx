import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/CustomToast.css';
import '../assets/styles/Login.css';

function Login() {
    const initialState = {
        email: '',
        password: ''
    }

    const [state, setState] = useState(initialState);
    const [promiseInProgress, setPromiseInProgress] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(promiseInProgress) {
            return;
        }
        
        try {
            setPromiseInProgress(true);

            const user = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email: state.email,
                password: state.password
            });
            const data = user.data;
            
            if(!data.success) {
                toast.error(data.response);
                return;
            }

            cookies.set('loginToken', data.accessToken);
            
            toast.success(data.response);
            navigate('/');
        } catch (err) {
            toast.error('An error has occurred, see console for more details');
            console.error(err);
        } finally {
            setPromiseInProgress(false);
        }
    }

    return (
        <div className="logincontainer" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h1>LOGIN</h1>
            <form onSubmit={handleLogin} className="loginform">
                <label htmlFor="email">Insira seu email</label>
                <input 
                    type="text" 
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <label htmlFor="password">Insira sua senha</label>
                <input 
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                />
                <button type="submit">LOGIN</button>
                <p>Não tem uma conta? <Link to="/register" style={{ textDecoration: 'none' }}>Registre-se</Link></p>
                <div>{promiseInProgress && <TailSpin
                    height="80"
                    width="80"
                    color="#808080"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    />}
                </div>        
            </form>
        </div>
    );
}

export default Login;