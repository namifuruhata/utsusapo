import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Chat from "./chat";
import UserSearch from "./usersearch";
import Tell from "./tell";

function App() {
  
  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/usersearch" element={<UserSearch />} />
                <Route path="/tell" element={<Tell />} />
        {/* 他のルートもここに追加 */}
      </Routes>
    </Router>
    
  );


  
}

export default App;
