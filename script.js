var notification = document.getElementById("notification");
var form = document.getElementById("form");
var pdfbody = document.getElementById("pdf-list");
var submitBtn = document.getElementById("submit_btn");
// // Form Submit --------------------------------------
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   var formData = new FormData(form);
//   fetch("http://localhost/pdf-admin/api/create.php", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.body)
//     .then((data) => {
//       console.log(data);
//       var success = document.createElement("p");
//       success.innerText = data.body;
//       notification.append(success);
//     })
//     .catch((error) => {
//       console.log(er);
//       var error = document.createElement("p");
//       error.style.color = "red";
//       error.innerHTML = er;
//       notification.innerHTML = error;
//     });
// });

// // Pdf List ------------------------------------------
// var pdflistUl = document.getElementById("pdf-list");
// function retrieveList() {
//   fetch("http://localhost/pdf-admin/api/read.php", {
//     method: "GET",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.length < 1) {
//         return;
//       }
//       var ul = document.createElement("ol");
//       data.forEach((element) => {
//         var li = document.createElement("li");

//         var p = document.createElement("p");
//         p.innerText = element.name;

//         var deleteBtn = document.createElement("button");
//         deleteBtn.innerText = "Delete";
//         deleteBtn.addEventListener("click", (e) => {
//           deletePdf(li, element.id);
//         });
//         li.appendChild(p);
//         li.appendChild(deleteBtn);

//         ul.appendChild(li);
//       });
//       pdflistUl.replaceChildren(...ul.childNodes);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
// retrieveList();

// function deletePdf(elem, id) {
//   fetch("http://localhost/pdf-admin/api/delete.php?id=" + id, {
//     method: "PATCH",
//   })
//     .then((res) => res.body)
//     .then((data) => {
//       elem.remove();

//       var success = document.createElement("p");
//       success.innerHTML = "Delete Successful"
//       notification.replaceChild(notification.firstChild,success);
//     })
//     .catch((error) => {
//       var error = document.createElement("p");
//       error.style.color = "red";
//       error.innerHTML = error;
//       notification.innerHTML = error;
//     });
// }

async function retrieveList() {
  try {
    var data = await fetch("http://localhost/pdf-admin/api/read.php");
    var pdfArray = await data.json();
    if (!data || pdfArray.length < 1) {
      return;
    }
    pdfbody.innerHTML = "";
    pdfbody.appendChild(InitialHeader());

    pdfArray.forEach((pdf) => {
      pdfbody.appendChild(Item(pdf));
    });
  } catch (error) {
    console.log(error);
  }
}

retrieveList();

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
submitBtn.addEventListener("click", (e) => {
  var formData = new FormData(form);
  addItem(formData);
});

async function addItem(data) {
  try {
    var insert = await fetch("http://localhost/pdf-admin/api/create.php", {
      method: "POST",
      body: data,
    });
    var result = await insert.body;
    if (result) {
      Notification("Added", () => {
        form.reset();
        retrieveList();
      });
    }
  } catch (error) {
    Notification(error);
  }
}

async function removeItem(id) {
  try {
    var remove = await fetch(
      "http://localhost/pdf-admin/api/delete.php?id=" + id,
      {
        method: "PATCH",
      }
    );
    if (!remove.ok) {
      return;
    }
    Notification("Removed");
  } catch (error) {
    Notification("Error to remove");
  }
}

function InitialHeader() {
  var content = {id:"header",name:"Title"};
  var li = document.createElement("li");
  li.id = content.id;

  var div = document.createElement("div");
  div.classList = "item";

  var p = document.createElement("p");
  p.classList.add("item-h");
  var textNode = document.createTextNode(content.name);
  p.appendChild(textNode);

  var btn = document.createElement("div");
  btn.classList.add("item-hb");

  div.appendChild(p);
  div.appendChild(btn);

  li.appendChild(div);
  return li;
}

function Item(content) {
  var li = document.createElement("li");
  li.id = content.id;

  var div = document.createElement("div");
  div.classList = "item";

  var p = document.createElement("p");
  p.classList.add("item-p");
  var textNode = document.createTextNode(content.name);
  p.appendChild(textNode);

  var btn = document.createElement("button");
  btn.classList.add("item-btn");
  var textNode = document.createTextNode("DELETE");
  btn.appendChild(textNode);

  btn.addEventListener("click", (e) => {
    li.remove();
    removeItem(content.id);
  });

  div.appendChild(p);
  div.appendChild(btn);

  li.appendChild(div);
  return li;
}

function Notification(text, cb = () => {}) {
  var div = document.getElementById("noti");

  var p = document.createElement("p");
  p.classList.add("noti-p");
  var textNode = document.createTextNode(text);
  p.appendChild(textNode);

  div.innerHTML = "";

  div.appendChild(p);

  setTimeout(() => {
    div.innerHTML = "";
    cb();
  }, 3000);
}
