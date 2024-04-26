import React, { useState } from 'react';
import {  NavLink, useLocation } from 'react-router-dom';
import './navbar.css';
// import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar = ({ userType }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const closeNotifications = () => {
        setShowNotifications(false);
    };

    return (
        <div>
            <div className="navitems">
                <nav>
                    <ul>
                        {userType === 'hr' && <li><NavLink exact to='/hrHome' activeClassName="active-page" className={location.pathname === '/hrHome' ? 'active-page' : ''}><i className="fa-solid fa-house"></i>Home</NavLink></li>}
                        {userType === 'candidate' && <li><NavLink exact to='/userHome' activeClassName="active-page" className={location.pathname === '/userHome' ? 'active-page' : ''}><i className="fa-solid fa-house"></i>Home</NavLink></li>}
                        
                        <li>
                            <div className="notifications-container">
                                <button onClick={toggleNotifications}>
                                    <i className="fa-solid fa-bell"></i>Notifications
                                </button>
                                {showNotifications && (
                                    <div className="notifications-popup" onClick={closeNotifications}>
                                        {/* Add your notification items here */}
                                    </div>
                                )}
                            </div>
                        </li>
                        {userType === 'candidate' &&(
                            <>
                             <li><NavLink to='/profileview' activeClassName="active-page" className={location.pathname === '/profileview' ? 'active-page' : ''}><i className="fa-regular fa-id-badge"></i>My Profile</NavLink></li>
                             <li><NavLink to="/dashboard" activeClassName="active-page" className={location.pathname === '/dashboard' ? 'active-page' : ''}><i className="fa-solid fa-bars"></i>Dashboard</NavLink></li>
                            
                             </>
                        )}
                        
                        {userType === 'hr' && (
                            <>
                            <li><NavLink to='/profileviewhr' activeClassName="active-page" className={location.pathname === '/profileviewhr' ? 'active-page' : ''}><i className="fa-regular fa-id-badge"></i>My Profile</NavLink></li>
                                <li><NavLink to="/hiringPlan" activeClassName="active-page" className={location.pathname === '/hiringPlan' ? 'active-page' : ''}><i className="fa-solid fa-briefcase"></i>Hiring Plan</NavLink></li>
                                <li><NavLink to="/recruitment" activeClassName="active-page" className={location.pathname === '/recruitment' ? 'active-page' : ''}><i className="fa-regular fa-folder-open"></i>Recruitment</NavLink></li>
                                
                            </>
                        )}
                    </ul>
                    <div className="site-title">
                        <h1>CareerFusion<i className="fa-solid fa-people-arrows" style={{ color: '#4655f7' }}></i></h1>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
