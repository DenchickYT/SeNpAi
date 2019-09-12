const Discord = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (bot,message,args) => {
		
		try{
		
    let embed = new Discord.RichEmbed()
	
    .setDescription("Помощь")
	.setColor("00FF09")
    .setThumbnail(message.guild.iconURL)
	
    .addField("ban - Забанить участника.", "Использование: ban _участник_ _причина_", false)
    .addField("clear - Очистить сообщения.", "Использование: clear _количество_", false)
    .addField("kick - Выгнать участника.", "Использование: kick _участник_", false)
    .addField("mute - Дать мут участнику.", "Использование: mute _участник_ _время_ _причина_", false)
	.addField("unmute -Убрать мут у участника.", "Использование: unmute _участник_", false)
    .addField("ping - Проверят пинг.", "Использование: ping", false)
    .addField("say - Сказать от бота.", "Использование: say _текст_", false)
    .addField("serverinfo - Инфорация о сервере.", "Использование: serverinfo", false)
    .addField("unwarn - Убрать у участника варн.", "Использование: unwarn _участник_", false)
    .addField("userinfo - Узнать инфорацию участника.", "Использование: userinfo", false)
    .addField("art - Рисовать квадратиками :3.", "Использование: art 1-30", false)

		console.log(`${message.author.tag} [${message.author.id}] юзал команнду 'help' `)

    message.channel.send(embed);

  }catch(err){
    console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);

  }

};
module.exports.help = {
    name: "help"
};