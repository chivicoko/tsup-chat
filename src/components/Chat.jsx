import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
import { EmojiEmotions, Info, InsertPhoto, LocalPhone, Mic, PhotoCamera, Videocam } from '@mui/icons-material';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({file: null, url: ""});

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
  const {currentUser} = useUserStore();
  // console.log(chatId, user.id, currentUser);

  // scroll to the bottom of the chat window
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);


  const handleEmoji = (event) => {
    setText(prev => prev + event.emoji);
    setOpen(false);
  };
  
  const handleImg = e => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {

      try {
        if (img.file) {
          imgUrl = await upload(img.file);
        }
      } catch (error) {
        console.log(error);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && {img: imgUrl}),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      // console.log(userIDs);

      userIDs.forEach(async (id) => {
  
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef)
  
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
  
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
  
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
  
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }

      });
      
    } catch (error) {
      console.log(error);
    }

    setImg({file: null, url: ""});
    setText("");
  };
  
  return (
    <div className='chat border-x border-[#dddddd35] flex flex-col h-full' style={{flex: '2'}}>
      <div className="top p-5 flex items-center justify-between border-b border-[#dddddd35]">
        <div className="user flex items-center gap-5">
          <img src={user?.avatar || "./avatar.png"} alt="user image" className='w-14 h-14 rounded-full object-cover' />
          <div className="texts flex flex-col">
            <span className='text-lg font-bold'>{user?.username}</span>
            <p className='text-sm font-medium text-[#a5a5a5]'>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
        </div>
        <div className="icons flex items-center justify-center gap-5">
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><LocalPhone/></span>
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><Videocam/></span>
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><Info/></span>
        </div>
      </div>

      <div className="center p-4 flex-1 overflow-y-scroll flex flex-col gap-5">
        {chat?.messages?.map((message) =>(
          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="text image" />}
              <p>{message.text}</p>
              {/* <span>{message.createdAt}</span> */}
            </div>
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="chat img" />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      <div className="bottom flex items-center justify-between gap-3 border-t border-[#dddddd35] mt-auto p-3">
        <div className="icons flex gap-2">
          <label htmlFor="file">
            <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><InsertPhoto/></span>
          </label>
          <input type="file" name="file" id="file" style={{display: 'none'}} onChange={handleImg} disabled={isCurrentUserBlocked || isReceiverBlocked} />

          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><PhotoCamera/></span>
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><Mic/></span>
        </div>
        <input className='flex-1 p-5 rounded-md text-md border-0 outline-none bg-[#11192880] text-white' type="text" placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot chat with this user" : "Type a message..."} value={text} onChange={e => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked} />
        <div className="emoji relative w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4">
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4" onClick={() => setOpen(prev => !prev)}><EmojiEmotions/></span>
          <div className="picker absolute bottom-12 left-0">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked} className="bg-[#8e44ad] border border-[#8e44ad] hover:bg-[#8d44adad] hover:border-[#8d44adad] py-3 px-5 rounded-md shadow-lg">Send</button>
      </div>
    </div>
  )
}

export default Chat