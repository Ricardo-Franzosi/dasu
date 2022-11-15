const securePass = require("../helpers/securePass");
const { where } = require("../schemas/userSchema");
const User = require("../schemas/userSchema");

//muestro el formulario de login
function getLoginForm(req, res, next) {
  res.render("loginForm");
}

//proceso el formulario de login
async function sendLoginForm(req, res, next) {
  const { email, pass } = req.body;
  const user = await User.find().where({ email });
  if (!user.length) {
    return res.render("loginForm", {
      message: "usuario o contraseña incorrecta",
    });
  }
  if (await securePass.decrypt(pass, user[0].password)) {
    const usr = {
      id: user[0]._id,
      name: user[0].name,
      lastName: user[0].lastName,
    };
    req.session.user = usr;
    res.render("login", {
      user: `${req.session.user.name} ${req.session.user.lastName}`,
      id: req.session.user.id,
    })
  } else
    return res.render("loginForm", {
      message: "Usuario o contraseña incorrectos",
    });
}

//muestro el formulario de registro
function getRegisterForm(req, res, next) {
  res.render("registerForm");
}

//proceso el formulario de registro
async function sendRegisterForm(req, res, next) {
  const { name, lastName, email, pass } = req.body;
  const password = await securePass.encrypt(pass);
  //res.send(req.body)
  const newUser = new User({
    name,
    lastName,
    email,
    password,
  });

  const usr = {
    id: newUser._id,
    name: newUser.name,
    lastName: newUser.lastName,
  };
  newUser.save((err) => {
    if (!err) {
      req.session.user = usr;
      res.render("login", {
        user: `${req.session.user.name} ${req.session.user.lastName}`,
        id: req.session.user.id,
      });
    } else {
      res.render("registerForm", {
        message: "Ya existe un registro con ese mail.",
      });
    }
  });
}
// mostramos settings
async function getSettings(req, res) {
  if (req.session.user) {
    const user = await User.findById(req.session.user.id).lean();
    return res.render("editUserForm", { user });
  }
  res.redirect("/loginForm");
}

//procesamos el form de settings
async function sendSettings(req, res) {
  try {
    await User.findByIdAndUpdate(req.session.user.id, req.body);
    res.rendirect("/login");
  } catch (error) {
   // res.render("editUserForm", {
   //   message: "ocurrio un error, intente nuevamente",
   // });
  }
}
async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.session.user.id);
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
   // res.render("editUserForm", {
   //   message: "ocurrio un error, intente nuevamente",
   // });
  }
}
//validate
async function validateEmail(req, res) {
  res.send("email verificado en base de datos");
}
// salir de sesionrs

function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
}
module.exports = {
  getLoginForm,
  sendLoginForm,
  getRegisterForm,
  sendRegisterForm,
  sendSettings,
  getSettings,
  validateEmail,
  deleteUser,
  logout,
};
