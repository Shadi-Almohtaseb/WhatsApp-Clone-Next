import React from "react";
import WhatsAppImg from "../public/assets/WhatsApp.svg.webp";
import Loading from "../components/Loading";
import Head from "next/head";
import Image from "next/image";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const LogIn = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className="bg-gradient-to-r from-green-500 to-purple-700">
        <Head>
          <title>LogIn</title>
        </Head>
        <div className="grid place-items-center h-screen">
          <div className="flex items-center justify-center flex-col bg-white shadow-xl rounded-xl p-9">
            <div className="text-3xl mb-5 font-bold">LogIn</div>
            <Image
              src={WhatsAppImg}
              alt="whatsAppImage"
              width={250}
              height={250}
            />
            <button
              onClick={() => signInWithGoogle("", { prompt: "select_account" })}
              className="px-6 py-2 text-white bg-green-400 hover:bg-green-500 ease-in duration-200 shadow-xl rounded-xl mt-5"
            >
              Sign In With Google
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default LogIn;
