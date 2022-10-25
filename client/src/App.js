import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes } from 'react-router-dom';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import StartChatModal from './Components/StartChatModal';
import Login from './Components/Login';
import Pusher from "pusher-js";
import axios from './axios';


function App() {
  const [userdeets, setUserdeets] = useState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [show, setShow] = useState();
  const [contactlist, setContactlist] = useState([]);
  const [gotId, setGotId] = useState(false);
  const [chatId, setChatId] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isChatId, setIsChatId] = useState(false);
  const [chatsExist, setChatsExist] = useState(false);
  const [msgesNum, setMsgesNum] = useState(0);
  const [messageMine, setMessageMine] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [loggedInUser, setLoggedInUser] = useState({});
  const [currentChat, setCurrentChat] = useState({});


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const url = `http://localhost:5000/api/auth/verifytoken`
      const config = {
        headers: {
          'x-auth-token': token
        }
      }
      axios.get(url, config)
        .then(res => {
          const authStatus = res.data.auth
          console.log(res);
          if (authStatus === true) {
            const currUser = JSON.parse(localStorage.getItem('user'));
            console.log(currUser);
            setUser(currUser);
            setIsAuthenticated(true);
          }
        })
    } else {
      logout();
    }
  }, [])



  //make necessary changes to the setup useEffect when authorized
  useEffect(() => {
    console.log(user)
    if (user === undefined || user === []) {
      setLoggedInUser(user);
    } else {
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user);
      retrieveUsersChats();
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);



  const login = (logs) => {
    const { index_num, password } = logs;
    console.log(`index: ${index_num} and password: ${password}`)
    if (!index_num || !password) {
      console.log('Fill all forms');
    }
    const options = {
      "index_num": index_num,
      "password": password
    }
    console.log(options);
    axios.post('http://localhost:5000/api/auth/', {
      options
    }).then(res => {
      console.log(res);
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token)
    }).catch(err => console.log(`there was an login API Error : ${err}`))
  }


  const localShred = () => {
    let values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
      localStorage.removeItem(keys[i])
    }

    return values;
  }


  const logout = () => {
    let itemsRemoved = localShred()
    console.log(itemsRemoved);
    setIsAuthenticated(false);
  }



  const chatRejuvinate = () => {
    const recpt = JSON.parse(localStorage.getItem('currentUser'));
    const chatid = localStorage.getItem('chatid');
    console.log(chatid)
    setChatId(chatid)
    console.log(recpt)
    const recptid = recpt.userid;
    console.log(recptid)
    axios.get('api/users/sync')
      .then(res => {
        console.log(res)
        const users = res.data;
        console.log(users);
        let currUser = {};
        currUser = users.find(user => {
          return user.userid === recptid
        })
        console.log(currUser);
        setCurrentChat(currUser);
        localStorage.setItem('currentChat', JSON.stringify(currUser))
      }).catch(err => console.log(err))
  }



  useEffect(() => {
    console.log(currentChat)
  }, [currentChat])



  const retrieveUsersChats = () => {
    const myself = user
    console.log(myself)
    const id = myself.userid;
    console.log(id);
    axios.get(`api/chats/chat/${id}`)
      .then(res => {
        console.log(res.data);
        setChats(res.data)
        const currChat = res.data[0];
        console.log(currChat);
        localStorage.setItem('currentChat', JSON.stringify(currChat))
      }).catch(err => console.log(`there was an API Error : ${err}`));
  }



  const switchOff = () => {
    setShow(null);
  }


  const blockUser = () => {
    const options = JSON.parse(localStorage.getItem('selectedBlock'));
    console.log(options)
    axios.post('api/users/block/', {
      options
    }).then((res) => {
      console.log(res)
      const blockee = res.data
      const blockeeid = blockee.id;
      const blockeename = blockee.name;
      console.log(`alright so these are new blockeeid: ${blockeeid} and their name is ${blockeename}`);
      alert("Blocked")
    })
      .catch(() => console.log('Block Attempt Failed'))
  }



  const unblockUser = () => {
    const userid = localStorage.getItem('unblockeeId');
    const id = userid.replace(/^"(.*)"$/, '$1');
    console.log(id);
    axios.delete(`api/users/unblock/${id}`)
      .then(res => {
        if (res.status === 200) {
          axios.put(`api/users/unblock/chat/${id}`)
            .then(response => {
              console.log(res)
              if (response.status === 200) {
                alert('user unblocked')
              } else (
                console.log('There was a problem unblocking this user')
              )
            })
        }
      })
  }



  const fetchChat = () => {
    const id = localStorage.getItem('chatid');
    const csk = localStorage.getItem('chatSpecialKey');
    console.log(id);
    console.log(csk);
    if (csk !== null || csk !== [] || csk !== '') {
      axios.get(`/api/messages/chat/${csk}`)
        .then(response => {
          if (response.status === 200) {
            console.log(response);
            const data = response.data
            console.log(data);
            setMessages(data);
            setChatId(id);
            console.log(messages);
          } else {
            console.log('there was a problem retrieving the messages for this chat, trying checking if the user is submitted')
          }
        }).catch()

    } else {
      console.log('No chat id was detected')
    }
  }



  const addNewChat = (e) => {
    e.preventDefault();
    console.log(user)
    const { userid } = user;
    console.log(userid);
    const id = userid;
    axios.get(`api/users/set/${id}`)
      .then(response => {
        const enemy = response.data;
        console.log(enemy);
        let enemyCount = 0;
        enemy.forEach(idiot => {
          enemyCount++
        })
        if (enemyCount > 0) {
          let blockInstances = 0;
          enemy.forEach(() => {
            blockInstances++
          })
          if (blockInstances === 0) {
            console.log('adduser if condition fired')
            axios.get('api/users/sync')
              .then(res => {
                const contacts = res.data
                const contactlist = contacts.filter(contact =>
                  contact.userid !== userid
                )
                console.log(contacts);
                setContactlist(contactlist);
              })
          } else if (blockInstances > 0) {
            const enemy_ids = enemy.reduce(
              (arr, elem) => arr.concat(elem.blocker_id), []
            );
            console.log(enemy_ids)
            axios.get('api/users/sync')
              .then(res => {
                console.log('adduser elseif condition fired')
                console.log(enemy_ids);
                const contacts = res.data;
                console.log(contacts)
                for (let i = 0; i < enemy_ids.length; i++) {
                  const enemy_id = enemy_ids[i];
                  const friends = contacts.filter(contact =>
                    contact.userid !== enemy_id && contact.userid !== userid
                  )
                  console.log(friends);
                  setContactlist(friends);
                }
              })
          } else {
            console.log('adduser else condition fired')
            axios.get('api/users/sync')
              .then(res => {
                const contacts = res.data
                const contactlist = contacts.filter(contact =>
                  contact.userid !== userid
                )
                console.log(contacts);
                setContactlist(contactlist);
              })
          }

        } else {
          console.log('chatCount is 0')
          axios.get('api/users/sync')
            .then(res => {
              const contacts = res.data
              const contactlist = contacts.filter(contact =>
                contact.userid !== userid
              )
              console.log(contacts);
              setContactlist(contactlist);
              console.log(contactlist)
            })
        }


      })
  }



  const selectUser = () => {
    const options = JSON.parse(localStorage.getItem('selectedUser'));
    if (options) {
      console.log(options);
      axios.post(`api/chats/`, {
        options
      }
      ).then(response => {
        console.log(response.data);
        const info = response.data;
        localStorage.removeItem('selectedUser');
        // eslint-disable-next-line no-unused-vars
        setIsChatId(true);
        window.location.reload(false);
      })
        .catch(err => console.log(err))
    } else {
      alert('Please select a user');
    }

  }


  const deleteNow = () => {
    const rawId = localStorage.getItem('selectedDel');
    console.log(rawId);
    const id = rawId.replace(/^"(.*)"$/, '$1'); //removes double quotes from a string 
    axios.delete(`api/chats/${id}`)
      .then(res => {
        console.log(res)
        alert(res.data)
        setIsChatId(false);
        retrieveUsersChats()
      })
  }




  //Almighty pusher-useEffect function...the main engine for the messaging system
  useEffect(() => {
    const pusher = new Pusher('065b735aac4bdf5f677d', {
      cluster: 'mt1'
    });

    const messageChannel = pusher.subscribe('messages');
    const chatChannel = pusher.subscribe('chats');

    messageChannel.bind('inserted', function (newMessage) {
      setMessages([...messages, newMessage]);
      console.log(newMessage);
      const myName = user.name;
      console.log(myName)
      console.log(newMessage.name);
      if (newMessage.name !== myName) {
        setMessageMine();
      } else {
        setMessageMine(true)
      }
    });
    chatChannel.bind('inserted', function (newChat) {
      setChats([...chats, newChat]);
      console.log(newChat)
      fetchChat();
    });
    return () => {
      messageChannel.unbind_all();
      messageChannel.unsubscribe();
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, chats]);

  console.log(messages);
  console.log(chats);




  return isAuthenticated ? (

    //using the BEM naming convention
    <div className="app">

      <div className="app__body">
        <StartChatModal user={user} contactlist={contactlist} show={show} setShow={setShow} switchOff={switchOff} selectUser={selectUser} />
        <Sidebar userdeets={userdeets} setIsChatId={setIsChatId} unblockUser={unblockUser} chatsExist={chatsExist} setChatsExist={setChatsExist} chatRejuvinate={chatRejuvinate} retrieveUsersChats={retrieveUsersChats} blockUser={blockUser} chats={chats} user={user} show={show} setShow={setShow} addNewChat={addNewChat} fetchChat={fetchChat} contactlist={contactlist} deleteNow={deleteNow} gotId={gotId} setGotId={setGotId} msgesNum={msgesNum} setMsgesNum={setMsgesNum} />
        <Chat messageMine={messageMine} isChatId={isChatId} setIsChatId={setIsChatId} chatId={chatId} setChatId={setChatId} chatRejuvinate={chatRejuvinate} currentChat={currentChat} messages={messages} user={user} chats={chats} setMessages={setMessages} fetchChat={fetchChat} logout={logout} msgesNum={msgesNum} setMsgesNum={setMsgesNum} />
      </div>

    </div>

  ) : (
    <Login login={login} />
  )
}

export default App;
