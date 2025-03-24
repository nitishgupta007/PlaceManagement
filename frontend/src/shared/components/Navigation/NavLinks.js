import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return <ul className="nav-links">
    <li>
      <NavLink to="/" >ALL USERS</NavLink>
    </li>
    {auth.isLoggedIn && (
      <>
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      </>
    )}
    {!auth.isLoggedIn && <li>
      <NavLink to="/auth">Login</NavLink>
    </li>}
    {auth.isLoggedIn && <li>
      <NavLink onClick={auth.logout}>Logout</NavLink>
    </li>}
  </ul>
};

export default NavLinks;