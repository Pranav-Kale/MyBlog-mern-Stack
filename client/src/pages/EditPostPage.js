import React, { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Editor from "../components/Editor";

function EditPostPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const textareaRefTitle = useRef(null);
  const textareaRefSummary = useRef(null);
  const [filePath, setFilePath] = useState("");

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

  useEffect(() => {
    const getData = async () => {
      await fetch(`http://localhost:4000/post/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setTitle(data.title);
          setSummary(data.summary);
          setContent(data.content);
          setFilePath(data.cover);
        });
    };
    getData();
  },[id]);

  const editPost = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("id", id);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (file?.[0]) {
      data.set("file", file?.[0]);
    }
    const response = await fetch("http://localhost:4000/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={editPost} className="w-full flex flex-col gap-5 px-[10.5%]">
      <p className="text-3xl font-semibold text-center">Edit Post</p>
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
      <div className="flex flex-col gap-3 text_input p-2">
        <div className="flex gap-3">
          <label className="font-medium">Upload Image :</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className=""
          />
        </div>
        <div className="flex">
          <img
            className="max-h-64 w-auto"
            src={`http://localhost:4000/${filePath}`}
            alt="post"
          />
        </div>
      </div>

      <Editor value={content} onChange={setContent} />

      <button className="btn mb-5">Save Post</button>
    </form>
  );
}

export default EditPostPage;
