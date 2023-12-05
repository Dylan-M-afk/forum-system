import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
const Replies = () => {
  const [replyList, setReplyList] = useState([]);
  const [reply, setReply] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchReplies = () => {
      setLoading(true); // Set loading to true before fetching replies
      fetch("http://localhost:4000/api/thread/replies", {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setReplyList(data.replies);
          setTitle(data.title);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false)); // Set loading to false after fetching replies
    };

    fetchReplies();
  }, [id]);

  const addReply = () => {
    fetch("http://localhost:4000/api/create/reply", {
      method: "POST",
      body: JSON.stringify({
        id,
        userId: localStorage.getItem("_id"),
        reply,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        navigate("/dashboard");
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    addReply();
    setReply("");
  };

  return (
    <main className='replies'>
      <h1 className='repliesTitle'>{title}</h1>

      {loading ? (
        <CircularProgress />
      ) : (
        <form className='modal__content' onSubmit={handleSubmitReply}>
          <label htmlFor='reply'>Reply to the thread</label>
          <textarea
            rows={5}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            type='text'
            name='reply'
            className='modalInput'
          />
          <button className='modalBtn'>SEND</button>
        </form>
      )}

      {!loading && (
        <div className='thread__container'>
          {replyList &&
            replyList.map((reply) => (
              <div className='thread__item' key={reply.id}>
                <p>{reply.text}</p>
                <div className='react__container'>
                  <p style={{ opacity: "0.5" }}>by {reply.name}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
};

export default Replies;
