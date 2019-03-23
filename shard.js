const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./start.js');
Manager.spawn(2); // add one shard for every 2,500 servers
Manager.on('launch', shard => console.log(`[SHARD] Shard ${shard.id}/${shard.totalShards}`));