var dbCmds = require('./dbCmds.js');
var editEmbed = require('./editEmbed.js');
var { EmbedBuilder } = require('discord.js');

var formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

function toTitleCase(str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
}

function strCleanup(str) {
	var cleaned = str.replaceAll('`', '-').replaceAll('\\', '-').trimEnd().trimStart();
	return cleaned;
};

module.exports.modalSubmit = async (interaction) => {
	try {
		var modalID = interaction.customId;
		switch (modalID) {
			case 'addCarSaleModal':
				var salesmanName;
				if (interaction.member.nickname) {
					salesmanName = interaction.member.nickname;
				} else {
					salesmanName = interaction.member.user.username;
				}

				var now = Math.floor(new Date().getTime() / 1000.0);
				var saleDate = `<t:${now}:d>`;

				var soldTo = toTitleCase(strCleanup(interaction.fields.getTextInputValue('soldToInput')));
				var vehicleName = toTitleCase(strCleanup(interaction.fields.getTextInputValue('vehicleNameInput')));
				var vehiclePlate = strCleanup(interaction.fields.getTextInputValue('vehiclePlateInput')).toUpperCase();
				var price = Math.abs(Number(strCleanup(interaction.fields.getTextInputValue('priceInput')).replaceAll(',', '').replaceAll('$', '')));
				var notes = strCleanup(interaction.fields.getTextInputValue('notesInput'));

				await interaction.client.googleSheets.values.append({
					auth: interaction.client.auth, spreadsheetId: interaction.client.sheetId, range: "Car Sales!A:G", valueInputOption: "RAW", resource: { values: [[`${salesmanName} (<@${interaction.user.id}>)`, saleDate, soldTo, vehicleName, vehiclePlate, price, notes]] }
				});

				var formattedPrice = formatter.format(price);

				if (isNaN(price)) { // validate quantity of money
					await interaction.reply({
						content: `:exclamation: \`${interaction.fields.getTextInputValue('priceInput')}\` is not a valid number, please be sure to only enter numbers.`,
						ephemeral: true
					});
					return;
				}

				if (!notes || notes.toLowerCase() === "n/a") {
					var carSoldEmbed = [new EmbedBuilder()
						.setTitle('A car has been sold!')
						.addFields(
							{ name: `Salesperson Name:`, value: `${salesmanName} (<@${interaction.user.id}>)` },
							{ name: `Sale Date:`, value: `${saleDate}` },
							{ name: `Car Sold To:`, value: `${soldTo}` },
							{ name: `Vehicle Name:`, value: `${vehicleName}` },
							{ name: `Vehicle Plate:`, value: `${vehiclePlate}` },
							{ name: `Final Sale Price:`, value: `${formattedPrice}` },
						)
						.setColor('74C69D')];
				} else {
					var carSoldEmbed = [new EmbedBuilder()
						.setTitle('A car has been sold!')
						.addFields(
							{ name: `Salesperson Name:`, value: `${salesmanName} (<@${interaction.user.id}>)` },
							{ name: `Sale Date:`, value: `${saleDate}` },
							{ name: `Car Sold To:`, value: `${soldTo}` },
							{ name: `Vehicle Name:`, value: `${vehicleName}` },
							{ name: `Vehicle Plate:`, value: `${vehiclePlate}` },
							{ name: `Final Sale Price:`, value: `${formattedPrice}` },
							{ name: `Notes:`, value: `${notes}` }
						)
						.setColor('74C69D')];
				}

				await interaction.client.channels.cache.get(process.env.SALES_CHANNEL_ID).send({ embeds: carSoldEmbed });

				await dbCmds.addSummValue("overallBalance", price);

				await editEmbed.editEmbed(interaction.client);

				var newOverallBalance = await dbCmds.readSummValue("overallBalance");
				var formattedNewBalance = formatter.format(newOverallBalance);
				var reason = `Car Sale to \`${soldTo}\` for \`${formattedPrice}\` on ${saleDate}`

				// color palette: https://coolors.co/palette/706677-7bc950-fffbfe-13262b-1ca3c4-b80600-1ec276-ffa630
				var notificationEmbed = new EmbedBuilder()
					.setTitle('Overall Balance Modified Automatically:')
					.setDescription(`\`System\` added \`${formattedPrice}\` to the \`Overall Balance\` for a new total of: \`${formattedNewBalance}\`.\n\n**Reason:** ${reason}.`)
					.setColor('1EC276');
				await interaction.client.channels.cache.get(process.env.BALANCE_LOGS_CHANNEL_ID).send({ embeds: [notificationEmbed] });

				await interaction.reply({ content: `Successfully added \`${formattedPrice}\` to the \`Overall Balance\` for a new total of: \`${formattedNewBalance}\`.`, ephemeral: true });
				break;
			case 'addCarPurchaseModal':
				var salesmanName;
				if (interaction.member.nickname) {
					salesmanName = interaction.member.nickname;
				} else {
					salesmanName = interaction.member.user.username;
				}

				var now = Math.floor(new Date().getTime() / 1000.0);
				var saleDate = `<t:${now}:d>`;

				var boughtFrom = toTitleCase(strCleanup(interaction.fields.getTextInputValue('boughtFromInput')));
				var vehicleName = toTitleCase(strCleanup(interaction.fields.getTextInputValue('vehicleNameInput')));
				var vehiclePlate = strCleanup(interaction.fields.getTextInputValue('vehiclePlateInput')).toUpperCase();
				var price = Math.abs(Number(strCleanup(interaction.fields.getTextInputValue('priceInput')).replaceAll(',', '').replaceAll('$', '')));
				var notes = strCleanup(interaction.fields.getTextInputValue('notesInput'));

				await interaction.client.googleSheets.values.append({
					auth: interaction.client.auth, spreadsheetId: interaction.client.sheetId, range: "Car Purchases!A:G", valueInputOption: "RAW", resource: { values: [[`${salesmanName} (<@${interaction.user.id}>)`, saleDate, boughtFrom, vehicleName, vehiclePlate, price, notes]] }
				});

				var formattedPrice = formatter.format(price);

				if (isNaN(price)) { // validate quantity of money
					await interaction.reply({
						content: `:exclamation: \`${interaction.fields.getTextInputValue('priceInput')}\` is not a valid number, please be sure to only enter numbers.`,
						ephemeral: true
					});
					return;
				}

				if (!notes || notes.toLowerCase() === "n/a") {
					var carBoughtEmbed = [new EmbedBuilder()
						.setTitle('A car has been purchase!')
						.addFields(
							{ name: `Salesperson Name:`, value: `${salesmanName} (<@${interaction.user.id}>)` },
							{ name: `Sale Date:`, value: `${saleDate}` },
							{ name: `Car Bought From:`, value: `${boughtFrom}` },
							{ name: `Vehicle Name:`, value: `${vehicleName}` },
							{ name: `Vehicle Plate:`, value: `${vehiclePlate}` },
							{ name: `Purchase Price:`, value: `${formattedPrice}` },
						)
						.setColor('95D5B2')];
				} else {
					var carBoughtEmbed = [new EmbedBuilder()
						.setTitle('A car has been purchase!')
						.addFields(
							{ name: `Salesperson Name:`, value: `${salesmanName} (<@${interaction.user.id}>)` },
							{ name: `Sale Date:`, value: `${saleDate}` },
							{ name: `Car Bought From:`, value: `${boughtFrom}` },
							{ name: `Vehicle Name:`, value: `${vehicleName}` },
							{ name: `Vehicle Plate:`, value: `${vehiclePlate}` },
							{ name: `Purchase Price:`, value: `${formattedPrice}` },
							{ name: `Notes:`, value: `${notes}` }
						)
						.setColor('95D5B2')];
				}

				await interaction.client.channels.cache.get(process.env.PURCHASES_CHANNEL_ID).send({ embeds: carBoughtEmbed });

				await dbCmds.subtractSummValue("overallBalance", price);

				await editEmbed.editEmbed(interaction.client);

				var newOverallBalance = await dbCmds.readSummValue("overallBalance");
				var formattedNewBalance = formatter.format(newOverallBalance);
				var reason = `Car Purchase from \`${boughtFrom}\` for \`${formattedPrice}\` on ${saleDate}`

				// color palette: https://coolors.co/palette/706677-7bc950-fffbfe-13262b-1ca3c4-b80600-1ec276-ffa630
				var notificationEmbed = new EmbedBuilder()
					.setTitle('Overall Balance Modified Automatically:')
					.setDescription(`\`System\` removed \`${formattedPrice}\` from the \`Overall Balance\` for a new total of: \`${formattedNewBalance}\`.\n\n**Reason:** ${reason}.`)
					.setColor('1EC276');
				await interaction.client.channels.cache.get(process.env.BALANCE_LOGS_CHANNEL_ID).send({ embeds: [notificationEmbed] });

				await interaction.reply({ content: `Successfully removed \`${formattedPrice}\` from the \`Overall Balance\` for a new total of: \`${formattedNewBalance}\`.`, ephemeral: true });
				break;
				var salesmanName;
				if (interaction.member.nickname) {
					salesmanName = interaction.member.nickname;
				} else {
					salesmanName = interaction.member.user.username;
				}

				var now = Math.floor(new Date().getTime() / 1000.0);
				var saleDate = `<t:${now}:d>`;

				var soldTo = toTitleCase(strCleanup(interaction.fields.getTextInputValue('soldToInput')));
				var vehicleName = toTitleCase(strCleanup(interaction.fields.getTextInputValue('vehicleNameInput')));
				var vehiclePlate = strCleanup(interaction.fields.getTextInputValue('vehiclePlateInput')).toUpperCase();
				var price = Math.abs(Number(strCleanup(interaction.fields.getTextInputValue('priceInput')).replaceAll(',', '').replaceAll('$', '')));
				var formattedPrice = formatter.format(price);
				var notes = strCleanup(interaction.fields.getTextInputValue('notesInput'));

				if (isNaN(price)) { // validate quantity of money
					await interaction.reply({
						content: `:exclamation: \`${interaction.fields.getTextInputValue('priceInput')}\` is not a valid number, please be sure to only enter numbers.`,
						ephemeral: true
					});
					return;
				}

				var costPrice = (price * 0.80);
				var laProfit = price - costPrice;

				var formattedCostPrice = formatter.format(costPrice);
				var formattedLaProfit = formatter.format(laProfit);

				if (!notes || notes.toLowerCase() === "n/a") {
					var carSoldEmbed = [new EmbedBuilder()
						.setTitle('A new car has been sold to an employee!')
						.addFields(
							{ name: `Salesperson Name:`, value: `${salesmanName} (<@${interaction.user.id}>)` },
							{ name: `Sale Date:`, value: `${saleDate}` },
							{ name: `Car Sold To:`, value: `${soldTo}` },
							{ name: `Vehicle Name:`, value: `${vehicleName}` },
							{ name: `Vehicle Plate:`, value: `${vehiclePlate}` },
							{ name: `Final Sale Price:`, value: `${formattedPrice}` },
						)
						.setColor('0096C7')];
				} else {
					var carSoldEmbed = [new EmbedBuilder()
						.setTitle('A new car has been sold to an employee!')
						.addFields(
							{ name: `Salesperson Name:`, value: `${salesmanName} (<@${interaction.user.id}>)` },
							{ name: `Sale Date:`, value: `${saleDate}` },
							{ name: `Car Sold To:`, value: `${soldTo}` },
							{ name: `Vehicle Name:`, value: `${vehicleName}` },
							{ name: `Vehicle Plate:`, value: `${vehiclePlate}` },
							{ name: `Final Sale Price:`, value: `${formattedPrice}` },
							{ name: `Notes:`, value: `${notes}` }
						)
						.setColor('0096C7')];
				}

				var personnelStats = await dbCmds.readPersStats(interaction.member.user.id);
				if (personnelStats == null || personnelStats.charName == null) {
					await personnelCmds.initPersonnel(interaction.client, interaction.member.user.id);
				}

				await interaction.client.channels.cache.get(process.env.CAR_SALES_CHANNEL_ID).send({ embeds: carSoldEmbed });

				await dbCmds.addOneSumm("countCarsSold");
				await dbCmds.addOneSumm("countWeeklyCarsSold");
				await dbCmds.addOnePersStat(interaction.member.user.id, "carsSold");
				var commissionArray = await dbCmds.readCommission(interaction.member.user.id);
				var weeklyCarsSold = await dbCmds.readSummValue("countWeeklyCarsSold");

				if (weeklyCarsSold < 100) {
					var overallCommission = commissionArray.commission25Percent;
					var commissionPercent = "25%";
				} else {
					var overallCommission = commissionArray.commission30Percent;
					var commissionPercent = "30%";
				}

				var formattedOverallCommission = formatter.format(overallCommission);

				await editEmbed.editEmbed(interaction.client);
				await personnelCmds.sendOrUpdateEmbed(interaction.client, interaction.member.user.id);

				var newCarsSoldTotal = await dbCmds.readSummValue("countCarsSold");

				await interaction.reply({ content: `Successfully added \`1\` to the \`Cars Sold\` counter - the new total is \`${newCarsSoldTotal}\`.\n\n\Details about this sale:\n> Sale Price: \`${formattedPrice}\`\n> Cost Price: \`${formattedCostPrice}\`\n> Luxury Autos Profit: \`${formattedLaProfit}\`\n> Your Commission: \`n/a\`\n\nYour weekly commission is now (\`${commissionPercent}\`): \`${formattedOverallCommission}\`.`, ephemeral: true });
				break;
			default:
				await interaction.reply({
					content: `I'm not familiar with this modal type. Please tag @CHCMATT to fix this issue.`,
					ephemeral: true
				});
				console.log(`Error: Unrecognized modal ID: ${interaction.customId}`);
		}
	} catch (error) {
		console.log(`Error in modal popup!`);
		console.error(error);
	}
};


