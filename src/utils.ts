import { EmbedBuilder } from "discord.js"

export function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

export async function beautiful_wait(message, until_cond) {
    let start = Date.now()
    let timer = setInterval(() => {
        if (until_cond()) {
            clearInterval(timer)
        }
        else {

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setFooter({ text: `Thinking ... ${(Date.now() - start) / 1000} s` });

            message.edit({ embeds: [embed] });
        }
    }, 1000)

    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setFooter({ text: `Thinking ...` });

    await message.edit({ embeds: [embed] });
}