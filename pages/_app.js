import "../styles/globals.css";
import LogIn from "../components/LogIn";
import Loading from "../components/Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <LogIn />;
  } else {
    return <Component {...pageProps} user={user} />;
  }
}

export default MyApp;
