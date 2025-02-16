// Main.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'

function Main() {
    return (
        <div>
            <p>main</p>
            <Outlet/>
        </div>
    );
}

export default Main;