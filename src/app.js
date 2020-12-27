// load express
const express = require("express");
const app = express();

console.log("*******************************************************");
// load notes js
const notes = require("./notes");

//all notes
let allNotes = [];

// load hbs
const hbs = require("hbs");

// load path module
const path = require("path");

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

// set hbs
app.set("view engine", "hbs");

// set views path
const viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

// partials path
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "Home",
    createdBy: "Gopinath",
    allNotes: notes.loadNotes(),
  });
  console.log(allNotes);
});

// app.get("json", (req, res) => {
//   allNotes = notes.loadNotes();
//   console.log(JSON.stringify(allNotes));
//   console.log(allNotes);
//   return res.send(JSON.stringify(allNotes));
// });

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    createdBy: "Gopinath",
  });
});

app.get("/addnote", (req, res) => {
  if (!req.query.title) {
    return res.send({
      error: "please provide note title",
    });
  }
  if (!req.query.body) {
    return res.send({
      error: "please provide body",
    });
  } else {
    notes.addNote(req.query.title, req.query.body, (err) => {
      if (err) {
        return res.send({
          error: "Note exists! - please choose another",
        });
      } else {
        console.log("reached else");
        allNotes = notes.loadNotes();
        console.log(JSON.stringify(allNotes));
        return res.send(JSON.stringify(allNotes));
      }
    });
  }
});

app.get("/removenote", (req, res) => {
  if (!req.query.title) {
    return res.send({
      error: "please provide note title",
    });
  } else {
    notes.removeNote(req.query.title, (err) => {
      if (err) {
        return res.send({
          error: "Note does not exist",
        });
      } else {
        allNotes = notes.loadNotes();
        console.log(JSON.stringify(allNotes));
        return res.send(JSON.stringify(allNotes));
      }
    });
  }
});

// error route
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 - Error",
    createdBy: "Gopinath",
  });
});

// start the server
app.listen(3000, () => {
  console.log("server started in port 3000");
});
