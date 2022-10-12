//require all needed external resources
const Express = require('express');
const router = Express.Router();
const axios = require("axios").default;
const { jwtCheck } = require('../../check-jwt');
const cors = require('cors');

//retrieving models
const Users = require('../../models/Users.js');
const Block = require('../../models/Blocklist');
const Chats = require('../../models/Chats');


const options = {
    method: 'GET',
    url: 'https://tms.com',
    headers: {"authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InkzR3RhdGJTQWtxV2VwQkQ5Z19rViJ9.eyJpc3MiOiJodHRwczovL2Rldi0tZmUyc2c5di51cy5hdXRoMC5jb20vIiwic3ViIjoiZmttbFZHM3d0RTlPRXcxN2NKcm1rNGpYOHFOeTJ2VGlAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vdG1zLmNvbSIsImlhdCI6MTY2NTU5NjY2MywiZXhwIjoxNjY1NjgzMDYzLCJhenAiOiJma21sVkczd3RFOU9FdzE3Y0pybWs0alg4cU55MnZUaSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.L7ednXmd7H2gmr8mHnJDNB1n47jI3oSp4azXXGV5Behzsn9JXTl_PTN0DJ5lHFqIhzsE7suUW2kHgB_UNiEDOFz82EyrXW5DEV8l0QP3JMor4eBlH_GtkTXTIjxJx-AbK6OkIkhRjM9QXhPkeZGsYmHT9K45AU19jpxliFwtfBPOD81LS_pf-Ol2AqhNcesOIzLVl05Z3UV-jHp5SOSx_UWeo_oyOSYpYq2_7OM10IjBjEzgZQVAOP2w67rkmp3NPiSV0MifHbFrRZUoKAv3CmMlFzf3W5veUwg7XEmn8gXyybJQvdxOavr3jCtMl6mBF4ADHS2ZlNH_liWwrmnmIw"}
};
axios.request(options).then(function (response) {
    //console.log(response.data);
}).catch(function (error) {
    console.error(error);
});


//@route  GET api/users/set/
//@descr  Checks if anyone has blocked user
//@access Private
router.get('/set/:id', (req, res)=>{
    const id = req.params.id
    //console.log(id);
    Block.find({
        blockee_id:id
    })
    .sort({date: 1})
    .then(response => {
        //console.log(response.data)
        res.status(200).json(response);
    })
    .catch(err => res.json({success: false}));
});



//@route  GET api/users/sync
//@descr  Gets all users
//@access Private
router.get('/sync', (req, res)=>{    
    const userid = req.params.id
    axios.request(options).then(function (response) {
        //console.log(response.data);
        const stuffs = response.data
        const contactlist = stuffs.filter(function( contact ) {
            return contact.name !== userid;
        });
        contactlist.forEach(contact => {
            delete contact.identities;
        });

        //console.log(contactlist)
        
        res.status(200).json(contactlist);
    })
    .catch(function (error) {
    console.error(error);
    });
});



//@route  POST api/user
//@descr  Creates a user
//@access Private
router.post('/', (req, res)=>{
    const newUsers = new Users({
        userdeets: req.body.userdeets
    });
    newUsers.save()
    .then(users => {res.status(201).json(users)
    //console.log("data inserted successfully");
    })
    .catch(err => res.status(404).json({success: false}));
});

//@route  DELETE api/users/:id
//@descr  Deletes a user
//@access Private
router.delete('/:id', (req, res)=>{
    Users.findById(req.params.id)
    .then(users => users.remove().then(() => res.json({success:true})))
    .catch(err => res.status(404).json({success: false}));
});


//@route  POST api/users/block
//@descr  Allows for blocking a user using their id
//@access Private
router.post('/block',(req,res)=>{
    const deets = req.body.options;
    //console.log(deets)
    Chats.updateMany({
        specialkey:deets.chatSpecialKey
    },{
        blocked:true
    });
    const newBlock = new Block({

        blocker_id :deets.blocker_id,
        blocker_name :deets.blocker_name,
        blockee_id :deets.blockee_id,
        blockee_name :deets.blockee_name,
        blocker_mail :deets.blocker_mail,
        blockee_mail :deets.blockee_mail,
        blocker_dispName :deets.blocker_dispName,
        blockee_dispName :deets.blockee_dispName,
        chatspecialkey : deets.chatSpecialKey
    })
    newBlock.save()
    .then(blockdetails => {
    //console.log(blockdetails)
    //console.log(`data was inserted successfully: ${blockdetails}`);
    res.status(201).json(blockdetails);
    }) 
    .catch(err => console.log(err));
})


//@route  DELETE api/users/unblock
//@descr  Allows for unblocking a user using their id
//@access Private
router.delete('/unblock/:id',(req,res)=>{
    const id = req.params.id
    Block.deleteMany({
        blockee_id:id
    })
    .then(entry => {
        //console.log(entry);
        res.status(200).json({success:true})
    })
    .catch(err => console.log({success:false}));
})


//@route  UPDATE api/users/unblock/chat
//@descr  Allows for unblocking a user's chat using their id
//@access Private
router.put('/unblock/chat/:id',(req,res)=>{
    //console.log(req.params);
    const id = req.params.id;
    Chats.find({
        recpt_id:id
    })
    .then(entries => {
        //console.log(entries)
        entries.forEach(entry =>{
            entry.blocked = false;
        })
        res.status(200).json({success:true})
        //console.log(res.status);

    })
    .catch(err => console.log({success:false}));
})



//declare module exports
module.exports = router;