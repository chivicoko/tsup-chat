import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../lib/userStore";
import { Person } from "@mui/icons-material";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();

  const handleSearch = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col gap-8 p-6 rounded-lg w-fit h-fit absolute top-0 bottom-0 left-0 right-0 m-auto bg-[#111928E1]'>
      <form onSubmit={handleSearch} className="flex items-center justify-center gap-2">
        <div className="bg-[#11192899] pl-3 flex items-center justify-center border rounded-lg border-[#8e44ad] focus-within:border-[#8e44ad] focus-within:ring-1 focus-within:ring-[#8e44ad] focus-within:shadow-[0_0_10px_0_rgba(142,68,173,0.5),0_0_20px_5px_rgba(142,68,173,0.05)]">
          <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0">
              <Person />
          </span>
          <input type="text" placeholder="Username..." name="username" className="bg-transparent p-3 ml-2 rounded-md shadow-lg w-full border-0 text-base text-white leading-tight focus:outline-0 focus:ring-0" />
        </div>
        <button className="bg-[#8e44ad] border border-[#8e44ad] hover:bg-[#8d44adad] hover:border-[#8d44adad] py-2 px-4 rounded-md shadow-lg">Search</button>
      </form>

      {user && 
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={ user.avatar || "./avatar.png"} alt="user image" className="w-14 h-14 object-cover rounded-full" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd} className="bg-[#8e44ad] hover:bg-[#8d44adad] py-3 px-4 rounded-md shadow-lg">Add User</button>
        </div>
      }
    </div>
  )
}

export default AddUser;