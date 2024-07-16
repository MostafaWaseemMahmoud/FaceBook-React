import axios from "axios";
import { useEffect, useState } from "react";
import './friends.css'
import { useNavigate } from "react-router-dom";
function Friends() {
    const id = window.localStorage.getItem("id");
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get('http://localhost:5500/getuser/' + id);
                setUser(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("Error fetching user data", err);
            }
        };

        getUser();
    }, [id]);

    const handelCardClick = (e) => {
        const friend_id = e.target.parentElement.id;
        if (!friend_id) {
            friend_id = e.target.id;
        }
        navigate(`/profile/${friend_id}`)
    }

    return (
        <div className="friends">
            <div className="friendsCards">
                {user.friends && user.friends.length > 0 ? (
                    user.friends.map(friend => (
                        <div key={friend._id} onClick={handelCardClick} id={friend.id} className="friendCard">
                            <img src={friend.image} alt={friend.name} />
                            <h1>{friend.name}</h1>
                        </div>
                    ))
                ) : (
                    <p>No friends found.</p>
                )}
            </div>
        </div>
    );
}

export default Friends;
