const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
// create express app
const app = express();

// upload file path
// imageUr, cloudinary, localy,...etc
//upload images on multible providers
// 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${path.join(__dirname, "uploads")}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".")[1];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
  fileFilter: (req, file, cb) => {
    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   return cb(null, false);
    // } else {
    //   cb(null, true);
    // }

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    else cb("Error: Images Only!");
  },
});
var upload = multer({ storage: storage });

// enable CORS
app.use(cors());

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// upload single file
app.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const avatar = await req.file;
    // make sure file is available
    if (!avatar) {
      res.status(400).send({
        status: false,
        data: "No file is selected.",
      });
    } else {
      //send response
      res.send({
        status: true,
        message: "File is uploaded.",
        data: {
          name: avatar.originalname,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// start the app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
