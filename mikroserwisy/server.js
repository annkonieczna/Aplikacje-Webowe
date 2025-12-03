let express = require("express"); // importujemy paczkę poprzez jej wymaganie
let app = express();

function mojafunkcja() {
  console.log(`serwer startuje na porcie ${3000}`);
}
let login = "twojastara";
function mojafunkcja2(req, res) {
  // console.log(req,res)
  fetch("http://localhost:3001/data/file")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
  res.status(200).sendFile(__dirname + "/index.html");
}
function getData(req, res) {
  res.json({ data: "z serwera, nie pliku" });
}
function getDataFile(req, res) {
  res.sendFile(__dirname + "/books.json");
}

app.get("/a/b", mojafunkcja2);
app.get("/data", getData);
app.get("/data/file", getDataFile);

app.get("/api/books", (req, res) => {
  console.log("/api/books");
  res.sendFile(__dirname + "/books.json");
});
app.get("/api/:id", (req, res) => {
  let id = req.params.id;
  res.send("ID: " + id);
});

app.get("/api/books/:id", (req, res) => {
  const books = require(__dirname + "/books.json");
  const id = req.params.id;
  res.json(books[id]);
});

app.listen(3000, mojafunkcja); // na obiekcie app wywołuję funkcję listen z portem 3000 i moją funkcją
