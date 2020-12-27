const fs = require("fs");

// load chalk
const chalk = require("chalk");

// create a note
const addNote = (title, body, callback) => {
  const notes = loadNotes(); //this is an array

  const duplicateNote = notes.find((note) => note.title === title);

  if (!duplicateNote) {
    notes.push({
      title: title,
      body: body,
    });
    saveNotes(notes);
    console.log(chalk.green.inverse("New Note Added!"));
    callback(undefined, "Note added successfully");
    return false;
  } else {
    console.log(`the duplicate item is ${duplicateNote}`);
    console.log(
      chalk.red.inverse("Title already exists, please choose another")
    );
    callback(duplicateNote, undefined);
    return false;
  }
};

// to save notes
const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("./src/notes.json", dataJSON);
};

// load notes from notes.json
const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("./src/notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// remove a note
const removeNote = (title, callback) => {
  const notes = loadNotes();

  // only keep the notes which are not matching the passed title
  const notesToKeep = notes.filter((note) => note.title !== title); //this returns true each time if title not matches

  //condition for checking if the title is removed or not
  if (notes.length != notesToKeep.length) {
    console.log(chalk.green.inverse("Note removed successfully!"));

    // now we have a new array to be saved
    saveNotes(notesToKeep);
    callback(undefined, "note removed successfully");
  } else {
    callback("Note does not exist", undefined);
    console.log(chalk.red.inverse("Note does not exist!"));
  }
};

// listing notes
const listNotes = () => {
  console.log(chalk.green.inverse("Your Notes..."));
  const notes = loadNotes();
  notes.forEach((note) => {
    console.log(chalk.yellow.inverse("Title: " + note.title));
    console.log(chalk.white.inverse("Body: " + note.body));
    console.log("**************************************");
  });
};

// read a note
const readNote = (title) => {
  // load notes
  const notes = loadNotes();

  // find the note which matches the given title
  const reqNote = notes.find((note) => note.title === title);

  if (reqNote) {
    console.log(chalk.yellow.inverse(reqNote.title));
    console.log(chalk.white.inverse(reqNote.body));
  } else {
    console.log(chalk.red.inverse("Title Not Fond!"));
  }
};

module.exports = {
  addNote: addNote,
  removeNote: removeNote,
  listNotes: listNotes,
  readNote: readNote,
  loadNotes: loadNotes,
};
