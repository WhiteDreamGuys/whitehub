const DiscordRouter = require('../DiscordRouter.js');

class DiscordRouterGuildBanAdd extends DiscordRouter {

  constructor(subsystem) {
    super(subsystem);
  }

  register() {
    this.subsystem.client.on("guildBanAdd", (guild, user) =>{
      var feedbackChannel = this.subsystem.getFeedbackChannel(guild);
      var date = new Date();
      var response = "`[" + date.getFullYear() + ":" + date.getMonth() + ":" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]` ";

      feedbackChannel.send(response + "**" + user.username + "#" + user.discriminator + "** был забанен.");
    });
  }

}

module.exports = DiscordRouterGuildBanAdd;
