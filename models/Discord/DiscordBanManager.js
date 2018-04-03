var fs = require('fs');

class DiscordBanManager {
  constructor(subsystem) {
    this.subsystem = subsystem;
    this.bans = require("../../data/softbans.json");


  }

  setup() {
    setInterval(() => {
      this.handleTempbans();
    }, 15000);
  }

  save() {
    fs.writeFile('./data/softbans.json', JSON.stringify(this.bans, null, 4), 'utf8', (error) => {
      if (error) {
        return this.subsystem.manager.logger.log("error", "Error saving discord softbans: " + error);
      }
      this.subsystem.manager.logger.log("debug", "Saved discord bans file.");
    });
  }

  ban(guildMember, reason, time) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    var feedbackChannel = this.subsystem.getFeedbackChannel(guildMember.guild);

    var date = new Date();

    var expiry = time;
    if (time) {
      expiry = date.getTime() + (time * 60000); // 1000ms in one second, and 60 seconds in one minute
    }

    var ban = {
      userID: guildMember.user.id,
      username: (guildMember.user.username + "#" + guildMember.user.discriminator),
      reason: reason,
      expires: expiry
    }

    var banMessage = "Ты был забанен в " + config.server_name + " за `" + reason + "`. Бан  " + (time ? "пройдёт через " + time + " минут" : "не пройдёт.");

    guildMember.user.sendMessage(banMessage);

    feedbackChannel.send("**" + guildMember.user.username + "#" + guildMember.user.discriminator + "** Был " + (config.discord_softban ? "soft" : "hard") + "забанен с сервера за `" + reason + "` оно " + (time ? "пройдёт через **" + time + "** минут" : "не пройдёт.") + ".")

    if (config.discord_softban) {
      guildMember.addRole(config.discord_softban_role).then(
        resolve => {;
          this.bans.push(ban);
          this.save();
        },
        reject => {}
      );
    }
    else {
      guildMember.addRole(config.discord_softban_role).then(
        resolve => {},
        reject => {}
      );

    }
    return true;

  }

  unban(guild, member, reason) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    var feedbackChannel = this.subsystem.getFeedbackChannel(member.guild);

    var newBans = [];

    for (var ban of this.bans) {
      if (ban.userID === member.user.id) {
        feedbackChannel.send("**" + member.user.username + "#" + member.user.discriminator + "** Был разбанен за `" + reason + "`.")
        this.bans = newBans;
        this.save();
        member.removeRole(config.discord_softban_role);
        return true;
      }
      else {
        newBans.push(ban);
      }
    }


    return false;
  }

  handleTempbans() {
    var bansToLift = [];
    var date = new Date();
    var guild = this.subsystem.getPrimaryGuild();

    for (var ban of this.bans) {
      if (ban.expires) {
        if (ban.expires <= date.getTime()) {
          bansToLift.push(ban);
        }
      }
    }

    for (var ban of bansToLift) {
      guild.fetchMember(ban.userID).then(
        resolve => {
          this.unban(guild, resolve, "Бан прошел.");
        },
        reject => {
          this.subsystem.manager.logger.log("info", "Failed to change discord roles of user with ID " + ban.userID + " because their ID wasnt found on the server, the ban has been lifted from the config file.");
        }
      );
    }
  }
}

module.exports = DiscordBanManager;
