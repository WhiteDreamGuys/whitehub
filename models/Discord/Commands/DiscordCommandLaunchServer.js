const DiscordCommand = require('../DiscordCommand.js');
var shell = require('shelljs');

class DiscordCommandLaunchServer extends DiscordCommand {

  constructor(subsystem) {
    super("launch", "запуск сервера", 'launch', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    shell.exec('echo "hooy" > test.txt');
  }

}

module.exports = DiscordCommandWho;
