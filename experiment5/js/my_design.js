/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function getInspirations() {
    return [
      {
        name: "Einstein", 
        assetUrl: "https://cdn.glitch.global/d0012612-7df5-469d-aff0-37b23c1ee026/Einstein_tongue.jpg?v=1714964241963",
        credit: "The famous image of Einstein taken by United Press, Arthur Sasse, 1951"
      },
      {
        name: "Wanderer above the Sea of Fog", 
        assetUrl: "https://cdn.glitch.global/d0012612-7df5-469d-aff0-37b23c1ee026/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpg?v=1714973221056",
        credit: "Wanderer above the Sea of Fog, Caspar David Friedrich, 1818"
      },
      {
        name: "The Great Wave off Kanagawa", 
        assetUrl: "https://cdn.glitch.global/d0012612-7df5-469d-aff0-37b23c1ee026/Tsunami_by_hokusai_19th_century.jpg?v=1714973221457",
        credit: "The Great Wave off Kanagawa, Katsushika Hokusai, 1831"
      }
    ];
  }
  
  function initDesign(inspiration) {
    resizeCanvas(inspiration.image.width, inspiration.image.height);
    
    let design = {
      bg: 128,
      fg: []
    }
    // i = number of shapes
    for(let i = 0; i < 1000; i++) {
      design.fg.push({x: random(width),
                      y: random(height),
                      w: random(width/16),
                      h: random(height/16),
                      op: random(255)})
    }
    return design;
  }
  
  function renderDesign(design, inspiration) {
    
    //background(design.bg);
    noStroke();
    for(let box of design.fg) {
      let c = currentInspiration.image.get(box.x, box.y)
      fill(c[0], c[1], c[2], box.op);
      if (inspiration.name == "Einstein") {
          rect(box.x - box.w/2, box.y-box.h/2, box.w, box.h);
      }
      else if (inspiration.name == "Wanderer above the Sea of Fog"){
          ellipse(box.x, box.y, box.w, box.h);
      }
      else {
          triangle(box.x, box.y - box.h/2, box.x - box.w/2, box.y + box.h/2, box.x + box.w/2, box.y + box.h/2)
      }
    }
  }
  
  function mutateDesign(design, inspiration, rate) {
    design.bg = mut(design.bg, 0, 255, rate);
    for(let box of design.fg) {
      box.op = mut(box.op, 0, 255, rate);
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width/16, rate);
      box.h = mut(box.h, 0, height/16, rate);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const dropper = document.getElementById('dropper');
    const inspirationImage = document.getElementById('inspiration-image');

    dropper.addEventListener('change', function() {
        const selectedOption = dropper.options[dropper.selectedIndex].text;
        let selectedImageUrl = "";

        // Determine the image URL based on the selected option
        if (selectedOption === "Einstein") {
            selectedImageUrl = "https://cdn.glitch.global/d0012612-7df5-469d-aff0-37b23c1ee026/Einstein_tongue.jpg?v=1714964241963";
        } else if (selectedOption === "The Great Wave off Kanagawa") {
            selectedImageUrl = "https://cdn.glitch.global/d0012612-7df5-469d-aff0-37b23c1ee026/Tsunami_by_hokusai_19th_century.jpg?v=1714973221457";
        } else if (selectedOption === "Wanderer above the Sea of Fog") {
            selectedImageUrl = "https://cdn.glitch.global/d0012612-7df5-469d-aff0-37b23c1ee026/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpg?v=1714973221056";
        }

        // Set the src attribute of the inspiration image
        inspirationImage.src = selectedImageUrl;
    });

    // Trigger change event to initially set the image
    dropper.dispatchEvent(new Event('change'));
});
  
window.addEventListener('DOMContentLoaded', (event) => {
    // Simulate user selecting Einstein option
    const dropper = document.getElementById('dropper');
    dropper.value = 'Einstein'; // Assuming 'Einstein' is the value for the Einstein option
    dropper.dispatchEvent(new Event('change'));
});  
  
  function mut(num, min, max, rate) {
      return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
  }