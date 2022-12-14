//require all needed external resources
const Express = require('express');
const router = Express.Router();
const Mongoose = require('mongoose');
const Pusher = require('pusher');
const cors = require('cors');

//retrieving model
const Chats = require('../../models/Chats');
const UserMessage = require('../../models/UserMessage');
const Users = require('../../models/Users.js');
const Block = require('../../models/Blocklist');

//initialising express
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
//setting up headers using cors package
app.use(cors());

const pusher = new Pusher({
    appId: "1491305",
    key: "065b735aac4bdf5f677d",
    secret: "e454d1289d468212e5d5",
    cluster: "mt1",
    useTLS: true,
});




//@route  GET api/chats/sync
//@descr  Gets all user chats
//@access Private
router.get('/sync', (req, res) => {
    Chats.find()
        .sort({ date: -1 })
        .then(response => {
            //console.log(response.data)
            res.status(200).json(response);
        })
        .catch(err => res.json({ success: false }));
});



//@route  POST api/chats
//@descr  Post a newly started chat
//@access Private 
router.post('/', (req, res) => {
    //console.log(req.body);
    const freshChat = req.body.options;
    console.log(freshChat);
    const spkey = freshChat.secretKey;
    //console.log(`so we popped both ids to get key fragments and here they are: ${keyfrag1String} and ${keyfrag2String}`);

    //console.log(chatKey);
    const convo = [{
        recpt_id: freshChat.sndrs_id,
        recpt_name: freshChat.sndrs_name,
        sndrs_id: freshChat.recpt_id,
        sndrs_name: freshChat.recpt_name,
        recpt_mail: freshChat.sndrs_mail,
        sndrs_mail: freshChat.recpt_mail,
        recptdispName: freshChat.sndrsdispName,
        sndrsdispName: freshChat.recptdispName,
        recptdispPic: freshChat.sndrsPicture,
        sndrsdispPic: freshChat.recptPicture,
        specialkey: freshChat.secretKey,
        blocked: false,
        last_msge: freshChat.last_mesge,
        msges_num: freshChat.numofmsges
    },
    {
        recpt_id: freshChat.recpt_id,
        recpt_name: freshChat.recpt_name,
        sndrs_id: freshChat.sndrs_id,
        sndrs_name: freshChat.sndrs_name,
        recpt_mail: freshChat.recpt_mail,
        sndrs_mail: freshChat.sndrs_mail,
        recptdispName: freshChat.recptdispName,
        recptdispPic: freshChat.recptPicture,
        sndrsdispName: freshChat.sndrsdispName,
        specialkey: freshChat.secretKey,
        blocked: false,
        last_msge: freshChat.last_mesge,
        msges_num: freshChat.numofmsges
    }]
    Chats.findOne({
        specialkey: spkey
    }).then(data => {
        console.log(data)
        if (!data) {
            Chats.collection.insertMany(convo, function (err, docs) {
                if (err) {
                    return console.error(err);
                } else {
                    //console.log(docs);
                    res.status(200).json("chat created")
                }
            });
        } else {
            console.log("chat instance exists")
            res.json('chat already exists');
        }
    })
})




//@route  GET api/chats/chat/:id
//@descr  Gets all of a particular user's chats using their id
//@access Private
router.get('/chat/:id', (req, res) => {
    //console.log(req.params.keys);
    const id = req.params.id;
    //console.log(id);
    Chats.find({
        sndrs_id: id
    })
        .sort({ date: 1 })
        .then(chats => {
            res.status(200).json(chats)
        }).catch(err => console.log(err))
})



//@route  DELETE api/chats/:id
//@descr  Deletes a chat
//@access Private
router.delete('/:id', (req, res) => {
    //console.log(req.params)
    const csk = req.params.id
    //console.log(csk);
    Chats.deleteMany({
        specialkey: csk
    })
        .then(chat => {
            //console.log(chat)
            UserMessage.deleteMany({
                chatspecialkey: csk
            }).then(messages => {
                res.status(200).json("Deleted");
            })
        })
        .catch((err) => {
            res.json({ success: false })
        })
});


//declare module exports
module.exports = router;