import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
const handleUpload = (e) => {
  e.preventDefault();
  const formdata = new FormData();
  formdata.append("file", file);

  axios.post(`${window.location.origin}/upload`, formdata)
    .then(() => {
      return axios.get(`${window.location.origin}/getImage`);
    })
    .then((response) => {
      setImages(response.data.map((item) => item.image));
    })
    .catch((error) => {
      console.log(error);
    });
};

  useEffect(() => {
    axios
      .get(`${window.location.origin}/getImage`)
      .then((res) => setImages(res.data.map((item) => item.image)))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="bg-gray-200">
      <div className="flex justify-center py-2">
      <form  onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          className="bg-red-500 text-white rounded-lg px-2 py-1"
          type="submit"
        >
          Upload
        </button>
        <br />
      </form>
      </div>
      
      <div className="w-full flex flex-wrap">
        {images &&
          images.length > 0 &&
          images.map((image, index) => (
            <img
              className="w-48 h-48 m-2 p-1"
              key={index}
              src={`${window.location.origin}/Images/`+image}
              alt={`image_${index}`}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
