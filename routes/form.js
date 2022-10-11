const express = "express";
const router = express.Router();
// import validationRules from "../config/validationRules.js";
const validator = "express-validator";
const { body, validationResult } = validator;
const nodemailer = require("nodemailer");

// este es el middleware con las reglas de validación
const validationRules = [
  body("name")
    .notEmpty()
    .withMessage("Campo obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("Min 2, Max 30")
    .isAlpha()
    .withMessage("No te hagas el cheto"),
  body("lastName")
    .notEmpty()
    .withMessage("Campo obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("Min 2, Max 30"),
  body("email")
    .notEmpty()
    .withMessage("Campo obligatorio")
    .isEmail()
    .withMessage("Debe ingresar un email válido"),
  body("message")
    .notEmpty()
    .withMessage("")
    .trim(" ")
    .isLength({ min: 10, max: 300 })
    .withMessage("Mensaje debe contener entre 10 y 300 caracteres"),
];
//const transport = "../config/nodemailer.js"

router.get("/", (req, res) => {
res.render("login")
})

router.post("/", validationRules, async (req, res) => {
  /*
  Vamos a hallar posibles errores de validación en la request y los vamos a envolver en un objeto de Express-Validator que tiene funciones útiles para tratar con ellos
  */
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formData = req.body;
    const arrWarnings = errors.array();
    res.render("form", { arrWarnings, formData });
  } else {
    const { name, lastName, email, message } = req.body;
    const emailMsg = {
      to: "atencioncliente@nuestraempresa.com",
      from: email,
      subject: "Mensaje desde formulario de contacto",
      html: `Contacto de ${name} ${lastName}: ${message}`,
    };

    const sendMailStatus = await transport.sendMail(emailMsg);
    let sendMailFeedback = "";
    if (sendMailStatus.rejected.length) {
      sendMailFeedback = "No pudimos enviar.";
    } else {
      sendMailFeedback = "Mensaje enviado.";
    }
    res.render("home", { message: sendMailFeedback });
  }
});

export default router;
