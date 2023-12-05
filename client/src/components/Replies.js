import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import MiniDrawer from "./MiniDrawer";

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

      // Check if replies exist in localStorage for the current page
      const storedReplies = localStorage.getItem(`replies_${id}`);
      if (storedReplies) {
        setReplyList(JSON.parse(storedReplies));
        setLoading(false);
      } else {
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
            // Save replies to localStorage for the current page
            localStorage.setItem(`replies_${id}`, JSON.stringify(data.replies));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false)); // Set loading to false after fetching replies
      }
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
    <MiniDrawer>
      <main className="replies">
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#f50057",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
        <h1 className="repliesTitle">{title}</h1>

        {loading ? (
          <CircularProgress />
        ) : (
          <form className="modal__content" onSubmit={handleSubmitReply}>
            <label htmlFor="reply">Reply to the thread</label>
            <textarea
              rows={5}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              type="text"
              name="reply"
              className="modalInput"
            />
            <button className="modalBtn">SEND</button>
          </form>
        )}

        {!loading && (
          <div className="thread__container">
            {replyList &&
              replyList.map((reply) => (
                <div className="thread__item" key={reply.id}>
                  <p>{reply.text}</p>
                  <div className="react__container">
                    <p style={{ opacity: "0.5" }}>by {reply.name}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </MiniDrawer>
  );
};

export default Replies;
