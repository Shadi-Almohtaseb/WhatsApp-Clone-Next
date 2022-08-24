import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { MenuAlt3Icon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getOtherEmail from "../../utils/getOtherEmail";

const Chat = () => {
  const [user] = useAuthState(auth);
  const [displaySideBar, setDisplaySideBar] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const BottomOfChat = useRef();

  /*to get the path of user so we can map over the messages */
  const q = query(
    collection(db, "Chats", id, "messages"),
    orderBy("timestamp")
  );
  const [messages] = useCollectionData(q);
  // console.log(messages);

  /*To Get the email of other person */
  const [person] = useDocumentData(doc(db, "Chats", id));

  /*To Send The messages */
  const [inputMessage, setInputMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage !== "") {
      await addDoc(collection(db, "Chats", id, "messages"), {
        text: inputMessage,
        timestamp: serverTimestamp(),
        sender: user.email,
      });
    }
    setInputMessage("");
  };

  /*To scroll to the bottom of chat */
  useEffect(() => {
    setTimeout(
      BottomOfChat.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
      100
    );
  }, [messages]);

  return (
    <div className="bg-gradient-to-r from-sky-200 to-green-400 h-screen w-full">
      <Head>
        <title>Chat App</title>
      </Head>
      <Sidebar
        displaySideBar={displaySideBar}
        setDisplaySideBar={setDisplaySideBar}
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full h-full grid place-items-center">
          <div className="w-[90%] h-[74vh] bg-white rounded-xl shadow-xl m-5">
            <div className="flex items-center justify-between mx-1 my-1 bg-slate-200 h-[2rem] py-10 rounded-lg ">
              <div className="flex justify-center items-center gap-3 pl-8">
                <Image
                  className="h-12 w-12 rounded-full"
                  src="https://media.istockphoto.com/vectors/user-icon-vector-male-person-symbol-profile-circle-avatar-sign-in-vector-id951316196?k=20&m=951316196&s=170667a&w=0&h=6P5l_JKPI8JL6DcEKhIoj0l7Tw37j7TnX1U5YEvW8As="
                  width={50}
                  height={50}
                />
                <h2 className="font-semibold break-all">
                  {getOtherEmail(person?.users, user)}
                </h2>
              </div>
              <div
                onClick={() => setDisplaySideBar(true)}
                className="bg-gradient-to-r from-sky-200 to-green-400 hover:from-sky-300 hover:to-green-500 rounded-full p-2 cursor-pointer m-9 h-12 w-18"
              >
                <MenuAlt3Icon className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6096d274ad3e07.png')] bg-no-repeat bg-cover h-full w-full  px-2 py-3 overflow-y-scroll scrollbar-hide">
              {messages?.map((message) => {
                const sender = message.sender === user.email;
                const time = new Date(
                  message.timestamp?.seconds * 1000
                ).toUTCString();
                console.log(time);
                if (sender) {
                  return (
                    <div key={Math.random()} className="flex justify-end">
                      <div className="relative bg-green-300 rounded-tr-[20px] rounded-l-[20px] px-3 py-2 mx-3 my-[4px] inline-block">
                        {message.text}
                        <p className="text-[10px] text-gray-900">{time}</p>
                        {/* {user.email && (
                          <div className="absolute top-0 right-0 bg-red-400 rounded-full text-white">
                            <TrashIcon width={17} hanging={17} />
                          </div>
                        )} */}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={Math.random()}>
                      <div className="relative bg-white rounded-tl-[20px] rounded-r-[20px] px-3 py-2 mx-3 my-[4px] inline-block">
                        {message.text}
                        <p className="text-[10px] text-gray-900">{time}</p>
                        {/* {user.email && (
                          <div className="absolute top-0 right-0 bg-red-400 rounded-full text-white">
                            <TrashIcon width={17} hanging={17} />
                          </div>
                        )} */}
                      </div>
                    </div>
                  );
                }
              })}
              <div ref={BottomOfChat}></div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6096d274ad3e07.png')] bg-no-repeat bg-cover p-2 rounded-b-lg"
            >
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="write a message..."
                className="w-full p-2 rounded-lg"
              ></input>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-700 to-blue-300 text-white rounded-full px-5"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
