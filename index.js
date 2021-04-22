const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./config.json')
const prefix = config.prefix
const token = config.token

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 

client.on("ready", () => {
    console.log("I'm ready to use.");
    const status = [
        `${prefix}help | ${client.user.username}`,
        `With ${client.users.cache.size} Users | ${client.user.username}`,
        `In ${client.guilds.cache.size} Guilds | ${client.user.username}`
    ]
    setInterval(() => {
        client.user.setActivity(status[Math.floor(Math.random() * status.length)], {type: "PLAYING"})
    }, 3000)
});

client.on('message', async message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) command.run(client, message, args) 
});


client.login(token);