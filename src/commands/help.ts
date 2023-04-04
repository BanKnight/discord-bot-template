import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ChatInputApplicationCommandData } from 'discord.js';
import config from "../config.js"

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('show all commands'),
    scope: "application",
    async execute(interaction: CommandInteraction) {

        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor(0x00FFF0)
            .setTitle("Help")
            .setDescription(`all supported commands below`)

        for (const [name, command] of interaction.client.commands) {
            if (command.scope == null) {
                continue
            }

            if (command.scope == "guild" && !config.SERVERS.includes(interaction.guildId)) {
                continue
            }

            const data = command.data as ChatInputApplicationCommandData

            embed.addFields({ name: `/${name}`, value: data.description })
        }

        await interaction.editReply({ embeds: [embed] });
    },
};