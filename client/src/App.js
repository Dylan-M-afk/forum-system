import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Register from "./components/Register";

import Login from "./components/Login";

import Home from "./components/Home";

import Replies from "./components/Replies";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



const App = () => {

    return (

        <div>

            <BrowserRouter>

                <Routes>

                    <Route path='/' element={<Login />} />

                    <Route path='/register' element={<Register />} />

                    <Route path='/dashboard' element={<Home />} />

                    <Route path='/:id/replies' element={<Replies />} />

                </Routes>

            </BrowserRouter>

        </div>

    );

};


export default App;