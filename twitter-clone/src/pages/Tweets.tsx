import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import styles from "./Tweets.module.css";
import { getUserFromLocalStorage } from "../utils/getUserFromLocalStorage";
import NavBar from "../components/NavBar";

interface Tweet {
  id: string;
  author_id: string;
  text: string;
}

const Tweets = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState("");
  const [error, setError] = useState("");

  const fetchTweets = async () => {
    try {
      const response = await fetch("http://localhost:3001/tweets");
      if (!response.ok) throw new Error("Failed to fetch tweets");
      const data = await response.json();
      setTweets(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load tweets. Please try again later.");
    }
  };

  const postTweet = async () => {
    if (newTweet.trim().length < 1 || newTweet.trim().length > 140) {
      setError("Tweet must be between 1 and 140 characters.");
      return;
    }

    const user = getUserFromLocalStorage();

    if (!user.id) {
      setError("You must be logged in to post a tweet.");
      return;
    }

    const newTweetObj = {
      id: String(Date.now()),
      author_id: user.id,
      text: newTweet.trim(),
    };

    try {
      const response = await fetch("http://localhost:3001/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTweetObj),
      });

      if (!response.ok) throw new Error("Failed to post tweet");

      setNewTweet("");
      setError("");
      fetchTweets();
    } catch (err) {
      console.error(err);
      setError("Unable to post tweet. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Tweets</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <textarea
            className={styles.tweetInput}
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's happening?"
            rows={4}
          />
          <button className={styles.tweetButton} onClick={postTweet}>
            Tweet
          </button>
        </div>
        <ul className={styles.tweetsList}>
          {tweets.map((tweet) => (
            <li key={tweet.id} className={styles.tweetItem}>
              <span className={styles.tweetAuthor}>{tweet.author_id}:</span>
              <span
                className={styles.tweetText}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(tweet.text),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Tweets;
