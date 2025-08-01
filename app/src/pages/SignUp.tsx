import { useNavigate } from "react-router";
import { useState } from "react";
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import clsx from "clsx";

import { auth, db } from "../firebase";

import Button from "../components/Button";
import LoadingAnimation from "../components/LoadingAnimation";

import { centerContainerCSS, titleCSS } from "../styles";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      if (username.length > 12) {
        throw new Error("Username can at most be 12 characters long.");
      }

      const snapshot = await get(ref(db, `usernames/${username}`));
      if (snapshot.exists()) {
        alert("Username is already taken. Please try again.");
        setIsLoading(false);
        return;
      }

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCred.user.uid;
      await set(ref(db, `usernames/${username}`), userId);
      await set(ref(db, `users/${userId}`), {
        email: email,
        username: username,
        isOnline: true,
      });
      await updateProfile(userCred.user, { displayName: username });

      setIsLoading(false);
      navigate("/home");
    } catch (e: any) {
      if (e.code == AuthErrorCodes.INVALID_EMAIL) {
        alert("Invalid email format. Please try agian.");
      } else if (e.code == AuthErrorCodes.WEAK_PASSWORD) {
        alert("Password has to be at least 6 characters. Please try again.");
      } else {
        alert(`Error: ${e.message}`);
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  if (isLoading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  const inputCSS =
    "text-neutral w-[90%] mx-auto p-2 border border-gray-300 rounded-md\
     focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className={clsx(centerContainerCSS, "!gap-10")}>
      <h1 className={titleCSS}>Create Your Account</h1>
      <div className="flex flex-col gap-5 text-xl w-full">
        <input
          type="text"
          placeholder="Username"
          className={inputCSS}
          onChange={(text) => setUsername(text.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <input
          type="email"
          placeholder="Email"
          className={inputCSS}
          value={email}
          onChange={(text) => setEmail(text.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <input
          type="password"
          placeholder="Password"
          className={inputCSS}
          value={password}
          onChange={(text) => setPassword(text.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
      </div>
      <Button size="large" onClick={handleSignUp}>
        Sign Up
      </Button>
    </div>
  );
}

export default SignUp;
