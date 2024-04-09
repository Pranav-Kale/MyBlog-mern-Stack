import React from 'react';
import ReactQuill from 'react-quill';

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

function Editor({value,onChange}) {
  return (
    <ReactQuill
        theme="snow"
        className=" border-2 border-gray-600 placeholder-gray-800 rounded-md overflow-hidden "
        value={value}
        onChange={onChange}
        placeholder="Write something awesome..."
        modules={modules}
      />
  )
}

export default Editor