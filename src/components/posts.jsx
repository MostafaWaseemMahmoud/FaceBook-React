import axios from "axios";
import "./posts.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Posts() {
    const [allUsers, setAllUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState({ loading: true, error: null });
    const sharePostBtn = useRef();
    const postPostValue = useRef();
    const postImageInput = useRef();
    const navigate = useNavigate();

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5500/allusers');
            setAllUsers(res.data);
        } catch (err) {
            setStatus({ loading: false, error: err });
        }
    };

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:5500/getuser/${window.localStorage.getItem("id")}`);
            setUser(res.data);
        } catch (err) {
            setStatus({ loading: false, error: err });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllUsers();
            await fetchUser();
            setStatus({ loading: false, error: null });
        };
        fetchData();
    }, []);

    const reloadGet = () => {
        setTimeout(() => {
            fetchAllUsers();
            fetchUser();
        }, 2000);
    };

    const addPostChanges = (e) => {
        if (e.target.value.length === 0) {
            sharePostBtn.current.classList.remove("flex");
            return;
        }
        sharePostBtn.current.classList.add("flex");
    };

    const handelCardClick = (e) => {
        let idoffriend = e.target.closest('.post-title').id;
        navigate(`/profile/${idoffriend}`);
    };

    const activePostMethod = () => {
        let file = postImageInput.current.files[0];
        let formData = new FormData();
        formData.append("image", file);
        formData.append("post", postPostValue.current.value);
        formData.append("title", "...");

        axios
            .post(`http://localhost:5500/addpost/${window.localStorage.getItem("id")}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Image uploaded successfully:", response.data);
                window.alert("Post Sent Successfully");
                reloadGet();
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
            });
    };

    if (status.loading) return <p>Loading...</p>;
    if (status.error) return <p>Error: {status.error.message}</p>;

    return (
        <>
            <div className="addpost">
                <div className="addpostForm">
                    <div className="forms">
                        <div className="postLayOut">
                            <div className="pagecenter">
                                <img className="profileImage" src={user?.image} alt="Profile" />
                                <input
                                    type="text"
                                    ref={postPostValue}
                                    onChange={addPostChanges}
                                    placeholder={`What's on your mind, ${user?.name}?`}
                                />
                            </div>
                            <button className="postBtn" ref={sharePostBtn} onClick={activePostMethod}>Share Post</button>
                            <hr />
                            <input type="file" id="add-photo-icon" ref={postImageInput} />
                            <label htmlFor="add-photo-icon"><i className="fa-solid fa-camera"></i></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="posts">
                <div className="posts-pos">

                    {allUsers.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        allUsers.map(user => (
                            user.posts?.length > 0 ? (
                                user.posts.map(post => (
                                    <div className="post" key={post.id}>
                                        <div className="post-title" id={user.id} onClick={handelCardClick}>
                                            <img src={user.image} alt={user.name} />
                                            <h1>{user.name}</h1>
                                        </div>
                                        <p>{post.post}</p>
                                        {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
                                    </div>
                                ))
                            ) : (
                                <p key={user.id}>No posts found for {user.name}.</p>
                            )
                        ))
                    )}
                </div>
            </div>

        </>
    );
}

export default Posts;
