import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Login from './Login';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import LoginButton from './login-button';
import { GlobalContext } from '../Contexts/GlobalContext';
import SignupButton from './signup-button';
import '../Styles/SignupButton.css';
import '../Styles/Signup.css';
import moment from 'moment';

const Signup = () => {
    const { signup } = useContext(GlobalContext);
    const [authType, setAuthType] = useState('signup');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [compyear, setCompyear] = useState('')
    const [email , setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [level, setLevel] = useState('');  
    const [faculty, setFaculty] = useState('');    
    const [session, setSession] = useState('');    
    const [indexNum, setIndexNum] = useState('');
    const [ready, setReady] = useState(false);
    const [details, setDetails] = useState({});
    

    const today = moment();
   
    const now = moment(today).format("hh:mm:ss a");
    console.log(today.format())


    const setupOptions = (event) => {
        const fieldName = event.target.name;
        if (fieldName === 'username') {
            setUsername(event.target.value)
        } 
        else if (fieldName === 'fullname') {
            setFullname(event.target.value)
        } 
        else if (fieldName === 'compyear') {
            setCompyear(event.target.value)
        } 
        else if (fieldName === 'email') {
            setEmail(event.target.value)
        }
        else if (fieldName === 'level') {
            setLevel(event.target.value)
        } 
        else if (fieldName === 'password') {
            setPassword(event.target.value)
        } 
        else if (fieldName === 'repassword') {
            setRepassword(event.target.value)
        } 
        else if (fieldName === 'faculty') {
            setFaculty(event.target.value)
            
        }
        else if (fieldName === 'session') {
            setSession(event.target.value)
        }
        else if (fieldName === 'indexNum') {
            setIndexNum(event.target.value)
        }
        else{
            console.log('login form incomplete');
            return
        }
    }

    



  


    useEffect(() => {
        setDetails({
            'username': username,
            'userid': `${compyear}${indexNum}${faculty}`,
            'fullname': fullname,
            'email': email,
            'level': level,
            'faculty': faculty,
            'session': session,
            'index_num': indexNum,
            'password': password,
            'repassword': repassword,
            'lastSeen': today.format()
        })
        console.log(details)
    }, [ready]);




    return authType === 'signup' ? (        
        <div className="signup__body">
            <div className="signup__inner">
                <div className="signup__header">
                    <h4>Welcome To TMS</h4>
                </div>

                <div className="signup__FormFields">
                    <span className='sfields' >
                        <TextField required id="standard-required" name="username" label="Username"  variant="standard"
                            onChange={e => setupOptions(e)} />
                    </span>


                    <span className='sfields' >
                        <TextField required id="standard-required" name="email" label="Email" variant="standard"
                            onChange={e => setupOptions(e)} />
                    </span>

                    <span className='sfields' >
                        <TextField required id="standard-required" name="fullname" label="Full Name" variant="standard"
                            onChange={e => setupOptions(e)} />
                    </span>

                    <span className='sfields' >
                        <TextField required id="standard-required" name="compyear" label="Completion Year" variant="standard"
                            onChange={e => setupOptions(e)} />
                    </span>

                    <span className='sfields' >
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">Level</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='level'
                                label="Level"

                                onChange={e => setupOptions(e)}
                            >
                                <MenuItem value={'100'}>Level 100</MenuItem>
                                <MenuItem value={'200'}>Level 200</MenuItem>
                                <MenuItem value={'300'}>Level 300</MenuItem>
                                <MenuItem value={'400'}>Level 400</MenuItem>
                            </Select>
                        </FormControl>
                    </span>

                    <span className='sfields' >
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} >
                            <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='faculty'
                                label="Faculty"
                                fullWidth="true"
                                onChange={e => setupOptions(e)}
                            >
                                <MenuItem value={'FOI'}>Infomatics</MenuItem>
                                <MenuItem value={'Egineering'}>Egineering</MenuItem>
                                <MenuItem value={'Telecom'}>Telecommunication</MenuItem>
                                <MenuItem value={'Business'}>Business</MenuItem>
                            </Select>
                        </FormControl>
                    </span>

                    <span className='sfields' >
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} >
                            <InputLabel id="demo-simple-select-label">Session</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='session'
                                label="Session"
                                fullWidth="true"
                                onChange={e => setupOptions(e)}
                            >
                                <MenuItem value={'regular'}>Regular</MenuItem>
                                <MenuItem value={'morning'}>Morning</MenuItem>
                                <MenuItem value={'evening'}>Evening</MenuItem>
                                <MenuItem value={'weeekend'}>Weekend</MenuItem>
                            </Select>
                        </FormControl>
                    </span>

                    <span className='sfields' >
                        <TextField required id="standard-required" name="indexNum" label="Index Number" variant="standard"
                            onChange={e => setupOptions(e)} />
                    </span>

                    <span className='sfields' >
                        <TextField required id="standard-password-input" name="password" label="Password" type="password" variant="standard"
                            onChange={e => setupOptions(e)} />
                    </span>
                    
                    <span className='sfields' >
                        <TextField required id="standard-password-input" name="repassword" label="Repeat Password" type="password" variant="standard"
                            onChange={e => setupOptions(e)}
                            onBlur={() => setReady(!ready)} />
                    </span>

                </div>

                <div className="submition__buttons">
                    <div  className='sbutton__wrapper'>
                        <button
                            className="btn btn-primary btn-block"
                            onMouseEnter={() => setReady(!ready)}
                            onClick={() => signup(details)}
                        >
                            Sign Up
                        </button>                        
                    </div>

                    <div  className='sbutton__wrapper'>
                        <p className='login__span'>
                            Already have an account? 
                            <span onClick={() => setAuthType('login')}>
                                Login
                            </span>     
                        </p>
                    </div>

                </div>
            </div>
        </div>

    ) : (
        <Login />
    )
}

export default Signup;
