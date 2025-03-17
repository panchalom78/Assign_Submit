import React from "react";
import Routers from "./routes/Routes.jsx";
import "./App.css";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <main className="h-screen w-full">
            <Toaster position="bottom-right" />
            <Routers />
        </main>
    );
};

export default App;
