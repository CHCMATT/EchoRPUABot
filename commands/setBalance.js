var dbCmds = require('../dbCmds.js');
var editEmbed = require('../editEmbed.js');
var { PermissionsBitField, EmbedBuilder } = require('discord.js');

var formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports = {
	name: 'setbalance',
	description: 'Sets the current master balance',
	options: [
		{
			name: 'newbalance',
			description: 'The number that you\'d like to set the new to',
			type: 4,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for modifying the balance',
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			var newbalance = interaction.options.getInteger('newbalance');
			var reason = interaction.options.getString('reason');

			await dbCmds.setSummValue("overallBalance", newbalance);

			await editEmbed.editEmbed(interaction.client);

			var newOverallBalance = await dbCmds.readSummValue("overallBalance");
			var formattedNewBalance = formatter.format(newOverallBalance);

			// color palette: https://coolors.co/palette/706677-7bc950-fffbfe-13262b-1ca3c4-b80600-1ec276-ffa630
			var notificationEmbed = new EmbedBuilder()
				.setTitle('Overall Balance Modified Manually:')
				.setDescription(`<@${interaction.user.id}> set the \`Overall Balance\` value to \`${formattedNewBalance}\`.\n\n**Reason:** \`${reason}\`.`)
				.setColor('FFA630');
			await interaction.client.channels.cache.get(process.env.BALANCE_LOGS_CHANNEL_ID).send({ embeds: [notificationEmbed] });

			await interaction.reply({ content: `Successfully set the \`Overall Balance\` value to \`${formattedNewBalance}\`.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};