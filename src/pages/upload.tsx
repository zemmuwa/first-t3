import axios from "axios";
import React from "react";
import UiFileInputButton from "../components/UiFileInputButton";

function upload() {
  const onChange = async (formData) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };

    const response = await axios.post("/api/upload", formData, config);

    console.log("response", response.data);
  };

  return (
    <UiFileInputButton
      label="Upload Single File"
      uploadFileName="theFiles"
      onChange={onChange}
    />
  );
}

export default upload;
