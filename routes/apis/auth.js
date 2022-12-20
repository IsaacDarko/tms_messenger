const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('config');
const auth = require('../../middleware/oauth')



//@route POST api/auth/verifytoken
//@desc Authenticates System Users
//@access Public*
router.get('/verifytoken', auth, (req, res) => {
    const user = req.user;
    if (!user) {
        console.log("token is expired or invalid");
    }
    res.status(200).json({
        data: user,
        auth: true
    })
})





//@route POST api/auth/
//@desc Logs in registered users(User Authentication)
//@access Public*
router.post('/', (req, res) => {
    const { index_num, password } = req.body.options;
    const today = moment();
    //validate input
    if (!index_num || !password) {
        return res.status(400).json("Please Provide Login Details")
    }
    //check if user is an already existing user if not return error
    User.findOne({
        index_num
    }).then(user => {
        if (!user) {
            return res.status(200).json({
                auth: false,
                token: null,
                user: {},
                message: "User does not exist"
            })
        }
    //if user exist proceed to log them in
        console.log(user);
        User.updateOne(
            { last_seen: today },
            { where: { index_num } }
        )
    //Validate Password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({
                    auth: false,
                    token: null,
                    user: {},
                    msg: "Invalid Credentials"
                });
                jwt.sign(
                    { userid: user.userid },
                    config.get('jwtSecret'),
                    { expiresIn: 86400 },
                    (err, token) => {
                        if (err) throw err;
                        res.status(200).json({ //return user data back to frontend
                            auth: true,
                            token,
                            user: {
                                userid: user.userid,
                                name: user.fullname,
                                index_num: user.index_num,
                                level: user.level,
                                username: user.username,
                                email: user.email,
                                faculty: user.faculty,
                                session: user.session,
                                last_seen: user.last_seen
                            },
                            message: "Logged in successfully"
                        });

                    }
                )

            })

    })

});





//@route POST api/auth/signup
//@desc Registers new users
//@access Public*
router.post('/signup', (req, res) => {
    const { username, userid, fullname, email, password, last_seen, level, faculty, session, index_num } = req.body;
    //validate input
    if (!userid || !fullname || !email || !index_num || !password || !level || !faculty || !session) {
        return res.status(400).json("Please Provide All Required Registration Details")
    }

    //check for already existing user
    User.findOne({
        index_num
    }).then(user => {
        if (user) {
            console.log(user);
            return res.status(400).json("User Exists")
        }

        //if user doesnt exist continue and register
        const newUser = new User({
            username,
            userid,
            fullname,
            email,
            password,
            last_seen,
            level,
            faculty,
            session,
            index_num
        });

        //Create Salt & Hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        jwt.sign(
                            { id: user.user_id },
                            config.get('jwtSecret'),
                            { expiresIn: 3600 },
                            (err, token) => {
                                if (err) throw err;
                                res.status(200).json({
                                    token,
                                    user: {
                                        username: user.username,
                                        userid: user.userid,
                                        fullname: user.fullname,
                                        email: user.email,
                                        last_seen: user.last_seen,
                                        level: user.level,
                                        faculty: user.faculty,
                                        session: user.session,
                                        index_num: user.index_num,
                                        picture: user.avatar
                                    }
                                });

                            }
                        )

                    })
            })
        })
    })
})


module.exports = router;