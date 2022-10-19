const bcrypt = require("bcrypt");
const saltRnd = 10;

const encrypt = async (pass) => {
  return await bcrypt.hash(pass, saltRnd);  //retorna contraseña encriptada
};

const decrypt = async (pass, hashedPass) => {
  return await bcrypt.compare(pass, hashedPass); //true o false
};

module.exports = { encrypt, decrypt }