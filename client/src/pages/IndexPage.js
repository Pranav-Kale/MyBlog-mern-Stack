import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { UserContext } from "../UserContext";

function IndexPage() {

  const {user} =- useContext(UserContext);
  console.log("User : ", user);


  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      const getData = async () => {
        // await fetch("http://localhost:4000/post",{credentials: "include"})
        await fetch("http://localhost:4000/post")
          .then((response) => response.json())
          .then((data) => setPosts(data));
      };
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="grid gap-5 px-[5%] sm:px-[6.5%] lg:px-[10.5%] w-full border-gray-600">
      {posts?.length > 0 && posts?.map((post) => <Post {...post} />)}
    </div>
  );
}

export default IndexPage;
