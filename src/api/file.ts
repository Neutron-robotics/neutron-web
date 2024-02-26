import api from "./api";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const response = await api.post("file/upload", formData, config);
  if (response.status !== 200) throw new Error("Fail to upload image");
  return response.data.url;
};

export { uploadFile };
