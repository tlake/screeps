var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

   var spawn = Game.spawns["Spawn0"];
   var roomSources = spawn.room.find(FIND_SOURCES);

   if(!spawn.memory["sources"]) {
       spawn.memory["sources"] = {}
   };

   var spawnSources = spawn.memory["sources"];

   for(var name in Memory.creeps) {
       if(!Game.creeps[name]) {
           delete Memory.creeps[name];
           console.log('Clearing non-existing creep memory:', name);
           for(var source in spawnSources) {
               if(name in source) {
                   source = _.without(source, name)
               }
           }
       }
   };

   for(var source in roomSources) {
       if(!(source in spawn.memory["sources"])) {
           spawn.memory["sources"][source] = []
       }
   };

   var assignCreepToSource = function(creep) {
       leastPopulatedSource = spawnSources.reduce(function(a, b, i, arr) {
            var retval = a;
            a.length <= b.length
                ? retval = a
                : retval = b
            return retval
       });
       creep.memory["assignedSource"] = leastPopulatedSource;
       spawnSources[leastPopulatedSource].push(creep);
   };

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
