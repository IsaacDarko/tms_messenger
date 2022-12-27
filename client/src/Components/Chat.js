import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../Contexts/GlobalContext';import '../Styles/Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined } from '@material-ui/icons';
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import axios from '../axios';
import LogoutButton from './logout-button';


const Chat = () => {
    const { user, chatId, setChatId, isChatId, fetchChat, messages, messageMine, currentChat, chats, logout } = useContext(GlobalContext);
    const [endPicture, setEndPicture] = useState('');
    const [endName, setEndName] = useState('');
    const [endLastSeen, setEndLastSeen] = useState('');
    console.log(user);
    console.log(messages);
    const [input, setInput] = useState('');
    const currChat = localStorage.getItem('currentChat');


    useEffect(() => {
        console.log(currentChat)
        unlock();
        setup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, isChatId, messages, messageMine]);


    useEffect(() => {
        setup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, endPicture, endName, endLastSeen]);


    const unlock = () => {
        console.log(isChatId)
        if (isChatId === false) {
            console.log('ChatPage Unlock Failed...No chats exist in this account')
        } else {
            console.log('ChatPage Unlock Successful')

        }
    }

    const setup = () => {
        console.log(chatId);
        if (currentChat === undefined || currentChat === null) {
            setEndPicture('')
            setEndName('Name')
            setEndLastSeen('Recently')
        }
        else {
            const { picture, fullname, last_seen } = currentChat;
            setEndPicture(picture)
            setEndName(fullname)
            setEndLastSeen(last_seen)
        }
    }


    const sendMessage = (e) => {
        e.preventDefault();
        const chatid = localStorage.getItem('chatid');
        const specialkey = localStorage.getItem('chatSpecialKey');
        const details = JSON.parse(localStorage.getItem('currentUser'));
        console.log(`message chat id: ${chatid}, specialkey: ${specialkey}, message details: ${details}`)
        console.log(details);
        console.log(details.displayname);
        console.log(chatid);
        if (chatid !== null || chatid !== '') {
            axios.post('http://localhost:5000/api/messages', {
                chatid: chatid,
                message: input,
                sendername: user.name,
                senderid: user.userid,
                sndrsdispname: user.name,
                receivername: details.name,
                receiverspic: details.pic,
                receiverdispname: details.name,
                chatSpecialKey: specialkey
            }).then(response => {
                console.log(response);
                if (response.status === 208) {
                    alert('This User Has Blocked You')
                } else if (response.status === 200) {
                    setInput("");
                    fetchChat();
                } else {
                    console.log(`Something's not right the message was not sent`)
                }
            })
                .catch(err => console.log(err))

        } else {
            alert("Please select an existing chat or start a new one before sending a message")
        }
    }





    return !chatId ? (
        <div className="chat">

            <div className="chat__header">
                <Avatar />

                <div className="chat__headerInfo">
                    <h3>Name</h3>
                    <h5>Last Seen: ...</h5>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <LogoutButton logout={logout} />
                </div>

            </div>


            <div className="chat__body">
                <h4 >Select an existing conversation or start A New One</h4>
            </div>


            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={e =>
                        setInput(e.target.value)} placeholder="type a message" type="text" />
                    <button onClick={() => {
                        alert('You need to select a chat first before sending a message')
                    }
                    } type="submit"><SendIcon /></button>
                </form>
            </div>

        </div>

    ) : (
        <div className="chat">

            <div className="chat__header">
                <Avatar src={endPicture} />

                <div className="chat__headerInfo">
                    <h3>{endName}</h3>
                    <p><h5>Last Seen: </h5>{endLastSeen}....</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <LogoutButton logout={logout} />
                </div>

            </div>


            <div className="chat__body">
                {messages.map((message) => (
                    
                    <div className="message__container" key={message._id}>
                        <p className={user.name === message.sendername ? 'chat__message sender__myself' : 'chat__message' }>
                            <span className="chat__name">{message.senderid === user.userid ?  user.name : currChat.fullname }</span>
                            {message.message}
                            <span className="chat__timestamp">
                                {message.timestamp}
                            </span>
                        </p>
                    </div>
                ))}
            </div>


            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={e =>
                        setInput(e.target.value)} placeholder="type a message" type="text" />
                    <button onClick={sendMessage} type="submit"><SendIcon /></button>
                </form>
            </div>

        </div>

    )
}

export default Chat;