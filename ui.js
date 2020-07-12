class UIManager{
  constructor(){
    this.gatherCooldown = 3000;
    this.gatherFlag = false;
    this.gatherBtnWidth = 0;
  }
  
  //buttons for inventory
  createCraftButtons(unlock, objectManager) {
    let craftingDiv = document.getElementById("crafting");
    let p = document.createElement('p');
    p.innerText = unlock;
    craftingDiv.append(p);
    
    Object.keys(Craftables).forEach((el) => {
      if (Craftables[el].unlock == unlock){
        let craftContainer = document.createElement('div');
        let toolTip = document.createElement('div');
        let cost = Object.keys(Craftables[el].cost());
        cost.forEach((x) => {
          let val = document.createElement('div');
          val.innerText = `${x} ${Craftables[el].cost()[x]}`
          toolTip.append(val);
        });
        
        let b = document.createElement("button");
        b.addEventListener("click", objectManager.boundBuildCraft(el, this));
        b.innerText = el;
        
        toolTip.classList.add('tooltip');
        b.classList.add('craftButton');
        craftContainer.append(b);
        craftContainer.append(toolTip);
        craftingDiv.appendChild(craftContainer);
      }
    });
  } 
  
  //gather timer is 3 sec (3000 ms)
  //increase width by 100/3000 floor
  gatherUIProgress() {
    if (!this.gatherFlag){
      this.gatherFlag = true;
      let elem = document.getElementById("gatherBar");
      this.gatherBtnWidth = 1;
      let id = setInterval(frame.bind(this), 10);
      
      function frame() {
        if (this.gatherBtnWidth > 100) {
          clearInterval(id);
          elem.style.width = '160px';
          this.gatherFlag = false;
          this.gatherBtnWidth = 0;
        } else {
          this.gatherBtnWidth += 100/300;
          elem.style.width = Math.floor(this.gatherBtnWidth) + "%";
        }
      }
    }
  }

  //make it so that each button has an id so that it's easily searchable by the DOM
  //pass in each item in inventory as array of two [key, amount]
  //buttons for Garden UI
  updateGardenUI(objectManager){
    for (const [key, amount] of Object.entries(objectManager.garden)){
      let newKey = key.split(" ").join("");
      if (document.getElementById(newKey)){
        this.updateGardenButton([key, amount]);
      } else {
        this.createGardenButton(objectManager, [key, amount]);
      }
    }
  }
  
  createPlowButton(objectManager){
    let gardenDiv = document.getElementById("gardenContainer");
    let plowButton = document.createElement("button");
    plowButton.addEventListener("click", objectManager.boundPlow(this));
    plowButton.innerText = "plow";
    gardenDiv.appendChild(plowButton);
  }
  
  updateGardenSize(objectManager){
    document.getElementById('gardenSize').innerText =
    ` ${objectManager.gardenSize}/${objectManager.maxGardenSize}`;
  }
  
  updateGardenButton(item){
    let newKey = item[0].split(" ").join("");
    let btn = document.getElementById(newKey);
    btn.innerText = `${item[0]}: ${item[1]}`;
  }
  
  createGardenButton(objectManager, item){
    let newKey = item[0].split(" ").join("");
    
    let plantContainer = document.createElement('div'); 
    plantContainer.classList.add('dropdown');
    let actionContainer = document.createElement('div');
    actionContainer.classList.add('dropdown-content')
    
    let plantBtn = document.createElement('button'); 
    plantBtn.innerText = `${item[0]}: ${item[1]}`;
    plantBtn.setAttribute("id", `${newKey}`);
    plantBtn.classList.add('dropbtn')
    
    let harvestBtn = document.createElement('button');
    let enchantBtn ;
    harvestBtn.innerText = 'harvest';
    harvestBtn.onclick = objectManager.boundHarvest(item[0], this);
    
    //check to see if enchantable is true
    if (Plants[item[0]].enchantable == true){
      let enchantContainer = document.createElement('div'); 
      enchantContainer.classList.add('dropdown2');
      let potionContainer = document.createElement('div');
      potionContainer.classList.add('dropdown-content2')
      
      enchantBtn = document.createElement('button');
      let potionButtons = this.createEnchantUI(objectManager, item);
      enchantBtn.innerText = 'enchant';
      enchantContainer.append(enchantBtn);
      
      potionContainer.append(potionButtons);
      enchantContainer.append(potionContainer);
      actionContainer.appendChild(enchantContainer);
    }
    
    actionContainer.appendChild(harvestBtn);
    plantContainer.appendChild(plantBtn);
    plantContainer.appendChild(actionContainer);
    
    document.getElementById('garden').appendChild(plantContainer);
  }
  
  createEnchantUI(objectManager, item){
    let potionContainer = document.createElement('div')
    for (let i = 0; i < Object.keys(Potions).length; ++i){
      let potion = Object.keys(Potions)[i];
      let btn = document.createElement('button');
      btn.innerText = potion;
      btn.onclick = objectManager.boundEnchantPlant(potion, item[0], this);
      potionContainer.appendChild(btn);
    }
    return potionContainer;
  }
  
  //max of 10 text nodes in the list
  createMessage(text){
    let dm = document.getElementById('messages');
    let textNode = document.createElement('div');
    textNode.innerText = text;
    if(dm.childElementCount == 0){
      dm.appendChild(textNode);
    } else if (dm.childElementCount <= 10){
      dm.insertBefore(textNode, dm.children.item(0))
      if (dm.childElementCount == 10){
        dm.removeChild(dm.children.item(9))
      }
    }
  }
  
  initializeUI(objectManager, worldManager){
    //display buttons should show/hide different parts of main
    let displayButtons = document.getElementById('displayButtons')
    for (let i=0; i < displayButtons.children.length; i++){
      let button = displayButtons.children.item(i);
      button.onclick = function(){
        let allContainers = ['inside', 'outside', 'beyond'];
        allContainers.forEach(el => {
                              if (el != button.dataset.val){
                                document.getElementById(el).classList.add('hidden');
                                }
                              });
        document.getElementById(button.dataset.val).classList.remove('hidden');
      }
    }
    
    //starter buttons for garden system
    let gardenDiv = document.getElementById("gardenContainer");

    let gatherButton = document.getElementById("gather");
    gatherButton.addEventListener("click", objectManager.boundGather(this));
    gatherButton.addEventListener("click", this.gatherUIProgress);
    
    let plantButton = document.getElementById("plant");
    plantButton.addEventListener("click", objectManager.boundPlant(this));
    
    for (let i = 0; i < Object.keys(Potions).length; ++i){
      let button = document.createElement('button');
      button.innerText = Object.keys(Potions)[i];
      button.addEventListener("click", objectManager.boundCreatePotion(Object.keys(Potions)[i], this));
      gardenDiv.appendChild(button);
    }
   
    //map buttons should do things
    let map = document.getElementById('map');
    let materials = ['wood', 'glass', 'silver', 'crystal']
    for (let i=0; i < map.children.length; i++){
      let button = map.children.item(i);
      button.onclick = worldManager.boundExplore(this, materials[i])
    }
  }
}