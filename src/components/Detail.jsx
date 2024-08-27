import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { FileDownload, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useUserStore } from '../lib/userStore';
import { useChatStore } from '../lib/chatStore';

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      changeBlock();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='detail flex-1 overflow-y-scroll'>
      <div className="user py-6 px-4 flex flex-col items-center gap-3 border-b border-b-[#dddddd35]">
        <img src={user?.avatar || "./avatar.png"} alt="User Avatar" className='w-24 h-24 rounded-full object-cover' />
        <h2 className='font-bold'>{user?.username}</h2>
        <p className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
      </div>

      <div className="info p-4 flex flex-col gap-4">
        <div className="option">
          <div className="title flex items-center justify-between">
            <span className=''>Chat Settings</span>
            <span className='w-8 h-8 p-2 flex items-center justify-center rounded-full cursor-pointer bg-[#1119284D]'><KeyboardArrowDown/></span>
          </div>
        </div>
        <div className="option">
          <div className="title flex items-center justify-between">
            <span className=''>Privacy & Help</span>
            <span className='w-8 h-8 p-2 flex items-center justify-center rounded-full cursor-pointer bg-[#1119284D]'><KeyboardArrowDown/></span>
          </div>
        </div>
        <div className="option">
          <div className="title flex items-center justify-between">
            <span className=''>Shared photos</span>
            <span className='w-8 h-8 p-2 flex items-center justify-center rounded-full cursor-pointer bg-[#1119284D]'><KeyboardArrowUp/></span>
          </div>
          <div className="photos flex flex-col gap-3 mt-3">
            <div className="photoItem px-3 flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img src="./self-sculpture.jpg" alt="media photo" className='w-10 h-10 rounded-md object-cover' />
                <span className='text-sm font-light text-gray-300'>photo_2024_2.png</span>
              </div>
              <span className='w-8 h-8 bg-[#1119284D] rounded-full flex items-center justify-center p-2 pointer-cursor'>
                <FileDownload/>
              </span>
            </div>
            <div className="photoItem px-3 flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img src="./self-sculpture.jpg" alt="media photo" className='w-10 h-10 rounded-md object-cover' />
                <span className='text-sm font-light text-gray-300'>photo_2024_2.png</span>
              </div>
              <span className='w-8 h-8 bg-[#1119284D] rounded-full flex items-center justify-center p-2 pointer-cursor'>
                <FileDownload/>
              </span>
            </div>
            <div className="photoItem px-3 flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img src="./self-sculpture.jpg" alt="media photo" className='w-10 h-10 rounded-md object-cover' />
                <span className='text-sm font-light text-gray-300'>photo_2024_2.png</span>
              </div>
              <span className='w-8 h-8 bg-[#1119284D] rounded-full flex items-center justify-center p-2 pointer-cursor'>
                <FileDownload/>
              </span>
            </div>
            <div className="photoItem px-3 flex items-center justify-between">
              <div className="photoDetail flex items-center gap-3">
                <img src="./self-sculpture.jpg" alt="media photo" className='w-10 h-10 rounded-md object-cover' />
                <span className='text-sm font-light text-gray-300'>photo_2024_2.png</span>
              </div>
              <span className='w-8 h-8 bg-[#1119284D] rounded-full flex items-center justify-center p-2 pointer-cursor'>
                <FileDownload/>
              </span>
            </div>
          </div>
        </div>
        <div className="option py-4">
          <div className="title flex items-center justify-between">
            <span>Shared Files</span>
            <span className='w-8 h-8 p-2 flex items-center justify-center rounded-full cursor-pointer bg-[#1119284D]'><KeyboardArrowUp/></span>
          </div>
        </div>
        <button onClick={handleBlock} className="bg-red-500 hover:bg-red-700 border-0 py-3 px-4 rounded-md shadow-lg">{isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "User blocked. Unblock" : "Block User"}</button>
        <button onClick={() => auth.signOut()} className="bg-[#8e44ad] border border-[#8e44ad] hover:bg-[#8d44adad] hover:border-[#8d44adad] py-3 px-4 rounded-md shadow-lg">Logout</button>
      </div>
    </div>
  )
}

export default Detail