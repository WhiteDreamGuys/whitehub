const DiscordRouter = require('../DiscordRouter.js');

class DiscordRouterGuildMemberAdd extends DiscordRouter {

  constructor(subsystem) {
    super(subsystem);
  }

  register() {
    this.subsystem.client.on("guildMemberAdd", (member) =>{
      var feedbackChannel = this.subsystem.getFeedbackChannel(member.guild);
      var date = new Date();
      var response = "`[" + date.getFullYear() + ":" + date.getMonth() + ":" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]` ";

      feedbackChannel.send(response + "**" + member.user.username + "#" + member.user.discriminator + "** присоединился к нам.");
    });
  }

}

module.exports = DiscordRouterGuildMemberAdd;
