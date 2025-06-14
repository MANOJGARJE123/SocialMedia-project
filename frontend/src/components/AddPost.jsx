import React, { useState } from "react";

const AddPost = ({ type = "post" }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFilePrev(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("type", type);

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Uploaded:", data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center justify-between mb-4"
        >
          {/* Caption */}
          <input
            type="text"
            placeholder="Enter Caption"
            className="w-full border px-3 py-2 rounded text-sm"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Styled file upload */}
          <label className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md text-sm">
            Choose {type === "post" ? "Image" : "Reel"}
            <input
              type="file"
              accept={type === "post" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              required
              className="hidden"
            />
          </label>

          {/* Preview */}
          {filePrev && (
            type === "post" ? (
              <img
                src={filePrev}
                alt="preview"
                className="w-40 h-40 object-cover rounded"
              />
            ) : (
              <video
                src={filePrev}
                controls
                className="w-full max-h-[400px] rounded"
              />
            )
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            + Add {type === "post" ? "Post" : "Reel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
