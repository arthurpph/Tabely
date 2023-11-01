import { Link } from "react-router-dom";
import '../assets/styles/Register.css'

function Register() {
    return (
        <div className="registercontainer" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h1>REGISTER</h1>
            <form action="/register" method="POST" className="registerform">
                <label htmlFor="nickname">Insira seu nome de usuário</label>
                <input type="text" name="nickname"/>
                <label htmlFor="password">Insira sua senha</label>
                <input type="password" name="password"/>
                <button type="submit">LOGIN</button>
                <p>Já tem uma conta? <Link to="/login" style={{textDecoration: 'none'}}>Login</Link></p>         
            </form>
        </div>
    );
}

export default Register;