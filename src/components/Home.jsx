import axios from "axios";
import { useParams } from "react-router-dom";
import './profile.css';
import { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
    const { id } = useParams(); // Get the user ID from the URL
    const [user, setUser] = useState(null); // State to store user data
    const [friendsLength, setFriendsLength] = useState(0); // State to store friends count
    const [friends, setFriends] = useState([]);
    const [posts, setposts] = useState([]);
    const add_friend_btn = createRef() // State to store friends list
    const navigate = useNavigate()
    useEffect(() => {
        // Function to fetch the user data
        const fetchUserData = () => {
            if (id) {
                axios.get(`http://localhost:5500/getuser/${id}`)
                    .then((res) => {
                        setUser(res.data);
                        setFriendsLength(res.data.friends.length); // Set friends count
                        setFriends(res.data.friends);
                        setposts(res.data.posts);
                    })
                    .catch((error) => {
                        console.error("There was an error fetching the user data!", error);
                    });


            }
        };

        // Fetch user data initially
        fetchUserData();

        // Set up an interval to fetch user data every 5 seconds
        const intervalId = setInterval(fetchUserData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [id]); // Dependency array includes id so the effect runs when id changes

    // Display message if user data is not loaded yet
    if (!user) {
        return <div>No User Found</div>;
    }

    const handelFrindClick = (e) => {
        const FRIEND_ID = e.target.parentElement.classList[0];
        navigate(`/profile/${FRIEND_ID}`)
    }

    const postData = {
        userId: window.localStorage.getItem("id"),
        friendId: id,
    }
    const HandeladdFriend = () => {

        for (let i = 0; i < user.friends.length; i++) {
            console.log(user.friends[i])
            if (user.friends[i].id == window.localStorage.getItem("id")) {
                add_friend_btn.current.textContent = "This Account Already In Your Frinds"
                add_friend_btn.current.classList.add("errorBtn");
                setTimeout(() => {
                    add_friend_btn.current.textContent = "Add Friend"
                    add_friend_btn.current.classList.remove("errorBtn");
                }, 2000);
                return;
            }
        }

        if (!window.localStorage.getItem("id")) {
            navigate("/register");
            return;
        }


        if (id == window.localStorage.getItem("id")) {
            add_friend_btn.current.textContent = "This is Your Account"
            add_friend_btn.current.classList.add("errorBtn");
            setTimeout(() => {
                add_friend_btn.current.textContent = "Add Friend"
                add_friend_btn.current.classList.remove("errorBtn");
            }, 2000);
        } else {
            axios.post("http://localhost:5500/addfriend", postData).then((res) => {
                add_friend_btn.current.textContent = res.data.message;
                add_friend_btn.current.classList.add("SuccBtn");
                setTimeout(() => {
                    add_friend_btn.current.textContent = "Add Friend"
                    add_friend_btn.current.classList.remove("errorBtn");
                }, 2000);
            })
        }

    }

    return (
        <div className="container">
            <div className="userInfo">
                <div className="cover">
                    <img
                        src="https://scontent.fcai20-3.fna.fbcdn.net/v/t39.30808-6/445374257_1024165809233086_7869567480910336161_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=1nqBSZkXv2oQ7kNvgHfr6oB&_nc_ht=scontent.fcai20-3.fna&oh=00_AYC8Yft6KfbsW1PSjxyXHB4s4SGoE8RF1tBwGB_PYb5Wow&oe=669338E8"
                        alt="Cover"
                    />
                </div>
                <div className="profileinfo">
                    <div className="userData">
                        <div className="profileImg">
                            <img src={user.image} className="profile-img" alt="Profile" />
                        </div>
                        <div className="profileName">
                            <h1 className="profile-name">{user.name}</h1>
                            <span className="friends-length">{friendsLength} Friends</span>
                            <div className="friends">
                                {friends.length === 0 ? (
                                    <p></p>
                                ) : (
                                    friends.map(friend => (
                                        <div className={friend.id} onClick={handelFrindClick} id="userFriends" key={friend._id}>
                                            <img src={friend.image} className="friend-image" alt={friend.name} />
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>

                        <div onClick={HandeladdFriend} className="add-friend">
                            <button className="Btn" ref={add_friend_btn} >Add Friend</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="posts">
                {!posts ? (
                    <p></p>
                ) : (

                    posts.map(post => (
                        <div className="post">
                            <div className="post-title">
                                <img src={user.image} />
                                <h1>{user.name}</h1>
                            </div>
                            <p>{post.post}</p>
                            <img src={post.imageUrl} alt={post.imageUrl} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
