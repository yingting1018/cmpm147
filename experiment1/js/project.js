// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  const fillers = {
    cat: ["Kitty", "Kitten", "Cat", "baby", "Whiskers", "meow", "miao miao", "$cat and $cat", "$cat, $cat, and $cat",],
    sound: ["sad meow", "hiss", "rawr", "roar", "grrr"],
    acc: ["sunglasses", "glasses", "necklace","collar", "hat"],
    people: ["kind", "meek", "brave", "wise", "pushy", "cherished", "honored", "sweet", "angelic"],
    item: ["axe", "staff", "book", "cloak", "shield", "club", "sword", "magic gloves", "galvel", "fists", "mace", "potato"],
    outfit: ["dress", "mermaid tail", "2 piece witch costume", "dragon onesie", "purple overalls"],
    store: ["Walmart", "Target", "Dollar Tree", "Amazon", "PetSmart", "PetCo"],
  //   loots: ["coins", "chalices", "ingots", "hides", "victory points", "gems","scrolls", "bananas", "noodles", "goblins", "CS Majors", "college credits"],
  //   baddies: ["orcs", "glubs", "fishmen", "cordungles", "mountain trolls", "college professors", "dragon", "evil $adventurer", "agents of chaos"],
    message: ["adorable", "lovely", "cute", "so loveable", "silly", "funny", "interesting"],
    
  };
  
  const template = `$cat, you would look $message in this $outfit!
  
  I have just come from $store where the $people clerks are looking to sell more clothes. Their stock has just been refilled. You must try this on at once, pairing with this $acc, and staring into the camera.
  
  Please don't make any $sound noises, this will be over shortly!
  `;
  
  
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
}
  // call a method on the instance
  myInstance.myMethod();
// }

// // let's get this party started - uncomment me
main();