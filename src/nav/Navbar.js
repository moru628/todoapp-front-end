import React, { useState } from 'react';
import { Link, useLocation} from 'react-router-dom';
import './navbar.css'

const Navbar = () => {
  const location = useLocation(); 
  const [activeIcon, setActiveIcon] = useState(location.pathname)
  const handleLinkClick = (path) => {
    setActiveIcon(path);
  };
  const getTextColorClass = (path) => {
    return activeIcon === path || (path === "/event" && activeIcon.startsWith("/event")) ? 'active-text' : '';
  };
  return (
    <nav className="navbar-bottom">
      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/"  onClick={() => handleLinkClick("/")}>
            <img src={activeIcon === "/" ? '/assets/home2.png' : '/assets/home.png'} alt='' className='logo'/>
            <span className={getTextColorClass("/")}>HOME</span>
          </Link>
        </li>
        <li className={location.pathname === "/list" ? "active" : ""}>
          <Link to="/list"  onClick={() => handleLinkClick("/list")}>
            <img src={activeIcon === "/list" ? '/assets/list2.png' : '/assets/list.png'} alt='' className='logo'/>
            <span className={getTextColorClass("/list")}>LIST</span>
          </Link>
        </li>
        <li className={location.pathname.startsWith("/event") || location.pathname.startsWith("/booking") ? "active" : ""}>
          <Link to="/event" onClick={() => handleLinkClick("/event")}>
            <img  src={activeIcon.startsWith("/event") || activeIcon.startsWith("/booking") ? '/assets/event2.png' : '/assets/event.png'} alt='' className='logo'/>
            <span className={getTextColorClass("/event")}>EVENT</span>
          </Link>
        </li>
        <li className={location.pathname === "/moment" ? "active" : ""}>
          <Link to="/moment" onClick={() => handleLinkClick("/moment")}>
            <img src={activeIcon === "/moment" ? '/assets/moment2.png' : '/assets/moment.png'} alt='' className='logo'/>
            <span className={getTextColorClass("/moment")}>MOMENT</span>
          </Link>
        </li>
        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile" onClick={() => handleLinkClick("/profile")}>
            <img src={activeIcon === "/profile" ? '/assets/profile2.png' : '/assets/profile.png'} alt='' className='logo'/>
            <span className={getTextColorClass("/profile")}>PROFILE</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
