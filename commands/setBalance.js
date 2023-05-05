var { PermissionsBitField } = require('discord.js');

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
	],
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};