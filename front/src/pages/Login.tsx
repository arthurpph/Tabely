import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/CustomToast.css';
import '../assets/styles/Login.css';

function Login() {
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.success('Login realizado')
    }

    return (
        <div className="logincontainer" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h1>LOGIN</h1>
            <form onSubmit={handleLogin} action="/login" method="POST" className="loginform">
                <label htmlFor="nickname">Insira seu nome de usuário</label>
                <input type="text" name="nickname"/>
                <label htmlFor="password">Insira sua senha</label>
                <input type="password" name="password"/>
                <button type="submit">LOGIN</button>
                <p>Não tem uma conta? <Link to="/register" style={{ textDecoration: 'none' }}>Registre-se</Link></p>         
            </form>
        </div>
    );
}

export default Login;