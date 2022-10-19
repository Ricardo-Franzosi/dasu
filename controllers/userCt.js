const securePass = require ('../helpers/securePass');
const { where } = require('../schemas/userSchema');
const User = require ("../schemas/userSchema")

function getLoginForm(req, res, next) {
    res.render('loginForm')
};
async function sendLoginForm(req, res, next) {
    const { email, pass } = req.body;
    const user = await User.find().where({email})
    if(!user.length) {
      return res.render("loginForm", {message: "usuario o cntraseña incorrecta"})
    }
    if (await securePass.decrypt(pass, user[0].password)) {
      const usr = {
        id: user[0]._id,
        name: user[0].name,
        lastName: user[0].lastName
      }
      req.session.user = usr
      res.render("login", { user: `${req.session.user.name} ${req.session.user.lastName}`, id: req.session.user.id })
    } else return res.render("loginForm", { message: "Usuario o contraseña incorrectos" })
  };
  
function getRegisterForm(req, res, next) {
    res.render('registerForm')
};

async function sendRegisterForm(req, res, next) {
    //res.send(req.body)
    const { name, lastName, email, pass } = req.body
    const password = await securePass.encrypt(pass)    
   
    const newUser = new User ({
       name, lastName, email, password
    })
    const usr = {
        id: newUser._id,
        name: newUser.name,
        lastName: newUser.lastName
      }
    newUser.save>((err)=>{
       if (!err){
        req.session.user = usr
            res.render("login", { user: `${req.session.user.name} ${req.session.user.lastName}`, id: req.session.user.id })
       }else{
            res.render("registerForm", {message: "Ya existe un registro con ese mail."});
        }
   })

  }
  function logout(res, req ){
    req.session.destroy()
    res.redirect("/");
  }
module.exports = { getLoginForm, sendLoginForm, getRegisterForm, sendRegisterForm, logout }