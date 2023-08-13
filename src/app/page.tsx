"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import styles from "./page.module.css"

interface UserData {
  avatar_url: string;
  name?: string;
  html_url: string;
  bio?: string

}
 interface ErrorResponse {
  error: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserData | ErrorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchUser = async () => {
    setError(null);
    setUserData(null);
    setIsLoading(true);

    if (username) {
      try {
        const data: UserData | ErrorResponse = await fetchUserData(username);
        if ("error" in data) {
          setError(data.error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        setError("An error occurred");
      }
    }

    setIsLoading(false);
  };

  const fetchUserData = async (
    username: string
  ): Promise<UserData | ErrorResponse> => {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.status === 404) {
      return { error: 'User not found' };
    }
    return response.json();
  };

console.log(userData, "user")

  return (
    <div className={styles.container}>
      <h1>GitHub User Search</h1>
      <div className={styles.wrapper}>
      <Input
        id="outlined-basic"
        type="text"
        placeholder="Enter a GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button size="large" variant="outlined" onClick={searchUser}>
        Search
      </Button>
      </div>
      

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {userData && !("error" in userData) ? (
      <div className={styles.userInfo}>
        <img src={userData.avatar_url} alt="Profile Picture" width="100" />
        <p>Name: {userData.name || username}</p>
        {userData.bio && <p>Bio: {userData.bio}</p>}
        <p>
          Profile:{" "}
          <a
            href={userData.html_url}
            target="_blank"       
          >
            {userData.html_url}
          </a>
        </p>
      </div>
    ) : (
      <p>{userData?.error}</p>
    )}
    </div>
  );
}
