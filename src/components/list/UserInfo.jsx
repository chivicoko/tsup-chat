import { EditNote, MoreHoriz, Videocam } from "@mui/icons-material";
import { useUserStore } from "../../lib/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className='userInfo flex items-center justify-between p-4'>
        <div className="user flex items-center gap-3">
            <img src={currentUser.avatar || "./avatar.png"} alt="user image" className="w-14 h-14 object-cover rounded-full" />
            <h2>{currentUser.username || "John Doe"}</h2>
        </div>
        <div className="icons flex items-center gap-3">
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><MoreHoriz/></span>
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><Videocam/></span>
          <span className="w-6 h-6 rounded-full hover:bg-[#11192880] flex items-center justify-center cursor-pointer p-4"><EditNote/></span>
        </div>
    </div>
  )
}

export default UserInfo