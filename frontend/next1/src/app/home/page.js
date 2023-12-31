"use client";

import "../../styles/Home.css"
import axios from "../api/axios";
import { useState, useEffect } from "react";
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import Header from "@/components/Header";
import PostCard from "@/components/PostCard";

import 'bootstrap/dist/css/bootstrap.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Home() {
    const user = useAppSelector((state) => state.userReducer.value);
    const [posts, setPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [contentPost, setContentPost] = useState("");
    const [friends, setFriends] = useState([]);
    const emojis = ["😊", "😂", "😍", "👍", "❤️"];
    const [showEmojis, setShowEmojis] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        getAllPost();
    }, [currentPage]);

    const getAllPost = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const response = await axios.get(`/getAllPost?page=${currentPage}`, config);
            setPosts(response.data.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getFriendList();
    }, []);


    const getFriendList = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const response = await axios.get('/getFriendList', config);
            setFriends(response.data.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    const handSubmitPost = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        // formData.append("images", selectedImage);
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("media[]", selectedFiles[i]);
        }
        formData.append("content", contentPost)

        try {
            await axios.post("/createPost", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setContentPost("");
            setSelectedFiles([]);
            getAllPost();

        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles(prevSelectedFiles => {
            const updatedFiles = prevSelectedFiles.filter((file, index) => index !== indexToRemove);
            return updatedFiles;
        });
    };

    return (
        <>
            <Header />
            <div className="container gedf-wrapper">
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <Link href={"profile/" + user.id}>
                                <div className="card-body">
                                    <img
                                        alt="image"
                                        src={"http://localhost:8000/" + user.img}
                                    />
                                    <div className="h5">{user.name}</div>
                                    <div className="h7 text-muted">Email : {user.email}</div>
                                    <div className="h7">
                                        {user.profile}
                                    </div>
                                </div>
                            </Link>

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="h6 text-muted">Followers</div>
                                    <div className="h5">4</div>
                                </li>
                                <li className="list-group-item">
                                    <div className="h6 text-muted">Following</div>
                                    <div className="h5">3</div>
                                </li>
                                <li className="list-group-item">Vestibulum at eros</li>
                            </ul>
                        </div>
                        <div className="list-group list-group-light ">
                            <Link
                                href="/friends"
                                className="list-group-home list-group-item list-group-item-action px-3 border-0  ripple "
                            >
                                Friends
                            </Link>
                            <a
                                href="#"
                                className=" list-group-home list-group-item list-group-item-action px-3 border-0 ripple "
                            >
                                Video
                            </a>
                            <a
                                href="#"
                                className="list-group-home list-group-item list-group-item-action px-3 border-0 ripple"
                            >
                                Feeds
                            </a>
                            <a
                                href="#"
                                className="list-group-home list-group-item list-group-item-action px-3 border-0 ripple"
                            >
                                Groups
                            </a>
                            <Link
                                href="/dating"
                                className="list-group-home list-group-item list-group-item-action px-3 border-0  ripple "
                            >
                                Dating
                            </Link>
                        </div>

                    </div>
                    <div className="col-md-6 gedf-main " >
                        <form onSubmit={handSubmitPost}>
                            <div className="card gedf-card">
                                <div className="card-header">
                                    <ul className="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a
                                                className="nav-link active"
                                                id="posts-tab"
                                                data-toggle="tab"
                                                href="#posts"
                                                role="tab"
                                                aria-controls="posts"
                                                aria-selected="true"
                                            >
                                                Make a publication
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className="nav-link"
                                                id="images-tab"
                                                data-toggle="tab"
                                                role="tab"
                                                aria-controls="images"
                                                aria-selected="false"
                                                href="#images"
                                            >
                                                Images
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content" id="myTabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="posts"
                                            role="tabpanel"
                                            aria-labelledby="posts-tab"
                                        >
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="message">
                                                    post
                                                </label>
                                                <textarea
                                                    onChange={e => setContentPost(e.target.value)}
                                                    className="form-control"
                                                    id="message"
                                                    rows={3}
                                                    placeholder="What are you thinking?"
                                                    value={contentPost}
                                                />
                                                <div className="emoji-icon" onClick={() => setShowEmojis(!showEmojis)}>
                                                    😊
                                                </div>
                                                {showEmojis && (
                                                    <div className="emoji-list">
                                                        {emojis.map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                type="button"
                                                                onClick={() => setContentPost(prevContentPost => prevContentPost + emoji)}
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="images"
                                            role="tabpanel"
                                            aria-labelledby="images-tab"
                                        >
                                            <div className="form-group">
                                                <div className="custom-file">
                                                    <input type="file" className="custom-file-input" id="customFile" />
                                                    <label className="custom-file-label" htmlFor="customFile">
                                                        Upload image
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="py-4" />
                                        </div>
                                    </div>
                                    {/* {selectedImage &&
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={URL.createObjectURL(selectedImage)}
                                                alt="avatar"
                                                className="img-fluid m-3"
                                                style={{ width: 150 }}
                                            />
                                            <button onClick={() => setSelectedImage()}>X</button>
                                        </div>
                                    }
                                    <input
                                        class="form-control" type="file" id="formFile" multiple
                                        onChange={(event) => {
                                            console.log(event.target.files);
                                            setSelectedImage(event.target.files[0]);
                                        }}
                                    ></input> */}

                                    {
                                        Array.isArray(selectedFiles) && selectedFiles.length > 0 ? (
                                            selectedFiles.map((file, index) => (
                                                <div key={index} className="d-flex align-items-center">
                                                    {file.type.startsWith("image/") ? (
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`image-${index}`}
                                                            className="img-fluid m-3"
                                                            style={{ width: 150 }}
                                                        />
                                                    ) : (
                                                        <video
                                                            controls
                                                            className="video-responsive"
                                                            style={{ width: 150 }}
                                                        >
                                                            <source src={URL.createObjectURL(file)} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                    <button onClick={() => handleRemoveFile(index)}>X</button>
                                                </div>
                                            ))
                                        ) : null
                                    }

                                    <input
                                        class="form-control" type="file" id="formFile" multiple
                                        onChange={(event) => setSelectedFiles(Array.from(event.target.files))}
                                    ></input>
                                    <div className="btn-toolbar justify-content-between">
                                        <div className="btn-group">
                                            <button type="submit" className="btn btn-primary">
                                                share
                                            </button>
                                        </div>
                                        <div className="btn-group">
                                            <button
                                                id="btnGroupDrop1"
                                                type="submit"
                                                className="btn btn-link dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="fa fa-globe" />
                                            </button>
                                            <div
                                                className="dropdown-menu dropdown-menu-right"
                                                aria-labelledby="btnGroupDrop1"
                                            >
                                                <a className="dropdown-item" href="#">
                                                    <i className="fa fa-globe" /> Public
                                                </a>
                                                <a className="dropdown-item" href="#">
                                                    <i className="fa fa-users" /> Friends
                                                </a>
                                                <a className="dropdown-item" href="#">
                                                    <i className="fa fa-user" /> Just me
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {posts.map((post, index) => {
                            let show = false;
                            return (
                                <PostCard post={post} />
                            )
                        })}
                    </div>
                    <div className="col-md-3">
                        <div className="push-down" />
                        <div className="card card-transparent">
                            <h5 className="card-heading">Contacts</h5>
                            <div className="mda-list">
                                {friends.map((friend, index) => {
                                    return (
                                        <div className="mda-list-item">
                                            <img
                                                src={"http://localhost:8000/" + friend.img}
                                                alt="List user"
                                                className="mda-list-item-img thumb48"
                                            />
                                            <div className="mda-list-item-text mda-2-line">
                                                <h3>
                                                    <a href="#">{friend.name}</a>
                                                </h3>
                                                <div className="text-muted text-ellipsis">Ut ac nisi id mauris</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}