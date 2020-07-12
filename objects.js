//Notes: everything that a plant produces goes into inventory!
//but all plants go into garden: so flower goes into inventory
//but planted flower is a plant!

///////////////////////
// Items in Game //////
///////////////////////
var Gatherables = {
  wood: {
    discovered: false,
    auto: true,
    find: "some wood",
    message: "you can build simple tools with wood",
    gather: function() {
      return Math.floor(Math.random() * 5 + 1);
    },
  },
  flower: {
    discovered: false,
    auto: true,
    find: "some flowers",
    message: "flowers are a magical plant...",
    gather: function() {
      return Math.floor(Math.random() * Math.floor(2));
    }
  },
  seed: {
    discovered: false,
    auto: true,
    find: "some seeds",
    message: "perhaps you can plant these seeds",
    gather: function() {
      return Math.floor(Math.random() * 3 + 1);
    }
  },
  glass: {
    discovered: false,
    auto: false,
    find: "pretty glass shards",
    message: "glass can be molten into many things",
    gather: function() {
      return Math.floor(Math.random() * Math.floor(3));
    }
  },
  silver: {
    discovered: false,
    auto: false,
    find: "scraps of silver",
    message: "silver can make stronger tools",
    gather: function() {
      return Math.floor(Math.random() * Math.floor(3));
    }
  },
  crystal: {
    discovered: false,
    auto: false,
    find: "some glowing crystal shards",
    message: "crystals hold the world's magical energy",
    gather: function() {
      return Math.floor(Math.random() * Math.floor(2));
    }
  }
};

//i think basically nothing will have a callback except the plow
//but if something does have a callback, the arguments passed in on crafting for the first time
//is currently the objectManager & uiManager
var Craftables = {
  "wood axe": {
    name: "Wooden Axe",
    button: null,
    unlock: "wood",
    buildMessage: "you can cut trees with this axe",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 20
      };
    }
  },
  "wood plow": {
    name: "Wooden Plow",
    button: null,
    unlock: "wood",
    buildMessage: "you can plow more space in the garden",
    buildCallback: function(objectManager, uiManager){
      uiManager.createPlowButton(objectManager, uiManager);
    },
    cost: function() {
      return {
        wood: 50
      };
    }
  },
  "wood shield": {
    name: "Wooden Shield",
    button: null,
    buildMessage: "something to protect you in the beyond",
    buildCallback: function(){},
    cost: function(){
      return {
        wood: 300
      }
    }
  },
  "glass bottle": {
    name: "Glass Bottle",
    unlock: "glass",
    buildMessage: "perhaps you can fill this bottle with something useful",
    buildCallback: function(){},
    cost: function() {
      return {
        glass: 5
      }
    }
  },
  "glass sword": {
    name: "Glass Sword",
    button: null,
    unlock: "glass",
    buildMessage: "a sharp but fragile sword",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 150,
        glass: 50
      };
    }
  },
  "glass shield": {
    name: "Glass Shield",
    button: null,
    unlock: "glass",
    buildMessage: "a beautiful but fragile shield",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 300,
        glass: 150
      };
    }
  },
  "silver sword": {
    name: "Silver Sword",
    button: null,
    unlock: "silver",
    buildMessage: "this sword glints in the sunlight",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 150,
        silver: 50
      };
    }
  },
  "silver shield": {
    name: "Silver Shield",
    button: null,
    unlock: "silver",
    buildMessage: "this shield glints in the sunlight",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 300,
        silver: 150
      };
    }
  },
  "crystal sword": {
    name: "Crystal Sword",
    button: null,
    unlock: "crystal",
    buildMessage: "a sword powered by this world's magic",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 150,
        crystal: 50
      };
    }
  },
  "crystal shield": {
    name: "Crystal Shield",
    button: null,
    unlock: "crystal",
    buildMessage: "a shield powered by this world's magic",
    buildCallback: function(){},
    cost: function() {
      return {
        wood: 300,
        crystal: 50
      };
    }
  }
};

var Potions = {
  "simple potion": {
    spell: 'enchanted',
    tree: 'the tree seems to sprout and shed many branches that you can take',
    flower: 'the flower seems to sprout and shed many petals that you can take',
    recipe: function(){
      return {
        "glass bottle": 1,
        "flower": 20
      }
    }
  },
  "glass potion": {
    spell: 'glass',
    tree: 'the leaves on the tree turn transparent and hard... you take some now and then',
    recipe: function(){
      return {
        "glass bottle": 1,
        "flower": 20,
        "glass": 10
      }
    }
  },
  "silver potion": {
    spell: 'silver',
    tree: 'the leaves on the tree turn into silver foil... you take some now and then',
    recipe: function(){
      return {
        "glass bottle": 1,
        "flower": 20,
        "silver": 10
      }
    }
  },
  "crystal potion":{
    spell: 'crystal',
    tree: 'the leaves on the tree glow with magic... you take some now and then',
    recipe: function(){
      return {
        "glass bottle": 1,
        "flower": 20,
        "glass": 10,
        "crystal": 5
      }
    }
  }
}

var Plants = {
  "planted flower": {
    enchantable: true,
    harvest: function() {
      return {
        flower: 1
      };
    }
  },
  "planted tree": {
    enchantable: true,
    harvest: function() {
      return {
        wood: 20
      };
    }
  },
  "enchanted tree": {
    enchantable: false,
    gives: function() {
      return {
        seed: 1,
        wood: 1,
        flower: -1
      };
    },
    harvest: function() {
      return {
        wood: 20
      };
    }
  },
  "enchanted flower": {
    enchantable: false,
    gives: function() {
      return {
        flower: 1
      };
    },
    harvest: function() {
      return {
        flower: 1
      };
    }
  },
  "glass tree": {
    enchantable: false,
    gives: function() {
      return {
        glass: 1,
        flower: -5
      };
    },
    harvest: function() {
      return {
        glass: 50,
        wood: 20
      };
    }
  },
  "silver tree": {
    enchantable: false,
    gives: function() {
      return {
        silver: 1,
        flower: -5
      };
    },
    harvest: function() {
      return {
        silver: 50,
        wood: 20
      };
    }
  },
  "crystal tree": {
    enchantable: false,
    gives: function() {
      return {
        crystal: 1,
        glass: -2,
        flower: -5
      };
    },
    harvest: function() {
      return {
        crystal: 50,
        wood: 20
      };
    }
  }
};