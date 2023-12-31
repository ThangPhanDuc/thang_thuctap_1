"use client";

import axios from "../../api/axios";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pusher from "pusher-js";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function Chat({ params }) {
    const { id } = params;
    const user = useAppSelector((state) => state.userReducer.value);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([{}]);
    const [users, setUsers] = useState([]);
    const [recipient, setRecipient] = useState({})

    useEffect(() => {
        Pusher.logToConsole = true;

        var pusher = new Pusher('0699e48d294babf98468', {
            cluster: 'ap1'
        });

        var channel = pusher.subscribe('chat.' + user.id);

        channel.bind('message', function (data) {

            //xu ly thoi gian nhan tin nhan
            var currentDate = new Date();

            var day = String(currentDate.getDate()).padStart(2, '0');
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var year = String(currentDate.getFullYear());

            var hours = String(currentDate.getHours()).padStart(2, '0');
            var minutes = String(currentDate.getMinutes()).padStart(2, '0');
            var seconds = String(currentDate.getSeconds()).padStart(2, '0');

            var formattedDate = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;

            data.created_at = formattedDate;
            //
            setMessages(prevMessages => [...prevMessages, data]);
        });

    }, [user.id]);




    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        try {
            await axios.post("/sentMessage", {
                "recipient_id": recipient.id,
                "content": message
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllUser();
        // setRecipient(user[0]);
    }, []);

    const getAllUser = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const response = await axios.get(`/getAllUser`, config);
            setUsers(response.data);


        } catch (error) {
            console.error(error);
        }

    };

    const getMessagesRecipient = async (recipient) => {

        setRecipient(recipient);

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const response = await axios.get('/getMessage', {
                params: {
                    recipient_id: recipient.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const addEmoji = emoji => {
        setMessage(prevMessage => prevMessage + emoji);
    };
    return (
        <>
            <Header />
            <section style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                            <h5 className="font-weight-bold mb-3 text-center text-lg-start">
                                Member
                            </h5>
                            <div className="card">
                                <div className="card-body">
                                    <ul className="list-unstyled mb-0">
                                        {users.filter((user1) => user1.id !== user.id).map((user, index) => {
                                            return (
                                                <li onClick={() => getMessagesRecipient(user)}
                                                    //  className="p-2 border-bottom "
                                                    className={`p-2 border-bottom ${recipient.id == user.id ? 'bg-success text-dark bg-opacity-10' : ''}`}
                                                >
                                                    <a href="#!" className="d-flex justify-content-between">
                                                        <div className="d-flex flex-row">
                                                            <img
                                                                src={"http://localhost:8000/" + user.img}
                                                                alt="avatar"
                                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                                width={60}
                                                            />
                                                            <div className="pt-1">
                                                                <p className="fw-bold mb-0">{user.name}</p>
                                                                <p className="small text-muted">Lorem ipsum dolor sit.</p>
                                                            </div>
                                                        </div>
                                                        <div className="pt-1">
                                                            <p className="small text-muted mb-1">5 mins ago</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            );
                                        })}

                                        {/* <li
                                        className="p-2 border-bottom"
                                        style={{ backgroundColor: "#eee" }}
                                    >
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                <img
                                                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                                                    alt="avatar"
                                                    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                    width={60}
                                                />
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li> */}


                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-7 col-xl-8">


                            <div className="d-flex align-items-center mb-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={"http://localhost:8000/" + recipient.img}
                                        alt=""
                                        className="img-fluid rounded-circle border border-dark border-3"
                                        style={{ width: 70 }}
                                    />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="d-flex flex-row align-items-center mb-2">
                                        <h4 className="mb-0 me-2">{recipient.name}</h4>
                                        {/* <ul
                                        className="mb-0 list-unstyled d-flex flex-row"
                                        style={{ color: "#1B7B2C" }}
                                    >
                                        <li>
                                            <i className="fas fa-star fa-xs" />
                                        </li>
                                        <li>
                                            <i className="fas fa-star fa-xs" />
                                        </li>
                                        <li>
                                            <i className="fas fa-star fa-xs" />
                                        </li>
                                        <li>
                                            <i className="fas fa-star fa-xs" />
                                        </li>
                                        <li>
                                            <i className="fas fa-star fa-xs" />
                                        </li>
                                    </ul> */}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark btn-rounded btn-sm"
                                            data-mdb-ripple-color="dark"
                                        >
                                            + Follow
                                        </button>
                                        <Link
                                            href={"/listUser/informationOfOtherUsers/" + recipient.id}
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-outline-dark btn-rounded btn-sm"
                                                data-mdb-ripple-color="dark"
                                            >

                                                See profile
                                            </button>
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-outline-dark btn-floating btn-sm"
                                            data-mdb-ripple-color="dark"
                                        >
                                            <i className="fas fa-comment" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ul className="list-unstyled">
                                {
                                    messages.map((message, index) => {
                                        if (message.sender_id == user.id && message.recipient_id == recipient.id) {
                                            return (
                                                <li key={index} className="d-flex justify-content-between mb-4">
                                                    <div className="card w-100">
                                                        <div className="card-header d-flex justify-content-between p-3">
                                                            <p className="fw-bold mb-0">{user.name}</p>
                                                            <p className="text-muted small mb-0">
                                                                <i className="far fa-clock" />
                                                                {/* {message.created_at} */}
                                                                2 mins ago
                                                            </p>
                                                        </div>
                                                        <div className="card-body">
                                                            <p className="mb-0">
                                                                {message.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <img
                                                        src={"http://localhost:8000/" + user.img}
                                                        alt="avatar"
                                                        className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                                                        width={60}
                                                    />
                                                </li>
                                            )
                                        } else if (message.sender_id == recipient.id) {
                                            return (
                                                <li className="d-flex justify-content-between mb-4">
                                                    <img
                                                        src={"http://localhost:8000/" + recipient.img}
                                                        alt="avatar"
                                                        className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                                                        width={60}
                                                    />
                                                    <div className="card w-100">
                                                        <div className="card-header d-flex justify-content-between p-3">
                                                            <p className="fw-bold mb-0">{recipient.name}</p>
                                                            <p className="text-muted small mb-0">
                                                                <i className="far fa-clock" />
                                                                {/* {message.created_at} */}
                                                                1 mins ago
                                                            </p>
                                                        </div>
                                                        <div className="card-body">
                                                            <p className="mb-0">
                                                                {message.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    })
                                }
                                <form onSubmit={handleSubmit}>
                                    <li className="bg-white mb-3">
                                        <div className="form-outline">
                                            <textarea
                                                onChange={e => setMessage(e.target.value)}
                                                className="form-control"
                                                id="textAreaExample2"
                                                rows={4}
                                                value={message}
                                            />
                                            <label className="form-label" htmlFor="textAreaExample2">
                                                Message
                                            </label>
                                            <div>
                                                <button type="button" onClick={() => addEmoji("😊")}>
                                                    😊
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <button type="submit" className="btn btn-info btn-rounded float-end">
                                        Send
                                    </button>
                                </form>

                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}