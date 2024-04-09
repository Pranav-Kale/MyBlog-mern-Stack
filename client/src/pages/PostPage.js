import { formatISO9075 } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const getData = async () => {
      await fetch(`http://localhost:4000/post/${id}`)
        .then((response) => response.json())
        .then((postInfo) => setPostInfo(postInfo));
    };
    getData();
  }, []);

  const { title, summary, content, cover, author, createdAt } = postInfo || {};

  if (!postInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-[10.5%] mb-5 flex flex-col gap-6 mt-8">
      <div className="overflow-hidden flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold leading-10 text-center pb-2 md:pb-4 w-[70%]">
          {title}
        </h2>
        <span className="text-gray-400 font-bold text-sm pb-1 md:pb-1">
          {formatISO9075(new Date(createdAt))}
        </span>
        <span className="font-bold text-sm pb-1 ">by @{author.username}</span>
        {userInfo?.id === postInfo?.author?._id && (
          <div className="flex gap-4 my-4">
            <button className="bg-gray-800 hover:bg-gray-600 duration-150 transition-all text-lg text-white px-4 w-24 py-1 rounded-md">
              Delete
            </button>
            <Link to={`/edit/${postInfo?._id}`}>
              <button className="bg-gray-800 hover:bg-gray-600 duration-150 transition-all text-lg text-white px-4 w-24 py-1 rounded-md">
                Edit
              </button>
            </Link>
          </div>
        )}
        <img
          className="max-h-[500px] "
          src={`http://localhost:4000/${cover}`}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="text-2xl leading-9 text-gray-800 ">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            summary
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
