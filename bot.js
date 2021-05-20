const Discord = require("discord.js");
const { findUser } = require("./utils");
const webscrape = require("./webscrape");
require("dotenv").config();
const client = new Discord.Client({
    partials: ["USER"],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
    const adminChannel = client.channels.cache.get(`${process.env.ADMIN_CHANNEL}`);
    if (msg.content === "!verify") {
        const firstFind = await findUser(msg.member.user.tag);
        if (firstFind.status === "AUTHORIZED") {
            msg.member.roles.add(`${process.env.HACKER_ROLE}`);
            adminChannel.send(`I verified a user!
            \n - tag: \`${firstFind.tag} \`
            \n - name: \`${firstFind.firstName} ${firstFind.lastName}\`
            \n - devpost email: \`${firstFind.devpostEmail}\`
            \n - school email: \`${firstFind.schoolEmail}\`
            `);
            msg.channel.send(
                `Welcome to the Hackathon <@${msg.member.user.id}>! You are now verified!`
            );
        } else if (firstFind.status === "UNKNOWN") {
            adminChannel.send(`I found a user who has an email I am uncertain of
            \n - tag: \`${firstFind.tag} \`
            \n - name: \`${firstFind.firstName} ${firstFind.lastName}\`
            \n - devpost email: \`${firstFind.devpostEmail}\`
            \n - school email: \`${firstFind.schoolEmail}\`
            `);

            msg.channel.send(`Hi there <@${member.user.id}>! I found your discord tag but need further verification on your devpost registration; our organizers will take it from here.`);
        } else {
            await webscrape();
            const finalFind = await findUser(msg.member.user.tag);
            if (finalFind.status === "AUTHORIZED") {
                msg.member.roles.add(`${process.env.HACKER_ROLE}`);
                adminChannel.send(`I verified a user!
                \n - tag: \`${finalFind.tag} \`
                \n - name: \`${finalFind.firstName} ${finalFind.lastName}\`
                \n - devpost email: \`${finalFind.devpostEmail}\`
                \n - school email: \`${finalFind.schoolEmail}\`
                `);
                msg.channel.send(
                    `Welcome to the Hackathon <@${msg.member.user.id}>! You are now verified!`
                );
            } else if (finalFind.status === "UNKNOWN") {
                adminChannel.send(`I found a user who has an email I am uncertain of
                \n - tag: \`${firstFind.tag} \`
                \n - name: \`${firstFind.firstName} ${firstFind.lastName}\`
                \n - devpost email: \`${firstFind.devpostEmail}\`
                \n - school email: \`${firstFind.schoolEmail}\`
                `);

                msg.channel.send(`Hi there <@${member.user.id}>! I found your discord tag but need further verification on your devpost registration; our organizers will take it from here.`);
            } else {
                msg.channel.send(
                    `Hi there <@${msg.member.user.id}> I can't seem to find you on our devpost (https://recesshacks.devpost.com). Make sure you property put your discord tag using the \`name#1234\` format when you sign up on our devpost and then try again. I am not perfect, if you have any issues with me please PM my creator: <@${process.env.CREATOR_ID}>`
                );
            }
        }
    }
});

client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.get(
        `${process.env.WELCOME_CHANNEL}`
    );

    const adminChannel = member.guild.channels.cache.get(`${process.env.ADMIN_CHANNEL}`);
    const foundUser = await findUser(member.user.tag);
    if (foundUser.status === "AUTHORIZED") {
        member.roles.add(`${process.env.HACKER_ROLE}`);
        adminChannel.send(`I verified a user!
        \n - tag: \`${foundUser.tag} \`
        \n - name: \`${foundUser.firstName} ${foundUser.lastName}\`
        \n - devpost email: \`${foundUser.devpostEmail}\`
        \n - school email: \`${foundUser.schoolEmail}\`
        `);

        channel.send(
            `Welcome to the Hackathon <@${member.user.id}>! You are automatically verified!`
        );
    } else if (foundUser.status === "UNKNOWN") {
        adminChannel.send(`I found a user who has an email I am uncertain of
        \n - tag: \`${foundUser.tag} \`
        \n - name: \`${foundUser.firstName} ${foundUser.lastName}\`
        \n - devpost email: \`${foundUser.devpostEmail}\`
        \n - school email: \`${foundUser.schoolEmail}\`
        `);
        channel.send(`Welcome <@${member.user.id}>! I found your discord tag but need further verification on your devpost registration; our organizers will take it from here.`);
    } else {
        channel.send(`Welcome <@${member.user.id}>! I can't seem to find you on our devpost (https://recesshacks.devpost.com). Please make sure to sign up and put your discord tag using the \`name#1234\` format then run the command \`!verify\``);
    }
});

client.login(process.env.BOT_TOKEN);
