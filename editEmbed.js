var dbCmds = require('./dbCmds.js');
var { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

var formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.editEmbed = async (client) => {
	try {
		let overallBalance = await dbCmds.readSummValue("overallBalance");

		// Color Palette: https://coolors.co/palette/d8f3dc-b7e4c7-95d5b2-74c69d-52b788-40916c-2d6a4f-1b4332-081c15

		overallBalance = formatter.format(overallBalance);

		var currentBalanceEmbed = new EmbedBuilder()
			.setTitle('Current Balance:')
			.setDescription(overallBalance)
			.setColor('2D6A4F');

		var currEmbed = await dbCmds.readMsgId("embedMsg");

		var channel = await client.channels.fetch(process.env.EMBED_CHANNEL_ID)
		var currMsg = await channel.messages.fetch(currEmbed);

		var btnRows = addBtnRows();

		currMsg.edit({ embeds: [currentBalanceEmbed], components: btnRows });
	} catch (error) {
		if (process.env.BOT_NAME == 'test') {
			console.error(error);
		} else {
			console.log(`Error occured at ${errTime} at file ${fileName}!`);
			console.error(error);

			let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');;
			let fileParts = __filename.split(/[\\/]/);
			let fileName = fileParts[fileParts.length - 1];

			let errorEmbed = [new EmbedBuilder()
				.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
				.setDescription(`\`\`\`${error.toString().slice(0, 2000)}\`\`\``)
				.setColor('B80600')
				.setFooter({ text: `${errTime}` })];

			await interaction.client.channels.cache.get(process.env.ERROR_BOT_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
		}
	}
};

function addBtnRows() {
	var row1 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addCarSale')
			.setLabel('Add a Car Sale')
			.setStyle(ButtonStyle.Primary),

		new ButtonBuilder()
			.setCustomId('addCarPurchase')
			.setLabel('Add a Car Purchase')
			.setStyle(ButtonStyle.Secondary),
	);

	var rows = [row1];
	return rows;
};