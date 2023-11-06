import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from 'yup';
import axios from 'axios';
import '../assets/styles/Register.css';

interface state {
    name: string,
    email: string,
    password: string,
    errors: Record<string, string>
}

function Register() {
    const initialState: state = {
        name: '',
        email: '',
        password: '',
        errors: {}
    }

    const [state, setState] = useState(initialState);
    const [promiseInProgress, setPromiseInProgress] = useState<boolean>(false);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required('O nome é obrigatório'),
        email: yup.string().email('Email inválido').required('O email é obrigatório'),
        password: yup.string().min(6, 'A senha deve conter pelo menos 6 caracteres').required('A senha é obrigatória')
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setState({ ...state, [name]: value });
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(promiseInProgress) {
            return;
        }

        const { name, email, password } = state;

        try {
            setPromiseInProgress(true);

            await schema.validate({ name, email, password }, { abortEarly: false });
            setState({ ...state, errors: {} });

            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                "name": name,
                "email": email,
                "password": password
            });

            toast.success('Usuário registrado');
            navigate('/login');
        } catch (error: any) {
            if(error.response.status === 409) {
                toast.error('Usuário já registrado com este email');
                return;
            }

            const errors: Record<string, string> = {};

            error.inner.forEach((err: yup.ValidationError) => {
                if(err.path) {
                    errors[err.path] = err.message;
                }
            });

            setState({ ...state, errors: errors });
        } finally {
            setPromiseInProgress(false);
        }
    }

    return (
        <div className="registercontainer" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h1>REGISTER</h1>
            <form onSubmit={handleRegister} className="registerform">
                <label htmlFor="name">Insira seu nome de usuário</label>
                <input 
                    type="text" 
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                />
                <span className="error">{state.errors.name}</span>
                <label htmlFor="email">Insira seu email</label>
                <input 
                    type="text" 
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <span className="error">{state.errors.email}</span>
                <label htmlFor="password">Insira sua senha</label>
                <input 
                    type="password" 
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                />
                <span className="error">{state.errors.password}</span>
                <button type="submit">LOGIN</button>
                <p>Já tem uma conta? <Link to="/login" style={{textDecoration: 'none'}}>Login</Link></p>         
            </form>
        </div>
    );
}

export default Register;