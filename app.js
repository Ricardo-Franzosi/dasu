require("./config/mongo")
const { log } = require("console");
const express = require("express");
const nodemon = require("nodemon");
const hbs = require("express-handlebars");
const nodemailer = require ("nodemailer");
const PORT = 3000;
const path = require("path");
//const { default: router } = require("./routes/form");
//const { format } = require("path");

const app = express();
//const router = (./rout/rm.js)

// carpeta de recursos estaticos
app.use(express.static("public"));

//midelware para la lectura del Body de la request
app.use(express.urlencoded({extended: true}));

app.engine(".hbs", hbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
res.render("home")
})
 
//app.use("/", router)

app.get("/login", function (req, res) {
  res.render("login");
});


app.get("/contacto", function (req, res) {
  res.render("contacto");
});

app.get("/ordenes", function (req, res) {
  res.render("ordenes");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notFound.html"));
});

app.listen(PORT, (err) => {
  err
    ? console.log(`Error: ${err.code}`)
    : console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/", function (req, res) {
  const {name, lastName, email, message} = req.body
  const emailMsg = {
    to: "atencioncliente@nuestraempresa.com",
      from: email,
      subject: "Mensaje desde app de Dasuten",
      html: `Contacto de ${name} ${lastName}: ${message}`,
  }

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "06f410446907a8",
      pass: "f71a66c211d057"
    }
  });

  transport.sendMail(emailMsg)
  res.render("login", {message: "mensaje enviado"})
})