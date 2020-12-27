// INIT MATERIALIZE JS METHODS
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelector(".collapsible");
  var instances = M.Collapsible.init(elems, {
    accordion: true,
    inDuration: 1000,
  });

  var sidenav = document.querySelectorAll(".sidenav");
  var sidenavInst = M.Sidenav.init(sidenav, {});
});

// get the inputs
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const addBtn = document.getElementById("add");
// ul
let ul = document.getElementById("noteslist");
// event listeners
addBtn.addEventListener("click", addNote);
ul.addEventListener("click", deleteList);

function addNote(e) {
  e.preventDefault();
  if (!noteTitle.value) {
    alert("enter some title");
    noteTitle.focus();
    return false;
  } else if (!noteBody.value) {
    alert("enter some description please");
    noteBody.focus();
    return false;
  } else {
    fetch(`/addnote?title=${noteTitle.value}&body=${noteBody.value}`).then(
      (res) => {
        console.log(res);
        res.json().then((data) => {
          if (data.error) {
            console.log("error is" + data.error);
            alert(data.error);
            return false;
          } else {
            console.log(data);
            ul.innerHTML = "";
            data.forEach(function (data) {
              createList(data);
            });
          }
        });
      }
    );
    noteTitle.value = "";
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
  let notebody = document.createElement("p");
  let notebodytextnode = document.createTextNode(`${data.body}`);
  notebody.appendChild(notebodytextnode);
  bodyDiv.appendChild(notebody);
  li.appendChild(headerDiv);
  li.appendChild(bodyDiv);
  console.log(`title : ${data.title} body ${data.body}`);
  ul.appendChild(li);
}

function deleteList(e) {
  let removeTitle;
  if (e.target.classList.contains("del")) {
    console.log("yes it is del");
    removeTitle = e.target.nextElementSibling.nextElementSibling.textContent;
    console.log(removeTitle);
    fetch(`/removenote?title=${removeTitle}`).then((res) => {
      console.log(res);
      res.json().then((data) => {
        console.log(data);
        if (data.length === 0) {
          console.log("it is empty");
          ul.innerHTML = `
            <li>
                <div class="collapsible-header">
                     <span class="center">Add note to show here !</span>
                 </div>
            </li>
            `;
        }
      });
    });
    showToast("Deleted successfully");
    e.target.parentElement.parentElement.remove();
  }
}

function showToast(text) {
  var x = document.getElementById("toast");
  x.classList.add("show");
  x.innerHTML = text;
  setTimeout(function () {
    x.classList.remove("show");
  }, 3000);
}
