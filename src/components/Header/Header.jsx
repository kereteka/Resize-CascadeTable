import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="h-24 w-[100%] bg-slate-500">
      <ul>
        <li>
          <Link to="/userlist">UserList</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
