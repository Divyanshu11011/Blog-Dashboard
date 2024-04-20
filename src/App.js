import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css'; // Make sure your CSS file is correctly linked
import PostsPage from './components/PostsPage/PostsPage';
import UsersPage from './components/UsersPage/UsersPage';

function App() {
  // Function to determine the class based on the link's active state
  const getActiveLinkClass = isActive => isActive ? "option selected" : "option";

  return (
    <Router>
      <div className="app-container">
        <div className="background-ellipses">
          <div className="ellipse-1618"></div>
          <div className="ellipse-1619-container">
            <div className="ellipse-1619"></div>
          </div>
        </div>
        <div className="nav-links">
          <div className="options-container">
            <NavLink to="/posts" className={({ isActive }) => getActiveLinkClass(isActive)}>
              POSTS
            </NavLink>
            <div className="separator">|</div>
            <NavLink to="/users" className={({ isActive }) => getActiveLinkClass(isActive)}>
              USERS
            </NavLink>
          </div>
        </div>
        <Routes>
          {/* Redirect from "/" to "/posts" */}
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
