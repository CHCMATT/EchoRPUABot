var { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
var dbCmds = require('./dbCmds.js');

var formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.postEmbed = async (client) => {
	let overallBalance = await dbCmds.readSummValue("overallBalance");

	// Color Palette: https://coolors.co/palette/d8f3dc-b7e4c7-95d5b2-74c69d-52b788-40916c-2d6a4f-1b4332-081c15

	overallBalance = formatter.format(overallBalance);

	var currentBalanceEmbed = new EmbedBuilder()
		.setTitle('Current Balance:')
		.setDescription(overallBalance)
		.setColor('2D6A4F');

	var btnRows = addBtnRows();

	client.embedMsg = await client.channels.cache.get(process.env.EMBED_CHANNEL_ID).send({ embeds: [currentBalanceEmbed], components: btnRows });

	await dbCmds.setMsgId("embedMsg", client.embedMsg.id);
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