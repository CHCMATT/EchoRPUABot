var dbCmds = require('./dbCmds.js');
var { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

var formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.editEmbed = async (client) => {
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