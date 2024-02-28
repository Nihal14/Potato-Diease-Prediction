import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ImageUpload.css"; // Import a CSS file for styling

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log(process.env.REACT_APP_API_URL);
      try {
        const res = await axios.post("http://localhost:8000/predict", formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    setIsLoading(true);
    sendFile();
  }, [preview]);

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length === 1) {
      const droppedFile = event.dataTransfer.files[0];
      setSelectedFile(droppedFile);
      setImage(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onSelectFile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(event.target.files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <div>
      <header style={{ marginTop: "0px", textAlign: "center" }}>
      <h1 style={{ textAlign: "center", marginTop: "5px" }}>
        Potato Disease Prediction
      </h1>
      </header>
      {/* Header */}
      

      {/* Main Content */}
      <div
        className="main-container"
        style={{ marginTop: "60px" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="image-container">
          {!image && (
            <>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={onSelectFile}
              />
              <label htmlFor="file">
                Drag and drop an image of a potato plant leaf to process
              </label>
            </>
          )}
          {(image || (preview && data)) && (
            <div className="card">
              {preview && <img src={preview} alt="Potato plant leaf" />}
              {data && (
                <div className="data-container">
                  <p>Label: {data.class}</p>
                  <p>Confidence: {confidence}%</p>
                </div>
              )}
            </div>
          )}
          {isLoading && <p>Processing...</p>}
        </div>
        {data && <button onClick={clearData}>Clear</button>}
      </div>

      {/* Footer */}
      <footer style={{ marginTop: "20px", textAlign: "center" }}>
      <p>Nihal Athri , Jibin TV</p>
      {/* <p><a href="https://github.com/Nihal14">GitHub</a></p> */}
      </footer>
    </div>
  );
};

export default ImageUpload;
