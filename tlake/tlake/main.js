var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

// MAIN EVENT LOOP
module.exports.loop = function () {
  var s0 = Game.spawns["Spawn0"];
  s0.memory.sources = s0.room.find(FIND_SOURCES);
  s0.memory.sourceIds = [];
  _.each(s0.memory.sources, function(source) {
    if (!s0.memory.sourceIds[source.id]) {
      s0.memory.sourceIds.push(source.id)
    }
  });

  // Clean up memory
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Cleared non-existing creep memory:', name)
    }
  };

  // Make a new creep if there are none
  _.each(Game.spawns, function(spawn) {
    if (Object.keys(Game.creeps).length < 1) {
      spawn.createCreep(
        [WORK, CARRY, MOVE],
        '',
        {
          'role': 'upgrader',
          'spawn': spawn._name
        }
      )
    }
  });

  function assignCreepToSource(creep) {
    var leastPopulatedSource = s0.memory.sourceIds.reduce(function(a, b, i, arr) {
      var retval = a;
      a.length <= b.length
        ? retval = a
        : retval = b
      return retval
    });

    creep.memory["assignedSource"] = leastPopulatedSource;
    // spawnSourcesList[leastPopulatedSource].push(creep)
  };

  // Make creeps do shit
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    assignCreepToSource(creep);
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep)
    };

    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep)
    };

    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep)
    }
  }
};
