//////////////////////////
// Functions for Items //
/////////////////////////

class ObjectManager {
  constructor() {
    //bound functions
    this.boundBuildCraft = (key, uiManager) => this.buildCraft.bind(this, key, uiManager);
    this.boundCreatePotion = (key, uiManager) => this.createPotion.bind(this, key, uiManager);
    this.boundEnchantPlant = (potion, plant, uiManager) => this.enchantPlant.bind(this, potion, plant, uiManager);
    this.boundGather = (uiManager) => this.gather.bind(this, uiManager);
    this.boundPlant = uiManager => this.plant.bind(this, uiManager);
    this.boundPlow = uiManager => this.plow.bind(this, uiManager);
    this.boundHarvest = (key, uiManager) => this.harvest.bind(this, key, uiManager);
    //object containers
    this.inventory = {'simple potion': 10, 'silver potion': 1};
    this.garden = {};
    //constants
    this.outsideLocked = true;
    this.maxGardenSize = 10;
    this.gardenSize = 0;
    this.gatherFlag = true;
    this.gatherCooldown = 3000;
    this.plantTime = 3000;
    this.enchanted = 0; //0 == false
    this.enchantedGarden = null;
  }

  ///////////////////////////////////////////
  // Inventory (wood/crystal/glass/silver)//
  /////////////////////////////////////////

  buildCraft(key, uiManager) {
    let price = Craftables[key].cost();

    for (let lineItem in price) {
      if (!(lineItem in this.inventory)) {
        return;
      } else if (this.inventory[lineItem] < price[lineItem]) {
        uiManager.createMessage("need more materials");
        return;
      }
    }

    for (let lineItem in price) {
      this.inventory[lineItem] -= price[lineItem];
    }

    if (key in this.inventory) {
      this.inventory[key]++;
    } else {
      this.inventory[key] = 1;
      Craftables[key].buildCallback(this, uiManager);
    }

    uiManager.createMessage(Craftables[key].buildMessage);
    uiManager.updateInventoryUISingle([key, this.inventory[key]]);
  }

  updateInventoryText() {
    let i = document.getElementById("inventory");
    i.innerText = JSON.stringify(this.inventory);
  }
  //////////////////////////
  //  Enchant + Potions   //
  /////////////////////////
  createPotion(key, uiManager) {
    let price = Potions[key].recipe();

    for (let lineItem in price) {
      if (!(lineItem in this.inventory)) {
        uiManager.createMessage("need more materials");
        return;
      } else if (this.inventory[lineItem] < price[lineItem]) {
        uiManager.createMessage("need more materials");
        return;
      }
    }

    for (let lineItem in price) {
      this.inventory[lineItem] -= price[lineItem];
    }

    if (key in this.inventory) {
      this.inventory[key]++;
    } else {
      this.inventory[key] = 1;
      uiManager.createMessage(`created a ${key}`);
    }

    uiManager.updateInventoryUISingle([key, this.inventory[key]]);
  }

  enchantPlant(potion, plant, uiManager){
    if (potion != 'simple potion' && plant == 'planted flower'){
      uiManager.createMessage('you cannot enchant this plant');
      return;
    }

    if (this.enchantedGarden){
      //clearInterval(this.enchantedGarden);
      //console.log('cleared preexisting enchanged garden')
    }

    if (this.inventory[potion] > 0){
      if (this.garden[plant] > 0){
        --this.garden[plant];
        --this.inventory[potion];

        if (plant == "planted tree"){
          let newPlant = `${Potions[potion]['spell']} tree`;
          if (newPlant in this.garden) {++this.garden[newPlant]}
          else {this.garden[newPlant] = 1}
          uiManager.createMessage(Potions[potion]['tree']);
        } else {
          let newPlant = 'enchanted flower'
          if (newPlant in this.garden) {++this.garden[newPlant]}
          else {this.garden[newPlant] = 1}
          uiManager.createMessage(Potions[potion]['flower']);
        }

        uiManager.updateGardenUI(this);
        uiManager.updateInventoryUISingle([potion, this.inventory[potion]]);

        if (!this.enchanted){
          this.enchanted++;
          console.log('enchanted worker should work')
          this.enchantedGarden = setInterval(this.enchantedGardenWorker.bind(this, uiManager), 10000);
        }
      } else {
        uiManager.createMessage('you do not have this plant to enchant');
      }
    } else {
      uiManager.createMessage('you do not have this potion for enchantment');
    }
  }

