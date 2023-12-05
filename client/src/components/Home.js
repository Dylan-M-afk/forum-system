import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import CircularProgress from '@mui/material/CircularProgress';
import Likes from "../utils/Likes";
import Comments from "../utils/Comments";
import MiniDrawer from "./MiniDrawer";



const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [thread, setThread] = useState("");
    const [threadList, setThreadList] = useState([]);

    const createThread = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/create/thread", {
                method: "POST",
                body: JSON.stringify({
                    thread,
                    userId: localStorage.getItem("_id"),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error creating thread: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Server Response:", data); // Log the response for inspection
    
            alert(data.message);
    
            if (data.thread) {
                setThreadList((prevThreads) => [...prevThreads, data.thread]);
            }
        } catch (error) {
            console.error(error);
            // Handle error, you might want to show an error message to the user
        }
    };
    
    
    
    
    //👇🏻 Triggered when the form is submitted
    
    const handleSubmit = (e) => {
    
        e.preventDefault();
    
        //👇🏻 Calls the function
    
        createThread();
    
        setThread("");
    
    };
    //👇🏻 The useEffect Hook
    const navigate = useNavigate();
    const fetchThreads = () => {
        setIsLoading(true);
        fetch("http://localhost:4000/api/all/threads")
            .then((res) => res.json())
            .then((data) => {
                setThreadList(data.threads);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const checkUser = () => {
            if (!localStorage.getItem("_id")) {
                navigate("/");
            } else {
                fetchThreads();
            }
        };

        checkUser();
    }, [navigate]);

    return (
        <MiniDrawer>
            <main className='home'>
                <h2 className='homeTitle'>Create a Thread</h2>
                <form className='homeForm' onSubmit={handleSubmit}>
                    <div className='home__container'>
                        <label htmlFor='thread'>Title / Description</label>
                        <input
                            type='text'
                            name='thread'
                            required
                            value={thread}
                            onChange={(e) => setThread(e.target.value)}
                        />
                    </div>
                    <button className='homeBtn'>CREATE THREAD</button>
                </form>
                <div className='thread__container'>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        threadList.map((thread) => (
                            <div className='thread__item' key={thread.id}>
                                <p>{thread.title}</p>
                                <div className='react__container'>
                                    <Likes numberOfLikes={thread.likes.length} threadId={thread.id} />
                                    <Comments
                                        numberOfComments={thread.replies && thread.replies.length}
                                        threadId={thread.id}
                                        title={thread.title}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </MiniDrawer>
    );
};
export default Home;