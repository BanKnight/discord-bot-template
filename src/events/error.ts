import { Events } from "discord.js";
export default {
    name: Events.Error,
    once: true,
    execute(error) {
        console.error(error)
    },
};
