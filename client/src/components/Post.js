import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Post({ _id, title, summary, content, cover, createdAt, author }) {
  return (
    <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center border-b-2 border-gray-500 pb-8">
      <div className="overflow-hidden flex items-center ">
        <Link to={`/post/${_id}`}>
          <img
            className="h-fit"
            src={"http://localhost:4000/" + cover}
            alt=""
          />
        </Link>
      </div>
      <div className="">
        <Link to={`/post/${_id}`}>
          <h2 className="text-2xl lg:text-4xl font-bold leading-7 xl:leading-10 line-clamp-2 sm:py-2 md:py-1">
            {title}
          </h2>
        </Link>
        <p className="flex gap-4 my-1 lg:my-2 font-bold text-gray-500 ">
          <span className="text-black line-clamp-1">{author.username}</span>
          <span className="line-clamp-1">
            {formatISO9075(new Date(createdAt))}
          </span>
        </p>
        <p className="text-xl lg:text-2xl xl:leading-9 text-gray-800 line-clamp-3 md:line-clamp-2 lg:line-clamp-3 2xl:line-clamp-5">
          {summary ? summary : content}
        </p>
      </div>
    </div>
  );
}

export default Post;
