import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../lib/upload";
import { MailOutline, Password, Person, Visibility, VisibilityOff } from "@mui/icons-material";


const Login = () => {
    const [avatar, setAvatar] = useState({file: null, url: ""});
    const [signUpLoading, setSignUpLoading] = useState(false);
    const [signInLoading, setSignInLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [registerVisibility, setRegisterVisibility] = useState(false);

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setSignUpLoading(true);

        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);
        // console.log(username);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = await upload(avatar.file);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success("Account created. You can now login");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setSignUpLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setSignInLoading(true);

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful!");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setSignInLoading(false);
        }
    };

  return (
    <div className='login flex justify-around w-full'>
        <div className="flex-1 flex flex-col justify-center items-center gap-6">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-3 w-72">                
                <div className="bg-[#11192899] mb-4 pl-3 flex items-center justify-center border rounded-lg border-[#8e44ad] focus-within:border-[#8e44ad] focus-within:ring-1 focus-within:ring-[#8e44ad] focus-within:shadow-[0_0_10px_0_rgba(142,68,173,0.5),0_0_20px_5px_rgba(142,68,173,0.05)]">
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0">
                        <MailOutline />
                    </span>
                    <input type="text" placeholder="Email..." name="email" className="bg-transparent p-3 ml-2 rounded-md shadow-lg w-full border-0 text-base text-white leading-tight focus:outline-0 focus:ring-0" />
                </div>
                <div className="bg-[#11192899] mb-4 px-3 flex items-center justify-center border rounded-lg border-[#8e44ad] focus-within:border-[#8e44ad] focus-within:ring-1 focus-within:ring-[#8e44ad] focus-within:shadow-[0_0_10px_0_rgba(142,68,173,0.5),0_0_20px_5px_rgba(142,68,173,0.05)]">
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0">
                        <Password />
                    </span>
                    <input type={visible ? "text" : "password"} placeholder="Password..." name="password" className="bg-transparent p-3 ml-2 rounded-md shadow-lg w-full border-0 text-base text-white leading-tight focus:outline-0 focus:ring-0" />
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0 cursor-pointer" onClick={() => setVisible((prev) => !prev)}>
                        {visible ? <VisibilityOff /> : <Visibility/>}
                    </span>
                </div>
                <button disabled={signInLoading} className="bg-[#8e44ad] hover:bg-[#8d44adad] p-3 rounded-md shadow-lg">{signInLoading ? "Loading...": "Sign In"}</button>
            </form>
        </div>

        <div className="separator self-center h-4/5 w-1 bg-gray-500"></div>

        <div className="flex-1 flex flex-col justify-center items-center gap-6">
            <h2 className="text-2xl font-bold">Create an Account</h2>
            <form onSubmit={handleRegister} className="flex flex-col gap-3 w-72">
                <label htmlFor="file" className="flex items-center gap-4 cursor-pointer">
                    <img src={ avatar.url || "./avatar.png" } alt="select avatar" className="w-24 h-24 object-cover rounded-lg" />
                    <span className="underline">Upload an image</span>
                </label>
                <input type="file" name="file" id="file" style={{display: 'none'}} onChange={handleAvatar} />
                <div className="bg-[#11192899] mb-4 pl-3 flex items-center justify-center border rounded-lg border-[#8e44ad] focus-within:border-[#8e44ad] focus-within:ring-1 focus-within:ring-[#8e44ad] focus-within:shadow-[0_0_10px_0_rgba(142,68,173,0.5),0_0_20px_5px_rgba(142,68,173,0.05)]">
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0">
                        <Person />
                    </span>
                    <input type="text" placeholder="Username..." name="username" className="bg-transparent p-3 ml-2 rounded-md shadow-lg w-full border-0 text-base text-white leading-tight focus:outline-0 focus:ring-0" />
                </div>
                <div className="bg-[#11192899] mb-4 pl-3 flex items-center justify-center border rounded-lg border-[#8e44ad] focus-within:border-[#8e44ad] focus-within:ring-1 focus-within:ring-[#8e44ad] focus-within:shadow-[0_0_10px_0_rgba(142,68,173,0.5),0_0_20px_5px_rgba(142,68,173,0.05)]">
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0">
                        <MailOutline />
                    </span>
                    <input type="text" placeholder="Email..." name="email" className="bg-transparent p-3 ml-2 rounded-md shadow-lg w-full border-0 text-base text-white leading-tight focus:outline-0 focus:ring-0" />
                </div>
                <div className="bg-[#11192899] mb-4 px-3 flex items-center justify-center border rounded-lg border-[#8e44ad] focus-within:border-[#8e44ad] focus-within:ring-1 focus-within:ring-[#8e44ad] focus-within:shadow-[0_0_10px_0_rgba(142,68,173,0.5),0_0_20px_5px_rgba(142,68,173,0.05)]">
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0">
                        <Password />
                    </span>
                    <input type={registerVisibility ? "text" : "password"} placeholder="Password..." name="password" className="bg-transparent p-3 ml-2 rounded-md shadow-lg w-full border-0 text-base text-white leading-tight focus:outline-0 focus:ring-0" />
                    <span className="relative flex items-center w-4 h-5 text-[#8e44ad] flex-shrink-0 cursor-pointer" onClick={() => setRegisterVisibility((prev) => !prev)}>
                        {registerVisibility ? <VisibilityOff /> : <Visibility/>}
                    </span>
                </div>
                <button disabled={signUpLoading} className="bg-[#8e44ad] hover:bg-[#8d44adad] p-3 rounded-md shadow-lg">{signUpLoading ? "Loading...": "Sign Up"}</button>
            </form>
        </div>
    </div>
  )
}

export default Login;