import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../Contexts/GlobalContext';
import { Avatar } from '@material-ui/core';
import '../Styles/StartChatModal.css';


const StartChatModal = () => {
    const { user, chats, contactlist, selectUser, show, switchOff } = useContext(GlobalContext);

    const [recptId, setRecptId] = useState('');
    const [recptName, setRecptName] = useState('');
    const [recptMail, setRecptMail] = useState('');
    const [dispName, setdispName] = useState('');
    const [dispPic, setdispPic] = useState('');
    const [recptIndex, setRecptIndex] = useState('');

    const [selectedUser, setSelectedUser] = useState({});

    const toggle = () => {
        switchOff();
    }


    const secureContactDeets = () => {
        console.log("starting secure deets");
        const reciepient = {
            'recpt_id': recptId,
            'recpt_name': recptName,
            'sndrs_id': user.userid,
            'sndrs_name': user.name,
            'recpt_mail': recptMail,
            'sndrs_mail': user.email,
            'recptdispName': dispName,
            'recptPicture': dispPic,
            'sndrsdispName': user.name,
            'sndrsPicture': user.picture,
            'secretKey': `${recptId}-${user.index_num}${recptIndex}-${user.userid}`,
            'last_mesge': "",
            'numofmsges': 0
        }
        console.log(reciepient);
        setSelectedUser(reciepient);
        console.log(selectedUser);
        const prevSelectedUser = localStorage.getItem('selectedUser')
        console.log(`this is the previous saved user: ${prevSelectedUser}`)
        localStorage.removeItem('selectedUser')
        localStorage.setItem('selectedUser', JSON.stringify(reciepient));
        selectUser()
    }
 

    useEffect((e) => {
        // eslint-disable-next-line no-mixed-operators
        if (chats !== undefined && recptId !== '' && recptName !== '' && recptMail !== '' && dispName !== '') {
            secureContactDeets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recptId, recptName, recptMail, dispName])


    return show ? (

        <div className="modal__wrapper" onClick={() => toggle()}>
            <div className="modal__inner">
                <div className="modal__body" style={{ zIndex: 1 }}>
                    {contactlist.map((contact) => (
                        <div className="user__select" key={contact.user_id} onClick={() => {
                            setRecptId(`${contact.userid}`);
                            setRecptIndex(`${contact.index_num}`)
                            setRecptMail(`${contact.email}`);
                            setRecptName(`${contact.fullname}`);
                            setdispName(`${contact.fullname}`);
                            setdispPic(`${contact.picture}`);
                        }}>
                            <p>
                                {contact.faculty} {contact.level}
                                <Avatar src={`${contact.picture}`} />
                                {contact.fullname}
                            </p>
                        </div>
                    )
                    )}
                </div>
            </div>
        </div>

    ) : (
        null
    )
}

export default StartChatModal
