const express = require("express");
const bodyParser = require("body-parser");
// create express app
const app = express();

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getRandomSeconds = () => {
  return Math.floor(Math.random() * 1000);
};

const imgurPromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: "1232",
        image_link: "ww.ww.vom",
        name: "imgur",
      });
    }, getRandomSeconds());
  });
};

const cloudinaryPromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: "12",
        url: "ww.ww.vom",
        name: "cloudinary",
      });
    }, getRandomSeconds());
  });
};

const localStoragePromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: "122",
        img_url: "ww.ww.vom",
        name: "localstorage",
      });
    }, getRandomSeconds());
  });
};
//all , random , one of the
// upload single file
// Addituoinal 
const providers = {
  ALL: [imgurPromise, cloudinaryPromise, localStoragePromise],
  LOCAL: [localStoragePromise],
  IMGUR: [imgurPromise],
  CLOUDINARY: [cloudinaryPromise],
  DEFAULT: [imgurPromise],
};
const providerSelection = (strategy) => {
  if (strategy === "RANDOM") {
    let providerIndex = Math.floor(Math.random() * providers.ALL.length - 1);
    return [providers.ALL[providerIndex]];
  }
  return providers[strategy] || providers.DEFAULT;
};
app.post("/upload", (req, res) => {
  Promise.race(
    providerSelection('ALL').map((provierFn) => {
      return provierFn();
    })
  )
    .then((data) => {
      switch (data.name) {
        case "imgur":
          res.send({
            ...data,
            url: data.image_link,
          });
          break;
        case "localstorage":
          res.send({
            ...data,
            url: data.img_url,
          });
          break;

        default:
          res.send(data);
          break;
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

// start the app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
