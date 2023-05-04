import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

import learnItLogo from '../assets/logo.svg';
import logoutIcon from '../assets/logout.svg';

const NavbarMenu = () => {
    const {
        authState: {
            user: { username },
        },
        logoutUser,
    } = useContext(AuthContext);

    const logout = () => logoutUser();

    return (
        <Navbar expand='lg' bg='secondary' variant='dark' className='shadow'>
            <Container>
                <Navbar.Brand className='font-weight-bolder text-white'>
                    <img
                        src={learnItLogo}
                        alt='learnItLogo'
                        width='32'
                        height='32'
                        className='mr-2'
                    />
                    LearnIt
                </Navbar.Brand>

                <Navbar.Toggle aria-controls='basic-navbar-nav' />

                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link
                            className='font-weight-bolder text-white'
                            to='/dashboard'
                            as={Link}
                        >
                            Dashboard
                        </Nav.Link>
                        <Nav.Link
                            className='font-weight-bolder text-white'
                            to='/about'
                            as={Link}
                        >
                            About
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href='#memes'>Welcom {username} </Nav.Link>
                        <Button
                            variant='secondary'
                            className='font-weight-bolder text-white'
                            onClick={logout}
                        >
                            <img
                                src={logoutIcon}
                                alt='logoutIcon'
                                width='32'
                                height='32'
                                className='mr-2'
                            />
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarMenu;
