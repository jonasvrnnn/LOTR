import express from "express";
import ejs from "ejs";

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.type(".html");
  res.send("<h1>hello world</h1>");
});
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
