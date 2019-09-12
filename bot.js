const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require('fs');
bot.mutes = require('./mutes.json');
let config = require('./botconfig.json');
let token = config.token;
let prefix = config.prefix;
let profile = require('./profile.json');
fs.readdir('./cmds/',(err,files)=>{
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <=0) console.log("Нет комманд для загрузки!!");
    console.log(`Загружено ${jsfiles.length} комманд`);
    jsfiles.forEach((f,i) =>{
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Загружен!`);
        bot.commands.set(props.help.name,props);
        bot.on('message', async (message) =>{
            if(message.content.startsWith(prefix+ "eval")){
             if(message.author.id === '611444340434403348' || message.author.id === '534998805863464961'){
            const args = message.content.slice(6).split(' ');     
            const code = args.join(" ")
                .replace(/client\.token|client\[.token.\]/ig, 'kthxbai')
              try {
                let evaled = eval(code);
                if (!code) {
                    let meval = new Discord.RichEmbed()
                    
                    .setColor('RANDOM')
                    .addField('Ошибка', 'Нужно больше кода!')
                    
                  return message.channel.send(meval);
                }
            
                if (typeof evaled !== 'string')
                  evaled = require('util').inspect(evaled);
            
                const embed = new Discord.RichEmbed()
                  .setTitle(`EVAL ✅`)
                  .setColor("0x4f351")
                  .addField(`📥 Input:`, `\`\`\`${code}\`\`\` \n`)
                  .addField(`📤Output:`, )
                  .addField(`🛒Type:`, `\`\`\`${(typeof evaled)}\`\`\`\n`)
                  .addField(`✅Evaled:`, `\`\`\`${(evaled)}\`\`\`\n `)
                message.channel.send(embed)
              } catch (err) {
                let eem = new Discord.RichEmbed()
                  .setTitle(`EVAL ✅`)
                  .setColor("RED")
                  .addField(`📥 Input:`, `\`\`\`${code}\`\`\` \n`)
                  .addField(`📤Output:`, )
                  .addField(`🛒Type:`, `\`\`\`${(typeof evaled)}\`\`\`\n`)
                  .addField(`✅Evaled:`, `\`\`\`${(evaled)}\`\`\`\n `)
                  .addField(`❌Error:`, `\`\`\`${(err)}\`\`\``)
                message.channel.send(eem);
              }
                }
            }
            })

});


const activities_list = [
    `Создататель: Denchick - [3l0yDeNcHiCk]#3068`,
    `Помощь --> ;help`,
    `Сервера --> %servers%`,
];
bot.on('ready', () => {
    bot.user.setStatus('dnd')
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        bot.user.setPresence({ game: { name: activities_list[index], type: "gaming", game: "Minecraft"}});    }, 1500);
});

const Discord = require("discord.js");
module.exports = {
  help: {
     name: 'github',
     aliases: [""],
     description: "Поиск пользователя на github.",
     enabled: true
  },
  run: async (bot, message, args) => {
  if(!args[0]) return; require("node-fetch")(`https://api.github.com/users/${args[0]}`).then(res => res.json()).then(json => {
  if(!json.login) return
  let embed = new Discord.RichEmbed()
  .setColor(bot.color) // Замените на свой цвет.
  .setAuthor(args[0], json.avatar_url, json.html_url)
  .setDescription(`Имя: ${json.name ? json.name : "Не найдено."} | ${json.company ? json.company : "Компании нет."}\nБиография: ${json.bio ? json.bio : "Нет."}`)
  .addField('Статистика:', `Кол-во открытых репозиторий: ${json.public_repos} | Гистов: ${json.public_gists}\nПодписок: ${json.following} | Подписчиков: ${json.followers}`)
  if(json.blog){ embed.addField('_ _', `[Блог](${json.blog}) | [Ссылка на профиль](${json.html_url})`)}
  bot.send(embed)
  })   
 }
}

bot.run(str(token))

bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
        console.log(link);
    });
    bot.setInterval(()=>{
        for(let i in bot.mutes){
            let time = bot.mutes[i].time;
            let guildid = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildid);
            let member = guild.members.get(i);
            let muteRole = member.guild.roles.find(r => r.name === "Muted"); 
            if(!muteRole) continue;

            if(Date.now()>= time){
                member.removeRole(muteRole);
                delete bot.mutes[i];
                fs.writeFile('./mutes.json',JSON.stringify(bot.mutes),(err)=>{
                    if(err) console.log(err);
                });
            }
        }

    },5000)

});
bot.on('guildMemberAdd',(member)=>{
    let role = member.guild.roles.find(r => r.name === "[I]Незнакомчик");
    member.addRole(role);
});

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    let uid = message.author.id;
    bot.send = function (msg){
        message.channel.send(msg);
    };
    if(!profile[uid]){
        profile[uid] ={
            coins:10,
            warns:0,
            xp:0,
            lvl:1,
        };
    };
    let u = profile[uid];

    u.coins++;
    u.xp++;

    if(u.xp>= (u.lvl * 5)){
        u.xp = 0;
        u.lvl += 1;
    };


    fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{
        if(err) console.log(err);
    });

    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if(!message.content.startsWith(prefix)) return;
    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot,message,args);
    bot.rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    bot.uId = message.author.id;
});
bot.login(token);
})
