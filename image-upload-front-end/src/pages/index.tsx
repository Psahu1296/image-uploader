"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import "../app/page.scss";
import defaultImage from "../../image.svg";
import Uploader from "@/components/Uploader";
import Router from "next/router";

export default function Home() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [isValidFile, setIsValidFile] = useState<boolean>(true);
  const [uploadFile, setUploadFile] = useState<any>();

  const fileRef = useRef<HTMLDivElement>(null);
//   const Router = useRouter();
  useEffect(() => {
    fileRef.current?.addEventListener("dragover", dragOverHandler);
    fileRef.current?.addEventListener("drop", dropHandler);

    return () => {
      fileRef.current?.removeEventListener("dragover", dragOverHandler);
      fileRef.current?.removeEventListener("drop", dropHandler);
    };
  }, []);

  const dragOverHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dropHandler = async (e: any) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setFailed(false);
      const { files } = e.dataTransfer;

      if (files && files.length) {
        const filetype = files[0].type.split("/")[1];
        if (filetype === "png" || filetype === "jpeg" || filetype === "jpg") {
          let formData = new FormData();
          setUploadFile(files[0]);
          setIsValidFile(true);
          formData.append("file", files[0]);
          setUploading(true);
          await axios
            .post("https://image-uploader-server-c33i.onrender.com/image", formData).then((response) => Router.push({pathname: "/finalPage", query: {Link: `${response.data}`}}))
            .finally(() => setUploading(false));
            setUploaded(true);
          return;
        }
        setIsValidFile(false);
      }
    } catch (error) {
      console.error("error creating ===========>", error);
      setUploading(false);
      setFailed(true);
    }
  };

  return (
    <main className="container">
      {failed ||
        (!uploading && !uploaded && (
          <div className="content_container">
            <p className="title">Upload your image</p>
            <p
              className={`${
                isValidFile ? "subTitle" : "subTitle invalid_file"
              }`}
            >
              File should be Jpeg, Png,...
            </p>
            <div className="image" id="file_drop_area" ref={fileRef}>
              <Image width={114} height={88} src={defaultImage} alt="" />
              <p className="info">Drag & Drop your image here</p>
            </div>
            <p className="info" style={{ marginTop: "0px" }}>
              Or
            </p>
            <button className="upload">Choose a file</button>
          </div>
        ))}
      {uploading && <Uploader />}
    </main>
  );
}
