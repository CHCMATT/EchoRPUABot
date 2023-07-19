var { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports.btnPressed = async (interaction) => {
	try {
		var buttonID = interaction.customId;
		switch (buttonID) {
			case 'addCarSale':
				var addCarSaleModal = new ModalBuilder()
					.setCustomId('addCarSaleModal')
					.setTitle('Log a car that you sold');
				var soldToInput = new TextInputBuilder()
					.setCustomId('soldToInput')
					.setLabel("Who did you sell the car to?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Bobby Brantley')
					.setRequired(true);
				var vehicleNameInput = new TextInputBuilder()
					.setCustomId('vehicleNameInput')
					.setLabel("What is the vehicle name?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Blista')
					.setRequired(true);
				var vehiclePlateInput = new TextInputBuilder()
					.setCustomId('vehiclePlateInput')
					.setLabel("What was the car's license plate?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('5J4A76J1')
					.setRequired(true);
				var priceInput = new TextInputBuilder()
					.setCustomId('priceInput')
					.setLabel("What was the final sale price?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('5500')
					.setRequired(true);
				var notesInput = new TextInputBuilder()
					.setCustomId('notesInput')
					.setLabel("Any notes to include about this sale?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Loyal customer discount')
					.setRequired(false);

				var soldToInputRow = new ActionRowBuilder().addComponents(soldToInput);
				var vehicleNameInputRow = new ActionRowBuilder().addComponents(vehicleNameInput);
				var vehiclePlateInputRow = new ActionRowBuilder().addComponents(vehiclePlateInput);
				var priceInputRow = new ActionRowBuilder().addComponents(priceInput);
				var notesInputRow = new ActionRowBuilder().addComponents(notesInput);

				addCarSaleModal.addComponents(soldToInputRow, vehicleNameInputRow, vehiclePlateInputRow, priceInputRow, notesInputRow);

				await interaction.showModal(addCarSaleModal);
				break;
			case 'addCarPurchase':
				var addCarPurchaseModal = new ModalBuilder()
					.setCustomId('addCarPurchaseModal')
					.setTitle('Log a car that you purchased');
				var boughtFromInput = new TextInputBuilder()
					.setCustomId('boughtFromInput')
					.setLabel("Who did you buy the car from?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Dimples Rivera')
					.setRequired(true);
				var vehicleNameInput = new TextInputBuilder()
					.setCustomId('vehicleNameInput')
					.setLabel("What is the vehicle name?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('F620')
					.setRequired(true);
				var vehiclePlateInput = new TextInputBuilder()
					.setCustomId('vehiclePlateInput')
					.setLabel("What is the car's license plate?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('8R3N061S4')
					.setRequired(true);
				var priceInput = new TextInputBuilder()
					.setCustomId('priceInput')
					.setLabel("How much did you pay for the car?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('45000')
					.setRequired(true);
				var notesInput = new TextInputBuilder()
					.setCustomId('notesInput')
					.setLabel("Any notes to include about this purchase?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Vehicle has 1 strike')
					.setRequired(false);

				var boughtFromInputRow = new ActionRowBuilder().addComponents(boughtFromInput);
				var vehicleNameInputRow = new ActionRowBuilder().addComponents(vehicleNameInput);
				var vehiclePlateInputRow = new ActionRowBuilder().addComponents(vehiclePlateInput);
				var priceInputRow = new ActionRowBuilder().addComponents(priceInput);
				var notesInputRow = new ActionRowBuilder().addComponents(notesInput);

				addCarPurchaseModal.addComponents(boughtFromInputRow, vehicleNameInputRow, vehiclePlateInputRow, priceInputRow, notesInputRow);

				await interaction.showModal(addCarPurchaseModal);
				break;
				var addEmployeeSaleModal = new ModalBuilder()
					.setCustomId('addEmployeeSaleModal')
					.setTitle('Log a car that you sold to a fellow employee');
				var soldToInput = new TextInputBuilder()
					.setCustomId('soldToInput')
					.setLabel("Who did you sell the car to?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Trevon Ricch')
					.setRequired(true);
				var vehicleNameInput = new TextInputBuilder()
					.setCustomId('vehicleNameInput')
					.setLabel("What is the vehicle name?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('190z')
					.setRequired(true);
				var vehiclePlateInput = new TextInputBuilder()
					.setCustomId('vehiclePlateInput')
					.setLabel("What was the car's license plate?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('G904Z23M')
					.setRequired(true);
				var priceInput = new TextInputBuilder()
					.setCustomId('priceInput')
					.setLabel("What was the final sale price?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('75000')
					.setRequired(true);
				var notesInput = new TextInputBuilder()
					.setCustomId('notesInput')
					.setLabel("Any notes to include about this sale?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('Self purchase')
					.setRequired(false);

				var soldToInputRow = new ActionRowBuilder().addComponents(soldToInput);
				var vehicleNameInputRow = new ActionRowBuilder().addComponents(vehicleNameInput);
				var vehiclePlateInputRow = new ActionRowBuilder().addComponents(vehiclePlateInput);
				var priceInputRow = new ActionRowBuilder().addComponents(priceInput);
				var notesInputRow = new ActionRowBuilder().addComponents(notesInput);

				addEmployeeSaleModal.addComponents(soldToInputRow, vehicleNameInputRow, vehiclePlateInputRow, priceInputRow, notesInputRow);

				await interaction.showModal(addEmployeeSaleModal);
				break;
			default:
				await interaction.reply({ content: `I'm not familiar with this button press. Please tag @CHCMATT to fix this issue.`, ephemeral: true });
				console.log(`Error: Unrecognized button press: ${interaction.customId}`);
		}
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

			await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
		}
	}
};