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
    gameMode: "sudden_death", explanation: `
    <p>Je krijgt vragen één voor één en hebt 30 seconden per vraag om te antwoorden. Maar pas op: als je één fout maakt, is het game over! Hoe ver kun jij komen? Succes!</p>
    <p>Denk goed na, speel tactisch en probeer zover mogelijk te komen. Succes!</p>
  `
  });
});
app.get("/ten_rounds", (req, res) => {
  res.render("game", {
    gameMode: "ten_rounds",explanation: `
    <p>Je krijgt 10 vragen en hebt 30 seconden per vraag om te antwoorden. Probeer zoveel mogelijk correcte antwoorden te geven binnen de tijd. Veel succes!</p>
    <p>Beantwoord zoveel mogelijk vragen correct om een hoge score te behalen. Als de tijd om is, ga je automatisch naar de volgende vraag. Succes!</p>
  `
  });
});
app.get("/gameMode", (req, res) => {
  res.render("gameMode");
});
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});

app.get("/register", (req,res)=>{
  res.render("register")
})
