function initGame(){
  var uiManager = new UIManager();
  var dialogueManager = new DialogueManager();
  var worldManager = new WorldManager();
  var objectManager = new ObjectManager();
  uiManager.initializeUI(objectManager, worldManager);
  dialogueManager.displayDialogue('witch', 'title1');
}

initGame();

//maybe move these to UI manager but it'd be annoying
function closeStatement(){
  document.getElementById('overlay').style.display = "none";
  document.getElementById('artiststatement').style.display = "none";
}

function openStatement(){
  document.getElementById('overlay').style.display = "block";
  document.getElementById('artiststatement').style.display = "block";
}