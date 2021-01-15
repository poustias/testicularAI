//email: hohih25404@ummoh.com
//pass: uroisbot


const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const TOKEN = 'Nzc5Mzc4Njk4MDQ2NDA2NzQ3.X7frcg.7BCiy2LjrYZaf5nCiGx4pzpkatg';
const raw = fs.readFileSync('uro_full.json');
const chanceToAdd = 0.0; //Determines the chance for the bot to add a message to the JSON file (.5 = 50% chance)
const chanceToRespond = 0.035; //Determines the chance for the bot to respond to a message (.2 = 20% chance)
const pingChance = 0.3; //Determines the chance for the bot to ping the user it is replying to (.3 = 30% chance)
const replyFactor = 21000; //Determines what the random generated number for typing speed is multiplied by in MS
const slowmode = ['779430479580364840','779430479580364840','751517047279714304'] //if a channel id is in this array in quotes, the bot will type with slower mode
const slowprob = 0.2
const learnChannelBL = ['615599305641951234']; //If a channel ID is in this array in quotes, the bot won't learn messages from that channel
const sendChannelBL = ['615599305641951234','768617645993361421']; //If a channel ID is in this array in quotes, the bot won't send any messages to that channel
const wordsToFilter = []; //If a message contains a word/phrase from the filter array, it wont be added to the JSON file
let patterns = JSON.parse(raw);
let queue = 0; //the queue is used to avoid message spam


//Calculates the chance of adding a speech pattern to the JSON file (default is a 50/50 chance)
const addChance = () => {
    return Math.random() < chanceToAdd;
};
function shuffle() {
  patterns.speechPatterns.sort(() => Math.random() - 0.5);
  index_seizure = patterns.speechPatterns.findIndex(element => element.includes('Joined the server.'));
  t = patterns.speechPatterns[0];
  patterns.speechPatterns[0] = patterns.speechPatterns[index_seizure];
  patterns.speechPatterns[index_seizure] = t;
};
//Calculates the chance of responding to a user (default is a 20% chance)
const respondChance = (x) => {
    return Math.random() < x;
};

//Calculates how long the bot will be typing for
const getReplyTime = () => {
    let time = Math.floor(Math.random() * replyFactor);
    if (time < 3500) {
        return time * 7;
    } else {
        return time;
    }

};

//Sends a random message from the speech patterns JSON file and clears a spot in the message queue
const sendRand = (message) => {
    message.channel.send(patterns.speechPatterns[Math.floor(Math.random() *
        patterns.speechPatterns.length)]).catch(() => {});
    queue--;
    message.channel.stopTyping();
};


//Checks against filters and automatically filters spam
const filterMessages = (message) => {
    if (message.content.includes('http') || message.content.includes(
            '\n') || message.content.includes('discord.gg') || learnChannelBL.includes(message.channel.id )) return '';
    speech = message.content.replace(/[!<@>\d]/g,
    ''); //Removes all mentions of a user before adding the speech pattern to the JSON file
    speech = speech.replace(/:\w*:/g, ''); //removes any emotes
    for (let i = 0; i < wordsToFilter.length; i++) {
        if (speech.toLowerCase().includes(wordsToFilter[i])) return ''; //c: popsicle
    };
    return speech;
};

//Checks if a message is being added to the JSON file
const writeMessages = (speech) => {
    if (addChance()) {
        if (speech.length === 0) return; //c: popsicle
        for (let i = 0; i < patterns.speechPatterns.length; i++) {
            if (patterns.speechPatterns[i] == speech) return;
        };
        patterns.speechPatterns.push(speech);
        fs.writeFile('patterns.json', JSON.stringify(patterns), () => {});
    }
};

//Determines if and how the bot will reply to a message
const replyMessages = (message, speech) => {
    if (sendChannelBL.includes(message.channel.id)) return;
    let name = client.user.username.toLowerCase();
    if (slowmode.includes(message.channel.id)) 
        {x = slowprob;}else {
            x = chanceToRespond;
        }
    if (respondChance(x) && !message.content.toLowerCase().includes(name) &&
        !message.content.includes(client.user.id)) {
        //this for loop is used for finding common speech patterns from a user message (will make the bot seem human)
        common = commonFound(message);
        if (common != null) {
            message.channel.stopTyping();
            setTimeout(() => {
                message.channel.startTyping()
            }, Math.random() * 7000);
            queue++;
            setTimeout(() => {
                message.channel.send(common).catch(() => {});
                queue--
                message.channel.stopTyping();
            }, getReplyTime());
            return;
        } else {
            if (Math.random() <
                pingChance) { //The bot has a 50% chance of pinging the user of whose message it is responding to
                message.channel.stopTyping();
                setTimeout(() => {
                    message.channel.startTyping()
                }, Math.random() * 7000);
                queue++;
                setTimeout(() => {
                    message.channel.send(
                        `<@${message.author.id}> ${patterns.speechPatterns[Math.floor(Math.random() * patterns.speechPatterns.length)]}`
                        ).catch(() => {});
                    queue--;
                    message.channel.stopTyping();
                }, getReplyTime());
            } else {
                setTimeout(() => {
                    message.channel.startTyping()
                }, Math.random() * 7000);
                queue++;
                setTimeout(() => {
                    sendRand(message)
                }, getReplyTime());
            }
        }
    }
};

const commonFound = (message) => {
    message.content = message.content.replace(/[!<@>\d]/g, ''); //Removes all mentions of a user
    message.content = message.content.replace(/:\w*:/g, ''); //removes any emotes
    let commonSpeech = null;
    for (let i = 0; i < patterns.speechPatterns.length; i++) {
        if (patterns.speechPatterns[i].includes(message.content) && patterns
            .speechPatterns[i] != message.content) {
            commonSpeech = patterns.speechPatterns[i];
            return commonSpeech;
        }
    };
};

const nameHeard = (message) => {
    if (sendChannelBL.includes(message.channel.id)) return;
    let name = client.user.username.toLowerCase();
    if (message.content.toLowerCase().includes(name) || message.content
        .includes(client.user.id)) { //If a stored speech pattern has similarities with the parsed message, send that speech pattern to make the bot seem more human
        common = commonFound(message);
        message.content = message.content.replace(/[!<@>\d]/g, ''); //Removes all mentions of a user
        message.content = message.content.replace(/:\w*:/g, ''); //removes any emotes
        if (common != null) {
            message.channel.stopTyping();
            setTimeout(() => {
                message.channel.startTyping()
            }, Math.random() * 7000);
            queue++;
            setTimeout(() => {
                message.channel.send(common).catch(() => {});
                queue--;
                message.channel.stopTyping();
            }, getReplyTime());
            return;
        } else {
            message.channel.stopTyping();
            setTimeout(() => {
                message.channel.startTyping()
            }, Math.random() * 7000);
            queue++;
            setTimeout(() => {
                sendRand(message)
            }, getReplyTime());
        }
    }
};

//To check if the bot is online
client.on('ready', () => {
    console.log(`AI Launch: ${client.user.tag}`);
});

//Checking for messages and assigning them the message variable
client.on('message', message => {
    if (queue > 2) return;
    if (message.channel.type == "dm" || message.author.tag == client
        .user.tag || message.author.bot == true || message.content
        .length > 1200) {
        return;
    }
    speechPattern = filterMessages(message);
    shuffle();
    writeMessages(speechPattern);
    replyMessages(message, speechPattern)
    nameHeard(message);

});

client.login(TOKEN);