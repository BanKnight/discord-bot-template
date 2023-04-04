import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('check if this robot is working'),
    scope: "application",
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.editReply(`${interaction.client.user.tag} is worker`);
    },
};