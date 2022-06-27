import React from "react";
import { Link } from "react-router-dom";

export const Profile = () => (
  <>
    Profile
    <Link to={"/"}>Home</Link>
    <Link to={"/login"}>Login</Link>
    <Link to={"/signup"}>Sign Up</Link>
    <Link to={"/profile"}>Profile</Link>
  </>
);
