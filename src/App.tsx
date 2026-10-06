// import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Outlet } from "react-router";

export const App = () => (
  <div className="app">
    <Header />
    <main className="app__main">
      <Outlet/>
    </main>
  </div>
);