  enchantedGardenWorker(uiManager) {
    //for each enchanted plant type in the garden
    for (const [key, amountPlant] of Object.entries(this.garden)) {
      console.log(`${key}:${amountPlant}`)
    }

    for (const [key, amountPlant] of Object.entries(this.garden)) {
      if ("gives" in Plants[key]) {
        let given = Plants[key].gives();
        let finalAmount;
        if (key == "enchanted flower") {finalAmount = 1 * amountPlant; }
        else {finalAmount = Infinity; }
        //for each thing that the plant gives
        for (let i in given) {
          if (given[i] < 0) {
            //check to see if in inventory
            if (!(i in this.inventory)) {
              finalAmount = 0;
              break;
            }
            let maxGiven = Math.floor(this.inventory[i] / (given[i] * -1));
            if (maxGiven <= 0) {
              finalAmount = 0;
              break;
            }
            finalAmount = Math.min(maxGiven, amountPlant, finalAmount);
          }
        }

        if (finalAmount > 0) {
          for (let key in given) {
            if (key in this.inventory) {
              this.inventory[key] += finalAmount * given[key];
            } else {
              this.inventory[key] = finalAmount * given[key];
            }
          }
        }
      }
    }

    uiManager.updateInventoryUI(this);
  }

  ////////////////////////////
  // Garden (flowers/trees)//
  ///////////////////////////

  gather(uiManager) {
    if (this.gatherFlag == true) {
      let message = []
      Object.keys(Gatherables).forEach((key) => {
        if (Gatherables[key].discovered){
          let num = Gatherables[key].gather();
          if (num > 0){
            if (key in this.inventory){
              this.inventory[key] += num;
            } else {
              //doesn't exist in inventory yet; has not yet been discovered
              this.inventory[key] = num;
              uiManager.createCraftButtons(key, this);
              uiManager.createMessage(Gatherables[key].message);
            }
            message.push(Gatherables[key].find)
          }
        }
      })
      message[message.length - 1] = 'and ' + message[message.length - 1];
      message = 'you find ' + message.join(', ')
      uiManager.createMessage(message);
      uiManager.updateInventoryUI(this);
      this.gatherFlag = false;
      setTimeout(() => {
        this.gatherFlag = true;
      }, this.gatherCooldown);
    }
  }

  //15 % chance of tree 85% chance of flower
  plant(uiManager) {
    if ("seed" in this.inventory) {
      if (this.inventory["seed"] > 0) {
        if (this.gardenSize < this.maxGardenSize) {
          this.inventory["seed"] -= 1;
          uiManager.updateInventoryUISingle(['seed', this.inventory['seed']]);
          let randomizer = Math.random();
          if (randomizer > 0.85) {
            this.gardenSize++;
            uiManager.updateGardenSize(this);
            setTimeout(() => {
              if ("planted tree" in this.garden){
              this.garden["planted tree"]++;
              } else {
                this.garden["planted tree"] = 1
              }
              uiManager.updateGardenUI(this);
            }, this.plantTime);
          } else {
            this.gardenSize++;
            uiManager.updateGardenSize(this);
            setTimeout(() => {
              if ("planted flower" in this.garden){
                this.garden["planted flower"]++;
              } else {
                this.garden["planted flower"] = 1
              }
              uiManager.updateGardenUI(this);
            }, this.plantTime);
          }
        } else {
          uiManager.createMessage("the garden is already full");
        }
      } else {
        uiManager.createMessage("no seeds for planting");
      }
    } else {
      uiManager.createMessage("no seeds for planting");
    }
  }

  harvest(key, uiManager) {
    if (
      key.search("tree") != -1 &&
      (!("wood axe" in this.inventory) ||
      this.inventory["wood axe"] == 0)
    ) {
      uiManager.createMessage("no axe to cut down tree");
      return;
    } else if (this.garden[key] > 0) {
      --this.garden[key];
      let harvest = Plants[key].harvest();

      for (let item in harvest) {
        if (item in this.inventory) {
          this.inventory[item] += harvest[item];
        } else {
          this.inventory[item] = harvest[item];
        }
      }

      if (key.search("tree") != -1){
        let randomizer = Math.random();
        if (randomizer > 0.80) {
          --this.inventory["wood axe"];
          uiManager.createMessage('your axe breaks');
        }
      }

      --this.gardenSize;
      uiManager.updateInventoryUI(this);
      uiManager.updateGardenButton([key, this.garden[key]]);
      uiManager.updateGardenSize(this);
    }
  }

  //15% chance of breaking plow
  plow(uiManager){
    if ((!("wood plow" in this.inventory) ||
      this.inventory["wood plow"] == 0)){
      uiManager.createMessage('need a plow to break the soil');
    } else if (this.gardenSize >= 80){
      uiManager.createMessage('there is no more space to expand your garden');
    } else {
      ++this.maxGardenSize;
      uiManager.createMessage('you can grow more now');
      uiManager.updateGardenSize(this);
      let randomizer = Math.random();
      if (randomizer > 0.80) {
        --this.inventory["wood plow"];
        uiManager.updateInventoryUISingle(['wood plow', this.inventory['wood plow']]);
        uiManager.createMessage('your plow breaks');
      }
      if (this.maxGardenSize == 80){
        uiManager.createMessage('there is no more space to plow anymore');
      }
    }
  }
}
