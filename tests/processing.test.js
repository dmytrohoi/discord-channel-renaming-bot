// Import settings
const {
    channelNamePrefix, gameShortcuts, channelNameSuffix, defaultChannelName
} = require('../settings');

// Mock
class Channel {
    constructor(id, name, members) {
        this.id = id;
        this.name = name;
        this.members = {array() {return members}};
    }

    setName(name) {
        const _this = this;
        const promise = new Promise(
            function(resolve, _) {
                _this.name = name;
                resolve(_this);
            }
        );
        return promise
    }
}

class Member {
    constructor() {
        this.presence = {activities: []};
    }

    add(activity) {
        this.presence.activities.push({name: activity})
        return this
    }
}


// Tests
const tap = require('tap');

const {setNewChannelName, getNewChannelName} = require('../src/processing');


tap.test("Test setNewChannelName() method", async (test) => {
    const testCases = [
        {oldName: "", newName: "test"},
        {oldName: "test", newName: "new"},
        {oldName: "test", newName: "test"},
    ];

    for (const {oldName, newName} of testCases) {
        const channel = new Channel("1", oldName, []);
        test.equivalent(channel.name, oldName, `Old channel name: "${oldName}"`);
        setNewChannelName(channel, newName);
        test.equivalent(channel.name, newName, `New channel name: "${newName}"`);
    };
});


tap.test("Test getNewChannelName() method", async (test) => {
    const gameExample = "Counter-Strike: Global Offensive";

    // Shortcuts
    const newEmptyUser = () => new Member();
    const newGamer = () => newEmptyUser().add(gameExample);
    const newNotGamer = () => newEmptyUser().add("Not a Game");
    const createExpectedName = (game, count, all) => `${channelNamePrefix}${gameShortcuts[game]}${channelNameSuffix} (${count} / ${all})`;
    const createExpectedDefaultName = (channelID=1) => `${defaultChannelName}${channelID}`;

    // Test data
    const testCases = [
        {
            members: [newGamer()],
            expectedName: createExpectedName(gameExample, 1, 1)
        },
        {
            members: [newGamer(), newNotGamer()],
            expectedName: createExpectedName(gameExample, 1, 2)
        },
        {
            members: [newGamer(), newEmptyUser()],
            expectedName: createExpectedName(gameExample, 1, 2)
        },
        {
            members: [newGamer(), newNotGamer(), newNotGamer(), newNotGamer()],
            expectedName: createExpectedName(gameExample, 1, 4)
        },
        {
            members: [newGamer(), newGamer(), newGamer(), newNotGamer()],
            expectedName: createExpectedName(gameExample, 3, 4)
        },
        {
            members: [newNotGamer(), newNotGamer()],
            expectedName: createExpectedDefaultName()
        },
        {
            members: [],
            expectedName: createExpectedDefaultName()
        },
        {
            channelID: "2",
            members: [],
            expectedName: createExpectedDefaultName(2)
        },
        {
            channelID: "3",
            members: [],
            expectedName: createExpectedDefaultName(3)
        },
        {
            members: [newEmptyUser()],
            expectedName: createExpectedDefaultName()
        },
        {
            members: [newEmptyUser().add(null)],
            expectedName: createExpectedDefaultName()
        },
    ];

    for (const {members, expectedName, channelID="1"} of testCases) {
        test.equivalent(
            getNewChannelName(new Channel(channelID, "", members)),
            expectedName,
            `New name for channel: "${expectedName}"`
        );
    }
});
