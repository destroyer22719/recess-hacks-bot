const fs = require("fs");
const csv = require("csvtojson");
const path = require("path");

const allowedEmails = /(student.tdsb.on.ca)/g;
const convertToJson = () => {
    return new Promise((resolve, reject) => {
        const file = fs.readdirSync(path.join(__dirname, "data", "csv"));
        if (file.length === 0) return resolve()
        csv()
            .fromFile(`data/csv/${file[0]}`)
            .then((data) => {
                fs.writeFile(
                    path.join(__dirname, "data", "json", "participants.json"),
                    JSON.stringify(data),
                    "utf8",
                    (error) => {
                        if (error) reject(error);
                        else resolve();
                    }
                );
            });
    });
};

const findUser = async (discordTag) => {
    await convertToJson();
    const participants = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "data", "json", "participants.json"),
            "utf-8"
        )
    );

    const discordTags = participants.map((participant) => participant["What is your Discord name and tag? (DiscordUser#0001)"]);
    const i = discordTags.indexOf(discordTag);

    if (
        i !== -1 &&
        (participants[i].Email.split("@")[1].match(allowedEmails) ||
            participants[i]["What is your school-provided email address"]
                .split("@")[1]
                .match(allowedEmails))
    )
        return { 
            status: "AUTHORIZED",
            tag: discordTag,
            devpostEmail: participants[i].Email,
            schoolEmail: participants[i]["What is your school-provided email address"],
            firstName: participants[i]["First Name"],
            lastName: participants[i]["Last Name"]
        };
    else if (i !== -1) {
        return {
            status: "UNKNOWN",
            tag: discordTag,
            devpostEmail: participants[i].Email,
            schoolEmail: participants[i]["What is your school-provided email address"],
            firstName: participants[i]["First Name"],
            lastName: participants[i]["Last Name"]
        };
    }
    else return { status: "NOT FOUND" };
};

findUser("test#1234");

exports.findUser = findUser;
exports.convertToJson = convertToJson;
