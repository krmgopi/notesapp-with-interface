// INIT MATERIALIZE JS METHODS
document.addEventListener("DOMContentLoaded", function () {
  // console.log("loaded");
  var elems = document.querySelector(".collapsible");
  var instances = M.Collapsible.init(elems, {
    accordion: true,
    inDuration: 1000,
  });

  var sidenav = document.querySelectorAll(".sidenav");
  var sidenavInst = M.Sidenav.init(sidenav, {});

  // const countNoteTitle = document.querySelector("#noteTitle");
  // const countnote = new M.CharacterCounter(countNoteTitle);

  // const countNoteBody = document.querySelector("#noteBody");
  // const countbody = new M.CharacterCounter(countNoteBody);

  // var instance = M.Collapsible.getInstance(elems);
  // instance.destroy();
});

// get the inputs
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const addBtn = document.getElementById("add");
const helperNote = document.querySelector(".helper-note");
const helperBody = document.querySelector(".helper-body");
const titleMaxLength = 20;
const titleWarnLength = 15;
const bodyMaxLength = 300;
const bodyWarnLength = 290;

// ul
let ul = document.getElementById("noteslist");
// event listeners
addBtn.addEventListener("click", addNote);
ul.addEventListener("click", deleteList);

["keyup", "change", "keydown", "focus", "blur"].forEach(function (e) {
  noteTitle.addEventListener(e, notetitleCounter);
});

["keyup", "change", "keydown", "focus", "blur"].forEach(function (e) {
  noteBody.addEventListener(e, notebodyCounter);
});

function notetitleCounter(e) {
  let count = noteTitle.value.length;

  if (count >= 1) {
    helperNote.classList.remove("red-text");
    helperNote.innerHTML = `${titleMaxLength - count} charecters left`;
  }
  if (count > titleMaxLength) {
    helperNote.classList.remove("red-text");
    noteTitle.value = noteTitle.value.substring(0, titleMaxLength);
    count--;
  }
  if (count + 1 > titleWarnLength) {
    helperNote.classList.add("red-text");
    helperNote.innerHTML = `${titleMaxLength - count} charecters left`;
  }
}

function notebodyCounter(e) {
  let count = noteBody.value.length;

  if (count >= 1) {
    helperBody.classList.remove("red-text");
    helperBody.innerHTML = `${bodyMaxLength - count} charecters left`;
  }
  if (count > bodyMaxLength) {
    helperBody.classList.remove("red-text");
    noteBody.value = noteBody.value.substring(0, bodyMaxLength);
    count--;
  }
  if (count + 1 > bodyWarnLength) {
    helperBody.classList.add("red-text");
    helperBody.innerHTML = `${bodyMaxLength - count} charecters left`;
  }
}

function addNote(e) {
  e.preventDefault();
  if (!noteTitle.value) {
    helperNote.classList.add("red-text");
    helperNote.innerHTML = "please enter some title";
    noteTitle.focus();
    return false;
  } else if (!noteBody.value) {
    helperBody.classList.add("red-text");
    helperBody.innerHTML = "please enter description";
    noteBody.focus();
    return false;
  } else {
    fetch(`/addnote?title=${noteTitle.value}&body=${noteBody.value}`).then(
      (res) => {
        // console.log(res);
        res.json().then((data) => {
          if (data.error) {
            // console.log("error is" + data.error);
            alert(data.error);
            return false;
          } else {
            // console.log(data);
            ul.innerHTML = "";
            data.forEach(function (data) {
              createList(data);
            });
          }
        });
      }
    );
    noteTitle.value = "";
    helperNote.innerHTML = "";
    helperBody.innerHTML = "";
    noteBody.value = "";
  }
}

function createList(data) {
  let li = document.createElement("li");
  let headerDiv = document.createElement("div");
  headerDiv.classList.add("collapsible-header");
  let delIcon = document.createElement("i");
  delIcon.classList.add("material-icons", "collapsible-secondary", "del");
  let deltextnode = document.createTextNode("delete");
  delIcon.appendChild(deltextnode);
  let expandIcon = document.createElement("i");
  expandIcon.classList.add(
    "material-icons",
    "caret",
    "collapsible-secondary",
    "cc",
    "expa"
  );
  let expandtextnode = document.createTextNode("expand_more");
  expandIcon.appendChild(expandtextnode);
  headerDiv.appendChild(delIcon);
  headerDiv.appendChild(expandIcon);
  let notetitle = document.createElement("span");
  notetitle.classList.add("note-title");
  let titletextnode = document.createTextNode(`${data.title}`);
  notetitle.appendChild(titletextnode);
  headerDiv.appendChild(notetitle);
  let bodyDiv = document.createElement("div");
  bodyDiv.classList.add("collapsible-body");
  let notebody = document.createElement("span");
  let notebodytextnode = document.createTextNode(`${data.body}`);
  notebody.appendChild(notebodytextnode);
  bodyDiv.appendChild(notebody);
  li.appendChild(headerDiv);
  li.appendChild(bodyDiv);
  // console.log(`title : ${data.title} body ${data.body}`);
  ul.appendChild(li);
}

function deleteList(e) {
  // e.stopPropagation();
  let removeTitle;
  if (e.target.classList.contains("del")) {
    let confirmation = confirm("are you sure to delete ? ");
    // console.log("yes it is del");
    if (!confirmation) {
      return false;
    } else {
      // console.log("deleted");
      removeTitle = e.target.nextElementSibling.nextElementSibling.textContent;
      fetch(`/removenote?title=${removeTitle}`).then((res) => {
        // console.log(res);
        res.json().then((data) => {
          // console.log(data);
          if (data.length === 0) {
            // console.log("it is empty");
            ul.innerHTML = `
          <ul class="collapsible">
            <li>
                <div class="collapsible-header">
                   <span class="center">Add note to show here !</span>
               </div>
            </li>
          </ul>
            `;
          }
        });
      });

      e.target.parentElement.parentElement.remove();
      showToast("Deleted successfully");
    }
  }
}

function showToast(text) {
  var x = document.getElementById("toast");
  x.classList.add("show");
  x.innerHTML = text;
  setTimeout(() => {
    x.classList.remove("show");
  }, 3000);
}
