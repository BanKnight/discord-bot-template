import { resolve, join, dirname } from "path"
import { readdirSync } from "fs"
import { fileURLToPath, pathToFileURL } from "url"
import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from "discord.js"

import config from "./config.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

{   //commands
    const commandsPath = resolve(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = {
        application: [],
        guild: [],
    }

    for (const file of commandFiles) {
        const filePath = pathToFileURL(join(commandsPath, file)).toString();
        const { default: command } = await import(filePath)
        const scope = command.scope as string

        client.commands.set(command.data.name, command);

        if (scope) {
            commands[scope].push(command.data.toJSON())
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(config.TOKEN);

    // and deploy your commands!

    try {
        let data: any = await rest.put(Routes.applicationCommands(config.APPLICATION), { body: commands.application })

        console.log(`Successfully reloaded applicationCommands:${data.length}.`);

        if (commands.guild.length > 0) {
            for (const serverid of config.SERVERS) {
                data = await rest.put(Routes.applicationGuildCommands(config.APPLICATION, serverid), { body: [...commands.guild] })

                console.log(`Successfully reloaded guild[${serverid}] commands:${data.length}`);
            }
        }
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}

{   //events
    const eventsPath = resolve(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = pathToFileURL(join(eventsPath, file)).toString();
        const { default: event } = await import(filePath)

        if (event.once) {
            client.once(event.name, (...args: any[]) => event.execute(...args));
        }
        else {
            client.on(event.name, (...args: any[]) => event.execute(...args));
        }
    }
}

client.login(config.TOKEN);