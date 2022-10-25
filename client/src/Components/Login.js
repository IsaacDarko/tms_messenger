import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import LoginButton from './login-button';
import SignupButton from './signup-button';
import '../Styles/LoginButton.css';
import '../Styles/Login.css';

function Login({ login }) {
    const [logs, setLogs] = useState({});
    const [index, setIndex] = useState('');
    const [password, setPassword] = useState('')
    const [ready, setReady] = useState(false);

    const setupLogs = (event) => {
        const fieldName = event.target.name;
        if (fieldName === 'index_num') {
            setIndex(event.target.value)
        } else if (fieldName === 'password') {
            setPassword(event.target.value)
        } else {
            console.log('login form incomplete');
            return
        }
    }


    useEffect(() => {
        setLogs({
            'index_num': index,
            'password': password
        })
        console.log(logs)
    }, [ready])


    return (
        <div className="login__body">
            <div className="login__inner">
                <div className="login__header">
                    <h4>Welcome To TMS</h4>
                </div>

                <div className="login_FormFields">
                    <TextField required id="standard-required" name="index_num" label="Index Number" variant="standard"
                        onChange={e => setupLogs(e)} />

                    <TextField required id="standard-password-input" name="password" label="Password" type="password" variant="standard"
                        onChange={e => setupLogs(e)} />
                </div>
                <div className="submition__buttons">
                    <div>
                        <LoginButton ready={ready} setReady={setReady} login={login} logs={logs} />
                    </div>
                    <div>
                        <SignupButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
