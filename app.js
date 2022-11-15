require("./config/mongo")
const path = require("path");

const { log } = require("console");
const express = require("express");
const nodemon = require("nodemon");
const session = require("express-session");
const hbs = require("express-handlebars");
const nodemailer = require ("nodemailer");
const PORT = 3000;

//const { default: router } = require("./routes/form");
//const { format } = require("path");

const app = express();
//const router = (./rout/rm.js)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}));


// carpeta de recursos estaticos
app.use(express.static(path.join(__dirname,"/public")));
app.use (express.json());
//midelware para la lectura del Body de la request
app.use(express.urlencoded({extended: true}));

app.engine(".hbs", hbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.get("/", (req, res) => {
res.render("home", {user: req.session.user})
})

app.use ("/users", require ("./routes/userRt"))
//app.use("/", router)

const auth = (req, res, next) => {
  if (req.session.user) {
    next()
  } else res.redirect("/noAuth")
}

app.get("/login", auth, function (req, res) {
  res.render("login", { user: `${req.session.user.name} ${req.session.user.lastName}`, id: req.session.user.id });
});

app.get("/noauth", (req, res) => {
  res.render("noAuth")
});

app.get("/contacto", function (req, res) {
  res.render("contacto");
});

app.get("/ordenes", auth, function (req, res) {
  res.render("ordenes", {user: req.session.user});
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

//auth, (req, res) => {
//  res.render("secret", { user: `${req.session.user.name} ${req.session.user.lastName}`, id: req.session.user.id })
//})
