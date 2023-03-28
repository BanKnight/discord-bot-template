import { Events, Message, ChannelType } from "discord.js"

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {

        if (message.author.bot) {
            return
        }

        if (message.author.id == message.client.user.id) {
            return
        }

        if (message.channel.type == ChannelType.DM) {
            return await on_dm(message)
        }
    },
};

async function on_dm(message: Message) {
    console.log("get dm message", message.content)
}