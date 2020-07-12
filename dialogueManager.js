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
    this.currDialogueReact = null;
    this.currDialogueName = null;
    this.bird = new Character("Keke", 15, []);
    this.cat = new Character("Mimi", 0, []);
    this.dog = new Character("Bobo", 40, []);
    this.witch = new Character("Witch", 20, []);
    this.randomTimeout = 120 * 1000;
    this.randomFlag = true;
  }
  
  //this finds the correct line within the dialogue based on the current conditions
  //of the character and then passes the line to the dialogue UI function
  findDialogue(char, title){
    let d = dialogue[char][title];
    let lines = dialogue[char][title].lines;
    let lineObj; 
    
    for (let i in lines){
      if (lines[i].condition(this[char].flags, this[char].trust)){
        lineObj = {
          line: lines[i].line,
          stop: d.stop,
          react: d.react,
          next: lines[i].next     
        }
        break;
      }
    }
    
    return lineObj;
  }
  
  stopDialogue(){
    document.getElementById('overlay').style.display = "none";
    document.getElementById('dialogueContainer').style.display = "none";
  }
  
  displayDialogue(char, title){
    let dialogueReact = document.getElementById('dialogueReact');
    let dialogueName = document.getElementById('dialogueName');
    let dialogueLine = document.getElementById('dialogueLine');
    let dialogueNext = document.getElementById('dialogueNext');
    
    if (dialogue[char][title].choice){
       //if choices then render choices
      dialogueLine.innerText = null;
      dialogueName.style.display = "none";
      dialogueNext.style.display = "none";
      let lines = dialogue[char][title].lines;
      lines.forEach((line) => {
        let a = document.createElement('a');
        a.innerText = `>> ${line.line}\n`;
        let choiceClick = function(line) {
          this[char].flags = this[char].flags.concat(line.flags);
          this.displayDialogue(char, line.next);
        } 
        a.onclick = choiceClick.bind(this, line);
        dialogueLine.append(a);
      });
    } else {
      //else render line of dialogue
      let d = this.findDialogue(char, title);
      dialogueLine.innerText = d.line;
      if (d.stop){
        dialogueNext.innerText = `>> end conversation`
        dialogueNext.onclick = this.stopDialogue.bind(this);
        dialogueNext.style.display= "block";
      } else {
        dialogueNext.innerText = `>> next`
        dialogueNext.onclick = this.displayDialogue.bind(this, char, d.next);
        dialogueNext.style.display = "block";
      }
      if (this[char].name != this.currDialogueName){
        dialogueName.innerText = this[char].name;
        dialogueReact.innerText = this.emojiParser(char, d.react);
      } else if (this[char].name == this.currDialogueName 
                 && this.currentDialogueReact != d.react){
        dialogueReact = this.emojiParser(char, d.react);
      }
    }    
    
    document.getElementById('overlay').style.display = "block";
    document.getElementById('dialogueContainer').style.display = "block";
  }
  
  emojiParser(char, react){
    let text = emojis[char][react];
    const newline= /\\n/gi;
    text = text.replace(newline, String.fromCharCode(10));
    return text;
  }
}