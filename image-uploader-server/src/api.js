const multer = require("multer");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotnet = require("dotenv");
const Aws = require("@aws-sdk/client-s3");  
const SignedUrl = require("@aws-sdk/s3-request-presigner");


dotnet.config();
const { S3Client, PutObjectCommand, GetObjectCommand } = Aws;
const { getSignedUrl } = SignedUrl;

const BucketName = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

// import Multer from "multer";
const upload = multer({
  //   storage: multerS3({
  //     s3,
  //     acl: "public-read",
  //     bucket: process.env.AWS_S3_BUCKET_NAME,
  //     contentType: multerS3.AUTO_CONTENT_TYPE,
  //     key: (req, file, cb) => {
  //         cb(null, file.originalname)
  //     }
  //   }), // change this into memoryStorage from diskStorage
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const app = express();
const PORT = 5000;

const myFileUploader = async (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', '*');
    const params = {
      Bucket: BucketName,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimeType,
    };
    const command = new PutObjectCommand(params);

    await s3.send(command);

    const getObjectCommand = new GetObjectCommand(params);
    const imageUrl = await getSignedUrl(s3, getObjectCommand, {
      expires: 3600,
    });
    res.status(200).send(imageUrl);
    res.end();
  } catch (err) {
    res
      .status(err.status || 500)
      .send(err.message || { message: "failed to upload" });
    console.error("err==========>", err.message);
  }
};

app.post("/image", upload.single("file"), myFileUploader);


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

app.use(bodyParser.json()); // handle json data
app.use(bodyParser.urlencoded({ extended: true })); // handle URL-encoded data

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

