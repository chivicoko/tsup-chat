import { useEffect } from "react"
import Chat from "./components/Chat"
import Detail from "./components/Detail"
import List from "./components/list/List"
import Login from "./components/Login"
import Notification from "./components/notification/Notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"

const App = () => {

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      // console.log(user.uid);
    })

    return () => unSub() // Clean up the subscription when the component unmounts
  }, [fetchUserInfo]);

  // console.log(currentUser);

  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
        </>
      ) : (<Login/>)}
      <Notification/>
    </div>
  )
}

export default App