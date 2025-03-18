import { useState, useRef } from "react";
import EXIF from "exif-js";

export default function FileUpload({ onFileSelect }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null); // Ref for the file input

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image")) {
      EXIF.getData(selectedFile, function () {
        const orientation = EXIF.getTag(this, "Orientation");
        const img = new Image();
        img.src = URL.createObjectURL(selectedFile);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions based on orientation
          if (orientation === 6 || orientation === 8) {
            canvas.width = img.height;
            canvas.height = img.width;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          // Transform context based on orientation
          switch (orientation) {
            case 2:
              ctx.transform(-1, 0, 0, 1, img.width, 0);
              break;
            case 3:
              ctx.transform(-1, 0, 0, -1, img.width, img.height);
              break;
            case 4:
              ctx.transform(1, 0, 0, -1, 0, img.height);
              break;
            case 5:
              ctx.transform(0, 1, 1, 0, 0, 0);
              break;
            case 6:
              ctx.transform(0, 1, -1, 0, img.height, 0);
              break;
            case 7:
              ctx.transform(0, -1, -1, 0, img.height, img.width);
              break;
            case 8:
              ctx.transform(0, -1, 1, 0, 0, img.width);
              break;
            default:
              ctx.transform(1, 0, 0, 1, 0, 0);
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const correctedFile = new File([blob], selectedFile.name, {
              type: selectedFile.type,
            });
            setFile(correctedFile);
            setPreviewUrl(URL.createObjectURL(correctedFile));
            onFileSelect(correctedFile); // Call the callback function with the selected file
          }, selectedFile.type);
        };
      });
    } else {
      setError("Please select an image file.");
      setFile(null);
      setPreviewUrl("");
      onFileSelect(null); // Call the callback function with null to clear the file
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
    onFileSelect(null); // Call the callback function with null to clear the file
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    console.log("File:", file);
    // Handle file upload logic here
  };

  return (
    <div className="sm:max-w-lg w-full p-1 rounded-xl z-10">
      <div className="text-center">
        <h2 className="mt-5 text-3xl font-bold text-gray-900">File Upload!</h2>
        <p className="mt-2 text-sm text-gray-400">Upload your image files here.</p>
      </div>
      <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 space-y-2">
          <label className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
              <div className="h-full w-full text-center flex flex-col items-center justify-center">
                {file ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className=" h-56 w-60 object-cover mt-2 rounded p-2"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={handleRemoveFile}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-1 opacity-0 hover:opacity-100 transition-opacity">
                      {file.name}
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      className="h-36 object-center"
                      src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                      alt="upload icon"
                    />
                    <p className="pointer-none text-gray-500">
                      <span className="text-sm">Drag and drop</span> image files here or
                      <label
                        htmlFor="file-upload"
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {" "}
                        select a file
                      </label>
                    </p>
                  </>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef} // Attach the ref to the file input
              />
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-sm text-gray-300">
          <span>File type: images (jpg, png, etc.)</span>
        </p>
        {/* <div>
          <button
            type="submit"
            className="w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
          >
            Upload
          </button>
        </div> */}
      </form>
    </div>
  );
}