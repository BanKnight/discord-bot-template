import { Events, EmbedBuilder, ChatInputCommandInteraction, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js"

export default {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction) {

        if (interaction.isModalSubmit()) return await on_modal(interaction);
        if (interaction.isButton()) return await on_button(interaction)
        if (interaction.isChatInputCommand()) return await on_command(interaction);
    },
};

async function on_button(interaction: ModalSubmitInteraction) {

    if (interaction.message.author.id != interaction.client.user.id) {
        return
    }

    const customid = interaction.customId
    const command = JSON.parse(customid)

    if (command == null) {
        return
    }

    await execute_command(interaction, command.name, command)
}

async function on_modal(interaction: MessageComponentInteraction) {

    if (interaction.message.author.id != interaction.client.user.id) {
        return
    }

    const customid = interaction.customId
    const command = JSON.parse(customid)

    if (command == null) {
        return
    }

    await execute_command(interaction, command.name, command)
}

async function on_command(interaction: ChatInputCommandInteraction) {

    await execute_command(interaction, interaction.commandName)
}

async function execute_command(interaction: ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction
    , name: string, options?: any) {

    const client = interaction.client
    const command = client.commands.get(name) as any;

    if (!command) {
        console.error(`No command matching ${name} was found.`);
        return;
    }

    if (!command.no_defer) {
        await interaction.deferReply({ ephemeral: interaction.inGuild() });
    }

    try {
        await command.execute(interaction, options);
        if (interaction.replied == false && interaction.deferred) {
            await interaction.deleteReply()
        }
    }
    catch (error) {
        console.error(`Error executing ${name}`);
        console.error(error);

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Error executing ${name}`)
            .setDescription(error.toString())

        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ embeds: [embed] });
        }
        else {
            await interaction.reply({ embeds: [embed] });
        }
    }
}