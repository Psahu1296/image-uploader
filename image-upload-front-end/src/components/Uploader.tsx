import React from "react";
import { motion } from "framer-motion";
import "../app/page.scss";
import "./component.scss";

const loaderVariants = {
  animationOne: {
    x: [-100, 340],
    transition: {
      duration: 1.75,
      repeat: Infinity,
      ease: "linear"
    },
  },
};

const Uploader = () => {
  return (
    <div className="content_container upload-js">
      <p className="titleupload_title">Uploading...</p>
      <div className="loader">
        <motion.div
          className="bar"
          variants={loaderVariants}
          animate="animationOne"
        />
      </div>
    </div>
  );
};

export default Uploader;
