const userModel = require('../model/user')

async function listUsers() {
  const users = await userModel.findAll();
  return users;
}

async function createUser(user) {
  return userModel.create(user);
}

async function getUser(param) {
  const user = await userModel.findOne({where: {userName: param}});
  return user;
}

async function deleteUser(param) {
  const user = await userModel.destroy({where: {userName: param}});
  return user;
}

module.exports = { createUser, getUser, listUsers, deleteUser }