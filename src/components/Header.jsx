import React, { useEffect, useRef, useState } from 'react';
import './haeder.css'; // Ensure this file is correctly named and styled
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';

function Header() {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState({
        name: undefined,
        image: undefined,
        email: undefined,
        posts: undefined,
        friends: undefined,
    });
    const searchIconRef = useRef();
    const inputFieldRef = useRef();
    const searchValueRef = useRef();
    const searchedUserRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const USER_ID = window.localStorage.getItem("id");
        if (!USER_ID) {
            navigate("/register");
        } else {
            axios.get(`http://localhost:5500/getuser/${USER_ID}`).then((res) => {
                setData(res.data);
            }).catch((error) => {
                console.error("There was an error fetching the user!", error);
            });
        }
    }, [navigate]);

    const handleInputFocus = () => {
        console.log("Input is clicked");
        searchIconRef.current.classList.add("display-none");
        inputFieldRef.current.classList.add("all-radius");
        handleSearch();
    };

    const handleHeaderClick = () => {
        searchIconRef.current.classList.remove("display-none");
        inputFieldRef.current.classList.remove("all-radius");
    };

    const handleSearch = () => {
        searchValueRef.current.classList.add("block");
        if (inputFieldRef.current && inputFieldRef.current.value) {
            axios.get("http://localhost:5500/allusers")
                .then((res) => {
                    const foundUsers = res.data.filter(user => user.name.toUpperCase() === inputFieldRef.current.value.toUpperCase());
                    if (foundUsers.length > 0) {
                        setUsers(foundUsers);
                        searchValueRef.current.classList.remove("notFoundUser");
                        searchValueRef.current.classList.add("searched-user");
                    } else {
                        setUsers([]);
                        searchValueRef.current.classList.add("notFoundUser");
                        searchValueRef.current.classList.remove("searched-user");
                    }
                })
                .catch((error) => {
                    console.error("There was an error fetching the users!", error);
                });
        } else {
            setUsers([]);
        }
    };

    const navigateProfile = () => {
        navigate("profile/" + window.localStorage.getItem("id"));
    };

    const handleBlur = () => {
        handleHeaderClick();
        if (inputFieldRef.current.value.length === 0) {
            searchValueRef.current.classList.remove("block");
        }
    };

    const handleUserClick = (e) => {
        const USER_ID = e.currentTarget.classList[0];
        navigate(`/profile/${USER_ID}`);
        searchValueRef.current.classList.remove("block");
    };

    const toHome = () => {
        navigate("/posts");
    };

    const navigateFriends = () => {
        navigate("/friends");
    };

    return (
        <header>
            <div className="searched-user" ref={searchValueRef}>
                {users.length === 0 ? (
                    <span className='not-found'>No User Found With This Name</span>
                ) : (
                    users.map(user => (
                        <div ref={searchedUserRef} onClick={handleUserClick} className={user._id} id="userSearched" key={user._id}>
                            <img className='succ' src={user.image} alt={user.name} />
                            <span className='succ'>{user.name}</span>
                        </div>
                    ))
                )}
            </div>
            <div className="search">
                <div className="logo" onClick={toHome}></div>
                <i className="fas fa-search" ref={searchIconRef}></i>
                <input ref={inputFieldRef} onFocus={handleInputFocus} onChange={handleSearch} type="text" onBlur={handleBlur} placeholder='Search Facebook' />
            </div>
            <div className="navigation" onClick={handleHeaderClick}>
                <i className="fa-solid fa-house" onClick={toHome}></i>
                <i className="fa-solid fa-user-group" onClick={navigateFriends}></i>
            </div>
            <div className="profile" onClick={navigateProfile}>
                <img className="profileImage" src={data.image} alt={data.name} />
                <h1>{data.name}</h1>
            </div>
        </header>
    );
}

export default Header;
