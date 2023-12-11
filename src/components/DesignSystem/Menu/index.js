import React, {Fragment, Suspense, useState, useEffect, useContext} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Menu = () => {
  return (
    <>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/admin'>Admin</Link></li>
      </ul>
    </>
  );
}

export default Menu;
