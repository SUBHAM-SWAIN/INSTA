import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function CreatePost({ onClose }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleCropAndPreview = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedImage);
      setCroppedPreview({ file: croppedImage, url: previewUrl });
      setConfirming(true);
    } catch (err) {
      console.error("Image cropping failed", err);
    }
  };

  const handleConfirmPost = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", croppedPreview.file);
      formData.append("caption", caption);

      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      onClose();
    } catch (err) {
      toast.error("Post creation failed!");
      console.error("Post failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") onClose();
  };

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Create Post</h2>

        {!image ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              onClick={() => inputRef.current.click()}
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Choose Image
            </button>
          </div>
        ) : confirming && croppedPreview ? (
          <div className="space-y-4">
            <div className="w-full h-72 overflow-hidden rounded border border-gray-300 flex items-center justify-center bg-gray-100">
              <img
                src={croppedPreview.url}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>
            <p className="text-gray-700 break-words">{caption}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setConfirming(false)}
                className="w-1/2 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={handleConfirmPost}
                disabled={isLoading}
                className={`w-1/2 py-2 text-white font-semibold rounded transition ${
                  isLoading
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {isLoading ? "Posting..." : "Confirm Post"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full h-72 bg-gray-100 rounded overflow-hidden">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />

            <button
              onClick={handleCropAndPreview}
              className="w-full mt-4 py-2 bg-pink-500 text-white font-semibold rounded hover:bg-pink-600 transition"
            >
              Preview Post
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
