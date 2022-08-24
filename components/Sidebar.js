import React from "react";
import Image from "next/image";
import { LogoutIcon, XIcon } from "@heroicons/react/outline";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection } from "firebase/firestore";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";

const Sidebar = ({ displaySideBar, setDisplaySideBar }) => {
  const [snapshot, loading, error] = useCollection(collection(db, "Chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const [user] = useAuthState(auth);
  const router = useRouter();

  /*To jump into chat page */
  const redirect = (id) => {
    router.push(`/chat/${id}`);
    setDisplaySideBar(false);
  };

  /*To make a new Chat */

  const chatExists = (email) =>
    chats?.find(
      (chat) => chat.users.includes(user.email) && chat.users.includes(email)
    );

  const newChat = async () => {
    const input = prompt("Enter email of chat recipient");

    if (
      !chatExists(input) &&
      input !== "" &&
      input !== user.email &&
      input !== null
    ) {
      await addDoc(collection(db, "Chats"), {
        users: [user.email, input],
      });
    } else {
      alert("The email is already exists or it's invalid email");
    }
  };

  const OtherPeople = () => {
    return chats
      ?.filter((chat) => chat.users.includes(user.email))
      .map((chat) => (
        <div
          onClick={() => redirect(chat.id)}
          key={Math.random()}
          className="mt-1 pl-4 py-[0.38rem] bg-slate-100 hover:bg-slate-200 rounded-lg mx-2 cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <Image
              src="https://media.istockphoto.com/vectors/user-icon-vector-male-person-symbol-profile-circle-avatar-sign-in-vector-id951316196?k=20&m=951316196&s=170667a&w=0&h=6P5l_JKPI8JL6DcEKhIoj0l7Tw37j7TnX1U5YEvW8As="
              alt="my photo"
              width="50"
              height="50"
              className="cursor-pointer rounded-full"
            />
            <h2 className="text-lg">{getOtherEmail(chat.users, user)}</h2>
          </div>
        </div>
      ));
  };

  return (
    <div
      className={
        displaySideBar
          ? "fixed left-0 top-0 w-full h-full bg-black/50 z-10"
          : ""
      }
    >
      <div
        className={
          displaySideBar
            ? "fixed left-0 top-0 w-[80%] sm:w-[60%] md:w-[45%] lg:w-[35%] h-full bg-gradient-to-r from-sky-200 to-green-400 p-2 ease-in duration-500 overflow-y-auto scrollbar-hide"
            : "fixed left-[-170%] top-0 ease-in duration-500 bg-gradient-to-r from-sky-300 to-green-500 h-full"
        }
      >
        <div className="flex items-center justify-between gap-8 p-4 border-b-2">
          <div className="flex justify-between gap-9">
            <div className="flex items-center gap-2 flex-col">
              <Image
                className="h-12 w-12 rounded-full hover:animate-spin"
                src={user.photoURL}
                width={50}
                height={50}
              />
              <h2>{user.displayName}</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div
                onClick={() => signOut(auth)}
                className="bg-slate-100 rounded-full p-2 cursor-pointer hover:bg-slate-200"
              >
                <LogoutIcon className="w-8 h-8" />
              </div>
              <p>LogOut</p>
            </div>
          </div>
          <div
            onClick={() => setDisplaySideBar(false)}
            className="-ml-[11px] bg-slate-100 rounded-full p-2 cursor-pointer hover:bg-slate-200"
          >
            <XIcon className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div>
          <div className="mt-5">
            <div
              onClick={() => newChat()}
              className="w-[80%] mb-8 ml-8 bg-slate-100 rounded-xl flex items-center justify-center p-2 cursor-pointer hover:bg-slate-200"
            >
              <button className="text-center">New Chat</button>
            </div>
            <div className="">{OtherPeople()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
