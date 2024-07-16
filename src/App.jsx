// src/App.js
import React from 'react';
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/posts';
import Friends from './components/friends';

function App() {
  return (
    <div className="contaiener">
      <Router>
        <Header />  {/* Place the Header component here so it's always visible */}
        <Routes>
          <Route path="/profile/:id" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/friends" element={<Friends />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
