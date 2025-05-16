import express from "express";
import ejs from "ejs";

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.render("landing");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/sudden_death", (req, res) => {
  res.render("game", {
    gameMode: "sudden_death",
  });
});
app.get("/ten_rounds", (req, res) => {
  res.render("game", {
    gameMode: "ten_rounds",
  });
});
app.get("/gameMode", (req, res) => {
  res.render("gameMode");
});
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
