import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const LoginForm = () => {
    // Context
    const { loginUser } = useContext(AuthContext);

    //alert message
    const [alert, setAlert] = useState(null);

    // router
    const navigate = useNavigate();

    // Local state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: '',
    });

    const { username, password } = loginForm;

    const onChangeLoginForm = (event) => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    };

    const login = async (event) => {
        event.preventDefault();
        try {
            const loginData = await loginUser(loginForm);
            if (loginData.success) {
                setAlert({ type: 'danger', message: loginData.message });
                setTimeout(() => setAlert(null), 3000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Form onSubmit={login}>
                <AlertMessage info={alert} />
                <Form.Group>
                    <Form.Label htmlFor='loginUsername' className='labelForm'>
                        Username
                    </Form.Label>
                    <Form.Control
                        id='loginUsername'
                        type='text'
                        placeholder='Username'
                        name='username'
                        required
                        value={username}
                        onChange={onChangeLoginForm}
                    />
                    <Form.Label htmlFor='loginPassword' className='labelForm'>
                        Password
                    </Form.Label>
                    <Form.Control
                        id='loginPassword'
                        type='text'
                        placeholder='Password'
                        name='password'
                        required
                        value={password}
                        onChange={onChangeLoginForm}
                    />
                </Form.Group>
                <Button variant='success' type='submit'>
                    Login
                </Button>
            </Form>
            <p>
                Don't have an account?
                <Link to='/register'>
                    <Button variant='info' size='sm' className='ml-2'>
                        Register
                    </Button>
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
