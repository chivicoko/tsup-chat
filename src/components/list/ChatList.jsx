import { useEffect, useState } from "react";
import { useUserStore } from "../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { Add, Remove, Search } from "@mui/icons-material";
import AddUser from "./AddUser";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const {currentUser} = useUserStore();
  const {changeChat} = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return {...item, user};
      });

      const chatData = await Promise.all(promises);

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));

      // console.log("Current chats: ", chatData);
    });

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect =async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, 'userchats', currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }

  }

  const filteredChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className='chatList flex-1 overflow-y-scroll'>
      <div className="search flex items-center gap-2 p-4">
        <div className="searchBar bg-[#11192880] flex-1 flex items-center rounded-lg p-2 gap-2">
          <Search/>
          <input type="text" placeholder="Search..." onChange={(e) => setInput(e.target.value)} className="flex-1 text-white border-0 ring-0 outline-none bg-transparent" />
        </div>
        <button className="bg-[#11192880] cursor-pointer p-2 rounded-lg" onClick={() => setAddMode(prev => !prev)}> {addMode ? <Remove/> : <Add/>} </button>
      </div>
      
      {filteredChats.map((chat) => (
        <div className={`${chat?.isSeen ? "bg-transparent" : "bg-[#8d44adad]"} flex items-center gap-3 p-4 cursor-pointer border-b border-b-[#dddddd35] item`} key={chat.chatId} onClick={() => handleSelect(chat)} style={{backgroundColor: chat?.isSeen ? "transparent" : "#8d44adad",}}>
          <img src={ chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="user image" className="w-14 h-14 rounded-full object-cover flex1" />
          <div className="texts flex flex-col gap-3 flex-wrap">
            <span className="font-bold">{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p className="font-semibold text-xs">{chat?.lastMessage !== '' ? chat?.lastMessage?.split(' ').slice(0, 9).join(' ') + ' ...' : ''}</p>
          </div>
        </div>
      ))}
      
      {addMode && <AddUser/>}
    </div>
  )
}

export default ChatList