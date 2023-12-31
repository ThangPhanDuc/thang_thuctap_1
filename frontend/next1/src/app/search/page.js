"use client";


import axios from "../api/axios";
import { useState, useEffect } from "react";
import "../../styles/Search.css"
import 'bootstrap/dist/css/bootstrap.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { useAppSelector } from "@/redux/hooks";

export default function Search() {
    const [posts,setPosts] = useState([]);
    const searchKeyword = useAppSelector((state) => state.searchReducer.value);

    useEffect(() => {
        getPostByKeyword();
    }, [searchKeyword]);

    const getPostByKeyword = async () => {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            keyword: searchKeyword, 
            page: 1 
          }
        };
      
        try {
          const response = await axios.get('/getPostByKeyword', config);
          setPosts(response.data.data);
          console.log("post:" + posts);
        } catch (error) {
          console.error(error);
        }
      };
      
    

    return (
        <>
            <Header />
            <div className="container bootstrap snippets bootdeys bootdey">
                <div className="row decor-default">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                        <div className="contacts-labels">
                            <div className="list">
                                <div className="head">Search results</div>
                                <h2 className="mb-3">Filters</h2> 
                                <div className="unit">
                                    <div className="lab lab-success">Post</div>
                                    <span>1</span>
                                </div>
                                <div className="unit">
                                    <div className="lab lab-primary">People</div>
                                    <span>0</span>
                                </div>
                                <div className="unit">
                                    <div className="lab lab-danger">Photos</div>
                                    <span>0</span>
                                </div>
                                <div className="unit">
                                    <div className="lab lab-warning">Videos</div>
                                    <span>0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12">
                        <div className="contacts-list">
                            {posts.map((post,index)=>{
                                return(
                                    <PostCard post={post} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}