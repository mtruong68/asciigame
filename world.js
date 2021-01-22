//this controls boss fights and stuff

class WorldManager{
  constructor(){
    this.beyondLocked = true;
    this.boundExplore = (uiManager, key) => this.explore.bind(this, uiManager, key);
    this.bosses = {
      wood: false, glass: false, silver: false, crystal: false,
    }
  }

  unlock(uiManager){

  }

  explore(uiManager, key){
    if (!this.bosses[key]){
      this.bosses[key] = true;
      Gatherables[key].discovered = true;
      uiManager.createMessage(`the ${key} boss is defeated now`);
    }
  }
}
