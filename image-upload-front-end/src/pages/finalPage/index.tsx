"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import tickImage from "../../../check.png";
import { useRouter } from "next/router";
import "../../app/page.scss"
import "../../components/component.scss"
interface IFinalPage {
  ImageUrl?: string;
}
const FinalPage = ({ ImageUrl }: IFinalPage) => {
  const urlRef = useRef<HTMLParagraphElement>(null);
  const Router = useRouter();
  const [Url, setUrl] = useState<string>('')


  const copyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (urlRef && urlRef.current && urlRef.current.textContent) {
      navigator.clipboard.writeText(urlRef.current.textContent)
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { Link } = Router.query
    if (Link ) {
      setUrl(Link as string);
    }
  }, [Router.query]);
  console.log("Image copied", ImageUrl);
  return (
    <div className="container">
    <div className="content_container">
      <Image
        height={35}
        width={35}
        src={tickImage}
        alt="tick"
        style={{ marginBottom: "10px" }}
      />
      <p className="title">Uploaded Successfully!</p>
      <div className="image image_fit">
        <Image width={338} height={219} src={Url} alt="uploaded-image" />
      </div>
      <div className="link_wrapper">
        <p ref={urlRef} className="link">
          {Url}
        </p>
        <button className="link_copy" onClick={copyHandler}>
          Copy Link
        </button>
      </div>
    </div>
    </div>
  );
};

export default FinalPage;
