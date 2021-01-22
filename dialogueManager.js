class Character{
  constructor(name, trust, random){
    this.name = name;
    this.flags = [];
    this.random = random;
    this.trust = trust;
    this.storyNext = null;
    this.currNext = null;
  }
}

class DialogueManager{
  constructor(){
    this.objectManager = null;
    this.worldManager = null;

    //keep track of curr dialogue position
    this.currDialogueReact = null;
    this.currDialogueName = null;
    //characters
    this.bird = new Character("Keke", 15, []);
    this.cat = new Character("Mimi", 0, []);
    this.dog = new Character("Bobo", 40, []);
    this.witch = new Character("Witch", 20, []);
    //random dialogue options
    this.randomTimeout = 120 * 1000;
    this.randomFlag = true;
  }


  displayDialogue(char, title, lineName){
    let dialogueReact = document.getElementById('dialogueReact');
    let dialogueName = document.getElementById('dialogueName');
    let dialogueLine = document.getElementById('dialogueLine');
    let dialogueNext = document.getElementById('dialogueNext');


    let scene = dialogue[char][title][lineName];
    //console.log(scene)
    let lineChar = scene.speaker;
    let lineReact = scene.image;
    let line = scene.line;
    let nextLine = scene.next;

    if (lineChar == ""){} else {dialogueName.innerText = this[lineChar].name};
    if (lineReact == ""){dialogueReact.style.display = "none"} else {
      dialogueReact.style.display = "block";
      dialogueReact.innerText = this.emojiParser(lineChar, lineReact);
    }
    dialogueLine.innerHTML = line;


    if (nextLine){
      dialogueNext.style.display = "block";
      dialogueNext.onclick = this.displayDialogue.bind(this, char, title, nextLine);
    } else if (scene.choices){
      //choices to be made
    } else if (scene.stop) {
      dialogueNext.style.display = "block";
      dialogueNext.onclick = () => {
        document.getElementById('overlay').style.display = "none";
        document.getElementById('dialogueContainer').style.display = "none";
        return;
      };
    } else {
      console.log('erorororor')
    }

    document.getElementById('overlay').style.display = "block";
    document.getElementById('dialogueContainer').style.display = "block";
  }

  displayAlt(char, title, index){
    let dialogueReact = document.getElementById('dialogueReact');
    let dialogueName = document.getElementById('dialogueName');
    let dialogueLine = document.getElementById('dialogueLine');
    let dialogueNext = document.getElementById('dialogueNext');

    let flagSearch = `${title}${index}`;
    let flags = dialogueFlags[char][flagSearch];
    if ('choices' in flags){
      this.displayChoices(char, title, index);
    } else if ('stop' in flags){
      let scene = dialogue[char][title];
      let lineChar = scene[index][0];
      let lineReact = scene[index][1];
      let line = scene[index][2];

      if (lineChar == ""){} else {dialogueName.innerText = this[lineChar].name};
      if (lineReact == ""){dialogueReact.style.display = "none"} else {
        dialogueReact.style.display = "block";
        dialogueReact.innerText = this.emojiParser(lineChar, lineReact);
      }
      dialogueLine.innerHTML = line;

      if(flags['stop']){
        dialogueNext.style.display = "block";
        dialogueNext.innerText = ">> end conversation"
        dialogueNext.onclick = this.stopDialogue.bind(this);
      } else {
        dialogueNext.style.display = "block";
        dialogueNext.onclick = this.displayDialogue.bind(this, char, title, flags['next']);
      }
    }
  }

  displayChoices(char, title, prevIndex){
    let dialogueReact = document.getElementById('dialogueReact');
    let dialogueName = document.getElementById('dialogueName');
    let dialogueLine = document.getElementById('dialogueLine');
    let dialogueNext = document.getElementById('dialogueNext');

    let flagSearch = `${title}${prevIndex}`;
    let flags = dialogueFlags[char][flagSearch];
    let scene = dialogue[char][title];

    let x = flags['numChoices'];
    dialogueNext.style.display = "none";
    dialogueLine.innerText = "";
    dialogueName.innerText = "";

    for (let i = 1; i <= x; i++){
      let a = document.createElement('a');
      a.innerText = `>> ${scene[prevIndex + i][2]}\n`;
      let nextLine = scene[prevIndex + i][3];
      if (typeof(nextLine) == 'number'){
          a.onclick = this.displayDialogue.bind(this, char, title, nextLine);
      } else if (typeof(nextLine == 'boolean')){
          a.onclick = this.displayAlt.bind(this, char, title, prevIndex + i);
      }
      dialogueLine.append(a);
    }
  }

  emojiParser(char, react){
    let text = emojis[char][react];
    const newline= /\\n/gi;
    text = text.replace(newline, String.fromCharCode(10));
    return text;
  }
}
