import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header/Header";
import UserList from "./components/UserList.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/userlist" element={<UserList />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;
