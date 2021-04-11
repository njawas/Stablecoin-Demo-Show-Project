const Migrations = artifacts.require("Util/Migrations");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Migrations);
};
