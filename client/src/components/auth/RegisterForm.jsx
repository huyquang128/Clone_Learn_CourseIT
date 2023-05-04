import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const RegisterForm = () => {
    // Context
    const { registerUser } = useContext(AuthContext);

    //alert message
    const [alert, setAlert] = useState(null);

    // Local state
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const { username, password, confirmPassword } = registerForm;

    const onChangeRegisterForm = (event) => {
        setRegisterForm({
            ...registerForm,
            [event.target.name]: event.target.value,
        });
    };

    const register = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setAlert({ type: 'danger', message: 'Passwords do not match' });
            setTimeout(() => setAlert(null), 5000);
            return;
        }

        try {
            const registerData = await registerUser(registerForm);
            if (!registerData.success) {
                setAlert({ type: 'danger', message: registerData.message });
                setTimeout(() => setAlert(null), 3000);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Form onSubmit={register}>
                <AlertMessage info={alert} />
                <Form.Group>
                    <Form.Label
                        htmlFor='registerUsername'
                        className='labelForm'
                    >
                        Username
                    </Form.Label>
                    <Form.Control
                        id='registerUsername'
                        type='text'
                        placeholder='Username'
                        name='username'
                        required
                        value={username}
                        onChange={onChangeRegisterForm}
                    />
                    <Form.Label
                        htmlFor='registerPassword'
                        className='labelForm'
                    >
                        Password
                    </Form.Label>
                    <Form.Control
                        id='registerPassword'
                        type='text'
                        placeholder='Password'
                        name='password'
                        required
                        value={password}
                        onChange={onChangeRegisterForm}
                    />
                    <Form.Label
                        htmlFor='registerConfirmPassword'
                        className='labelForm'
                    >
                        confirmPassword
                    </Form.Label>
                    <Form.Control
                        id='registerConfirmPassword'
                        type='text'
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        required
                        value={confirmPassword}
                        onChange={onChangeRegisterForm}
                    />
                </Form.Group>
                <Button variant='success' type='submit'>
                    Register
                </Button>
            </Form>
            <p>
                Already have an account?
                <Link to='/login'>
                    <Button variant='info' size='sm' className='ml-2'>
                        Login
                    </Button>
                </Link>
            </p>
        </>
    );
};

export default RegisterForm;
