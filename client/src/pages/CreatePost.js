import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const textareaRefTitle = useRef(null);
  const textareaRefSummary = useRef(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (textareaRefTitle.current) {
      textareaRefTitle.current.style.height = "auto";
      textareaRefTitle.current.style.height = `${textareaRefTitle.current.scrollHeight}px`;
    }
    if (textareaRefSummary.current) {
      textareaRefSummary.current.style.height = "auto";
      textareaRefSummary.current.style.height = `${textareaRefSummary.current.scrollHeight}px`;
    }
  }, [title, summary]);

  const createNewPost = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", file);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if(response.ok){
      setRedirect(true);
    }
  };

  if(redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form
      onSubmit={createNewPost}
      className="w-full flex flex-col gap-5 px-[10.5%]"
    >
      <p className="text-3xl font-semibold text-center">Create Post</p>
      <textarea
        ref={textareaRefTitle}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text_input hideScrollbar"
        rows={1}
      />
      <textarea
        value={summary}
        ref={textareaRefSummary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Summary"
        className="text_input hideScrollbar "
      />
      <div className="flex gap-3 text_input p-2">
        <label className="font-medium">Upload Image :</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className=""
        />
      </div>

      <ReactQuill
        theme="snow"
        className=" border-2 border-gray-600 placeholder-gray-800 rounded-md overflow-hidden "
        value={content}
        onChange={(newValue) => setContent(newValue)}
        placeholder="Write something awesome..."
        modules={modules}
      />

      <button className="btn mb-5">Create Post</button>
    </form>
  );
}

export default CreatePost;
