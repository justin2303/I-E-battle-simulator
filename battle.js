army1_retreated = [];
army2_retreated = [];
async function fight(){
    //get all the stats
    let roll1_armyIN=document.getElementById('roll1').value;
    let roll1_army = parseFloat(roll1_armyIN);
    if( roll1_armyIN == ''){
        //Math.random is between 0 and 1
        roll1_army = Math.floor(Math.random()*10);
        console.log(roll1_army);
    }
    let gen1IN=document.getElementById('gen_qual1').value;
    let gen1 = parseFloat(gen1IN);
    if( gen1IN == ''){
        gen1 = 0
        console.log(gen1);
    }
    let terrainIN = document.getElementById('ter_mod').value;
    let terrain = parseFloat(terrainIN);
    if( terrainIN == ''){
        terrain = 0
        console.log(terrain);
    }
    let entrench = document.getElementById('ent_mod').value;
    if( entrench == ''){
        entrench = 0
        console.log(entrench);
    }
    let tact1IN = document.getElementById('tact1').value;
    let tact1 = parseFloat(tact1IN)
    if( tact1IN == ''){
        tact1 = 0
        console.log(tact1);
    }
    let fortIN = document.getElementById('fort_lev').value;
    let fort = parseFloat(fortIN);
    if( fortIN == ''){
        fort = 0
        console.log(fort);
    }
    //army1 modifiers
    let  roll2_army_in =document.getElementById('roll2').value;
    let roll2_army = parseFloat(roll2_army_in);
    if( roll2_army_in == ''){
        roll2_army = Math.floor(Math.random()*10);
        console.log(roll2_army);
    }
    let gen2Input =document.getElementById('gen_qual2').value;
    let gen2 = parseFloat(gen2Input);
  
    if( gen2Input == ''){
        gen2 = 0;
        console.log(gen2);
    }
    let tact2Input = document.getElementById('tact2').value;
    let tact2 = parseFloat(tact2Input);
    if( tact2Input == ''){
        tact2 = 0;
        console.log(tact2);
    }
    //defined above army modifiers.
for(let i=0; i<army2_deployed.length; i++){//army 2 attack!
    let Stat;
    let damage;
    let deorg;
    let total_roll = roll2_army + gen2;
    let Roll_Multiplier= total_roll;
    if (total_roll == 0){
      Roll_Multiplier = 1;
    }
    let num_def = army2_deployed[i].strength;
    Stat =parseFloat(army2_deployed[i].defence);
    console.log("defence Stat:", Stat);
    console.log(Roll_Multiplier);
    console.log("roll_stat:", roll2_army, gen2, 10+Stat, 1.5+tact1)
    if(army2_deployed[i].coord<total_Cwidth*3){//frontline calculations
        console.log("frontline");
        damage = num_def/50 * (1+Stat/5)*Roll_Multiplier/(1+tact1/10);
        console.log("fresh dmg:", damage);   
    }
    else{//backline calculations
        console.log("backline");
        damage =  num_def * (10+Stat*army2_deployed[i].support)*Roll_Multiplier/(2500*(1.5+tact1));
    }
    damage = Math.floor(damage);//round it off
    //now find which unit it targets
    let distance_map = new Map();//key= man distance, val= place in army1
    for(let x = 0; x < army1_deployed.length; x++){//calculate distance
        //parseInt(army2_deployed[i].coord, 10);convrts coords to base 10.... else its treated as a string in the + 1....
        //get distance: there is a 1 amnesty when u cross the front (manouver value)
        let row_dist =Math.ceil((parseInt(army2_deployed[i].coord, 10) + 1)/total_Cwidth)-Math.ceil((parseInt(army1_deployed[x].coord, 10)+1)/total_Cwidth);
        let hor_dist = Math.abs((parseInt(army2_deployed[i].coord, 10) - row_dist * total_Cwidth) - parseInt(army1_deployed[x].coord, 10));
        let total_man = row_dist + hor_dist -1;
        
        if(total_man<=army2_deployed[i].maneuver){
            if (!distance_map.has(total_man)) {
                distance_map.set(total_man, [x]);
              }
            else{
                distance_map.get(total_man).push(x);
            }
        }
        if(total_man==0 ){
            break;//directly infront, nothing closer. so break
        }
    }
    //now iterate thru distance map, attack closest unit, if there are multiple, prioritize arty, else attack the weakest
    let loc_min=10000; //weakest unit/arty cuz most valuable target.
    let targ_index = -1;
    let lowestKey = 30;
    for (let key of distance_map.keys()) {
      if (key < lowestKey) {
        lowestKey = key;
      }
    }//find min key
      let indexes = distance_map.get(lowestKey);
      if(!indexes){
        break;
      }
      for(let x=0; x<indexes.length;x++){// go thru all possible targets in lowest key, and choose the most vulnerable
          if (army1_deployed[indexes[x]].unittype == 'art') {
            targ_index = indexes[x];
              break; //always prioritize arty.
          }
          if(army1_deployed[indexes[x]].strength < loc_min){
              loc_min = army1_deployed[indexes[x]].strength;
              targ_index = indexes[x];
          }
      }//found now attack! 
      console.log(targ_index);
      let disc = parseInt(army1_deployed[targ_index].discipline, 10)
      deorg =  damage /100 / disc;
      army1_deployed[targ_index].strength= army1_deployed[targ_index].strength - damage;
      army1_deployed[targ_index].organization = army1_deployed[targ_index].organization - deorg;
      let def_btn = document.getElementById(army1_deployed[targ_index].coord);
      let att_btn = document.getElementById(army2_deployed[i].coord);
      def_btn.classList.toggle('def');
      att_btn.classList.toggle('att');
      console.log("type is: ", army1_deployed[targ_index].unittype);
      console.log("org is: ", army1_deployed[targ_index].organization);
      console.log("strength: ", army1_deployed[targ_index].strength);
      console.log("damage: ", damage);
      await sleep(500);
      def_btn.classList.toggle('def');
      att_btn.classList.toggle('att');
      army_retreat(1); //retreat the units in army1 if they need retreating.
}//army 2 has finished their turn.


for(let i=0; i<army1_deployed.length; i++){//army1 attack
    let Stat;
    let damage;
    let deorg;
    let total_roll = roll1_army-fort+gen1-terrain-entrench;
    let Roll_Multiplier=total_roll;
    if (total_roll == 0){
      Roll_Multiplier = 1;
    }
    console.log("army1 rollmult:", Roll_Multiplier); 
    let num_att = army1_deployed[i].strength;
    Stat =parseFloat(army1_deployed[i].attack);
    console.log("attack Stat:", Stat);
    if(army1_deployed[i].coord>=total_Cwidth){//frontline calculations
        console.log("frontline");
        damage = num_att/50 * (1+Stat/5)*Roll_Multiplier/(1+tact2/10); 
        console.log("fresh dmg,", damage);  
    }
    else{//backline calculations
        console.log("backline");
        damage =  num_att * (10+Stat*army1_deployed[i].support)*Roll_Multiplier/(2500*(1.5+tact1));
    }
    damage = Math.floor(damage);//round it off
    //now find which unit it targets
    let distance_map = new Map();//key= man distance, val= place in army1
    for(let x = 0; x < army2_deployed.length; x++){//calculate distance
        //parseInt(army2_deployed[i].coord, 10);convrts coords to base 10.... else its treated as a string in the + 1....
        //get distance: there is a 1 amnesty when u cross the front (manouver value)
        let row_dist =Math.ceil((parseInt(army1_deployed[i].coord, 10) + 1)/total_Cwidth)-Math.ceil((parseInt(army2_deployed[x].coord, 10)+1)/total_Cwidth);
        row_dist = Math.abs(row_dist);
        let hor_dist = Math.abs((parseInt(army2_deployed[x].coord, 10) - row_dist * total_Cwidth) - parseInt(army1_deployed[i].coord, 10));
        let total_man = row_dist + hor_dist -1;
        
        if(total_man<=army1_deployed[i].maneuver){
            if (!distance_map.has(total_man)) {
                distance_map.set(total_man, [x]);
              }
            else{
                distance_map.get(total_man).push(x);
            }
        }
        if(total_man==0 ){
            break;//directly infront, nothing closer. so break
        }
    }
    //now iterate thru distance map, attack closest unit, if there are multiple, prioritize arty, else attack the weakest
    let loc_min=10000; //weakest unit/arty cuz most valuable target. stren never >10000
    let targ_index = -1;
    let lowestKey = 30;//man never more than 30
    for (let key of distance_map.keys()) {
      if (key < lowestKey) {
        lowestKey = key;
      }
    }//find min key
      let indexes = distance_map.get(lowestKey);
      if(!indexes){
        break;
      }
      for(let x=0; x<indexes.length;x++){// go thru all possible targets in lowest key, and choose the most vulnerable
          if (army2_deployed[indexes[x]].unittype == 'art') {
            targ_index = indexes[x];
              break; //always prioritize arty.
          }
          if(army2_deployed[indexes[x]].strength < loc_min){
              loc_min = army2_deployed[indexes[x]].strength;
              targ_index = indexes[x];
          }
      }//found now attack! 
      console.log(targ_index);
      let disc = parseInt(army2_deployed[targ_index].discipline, 10)
      deorg =  damage /100 / disc;
      army2_deployed[targ_index].strength= army2_deployed[targ_index].strength - damage;
      army2_deployed[targ_index].organization = army2_deployed[targ_index].organization - deorg;
      let def_btn = document.getElementById(army2_deployed[targ_index].coord);
      let att_btn = document.getElementById(army1_deployed[i].coord);
      def_btn.classList.toggle('def');
      att_btn.classList.toggle('att');
      console.log("type is: ", army2_deployed[targ_index].unittype);
      console.log("org is: ", army2_deployed[targ_index].organization);
      console.log("strength: ", army2_deployed[targ_index].strength);
      await sleep(500);
      def_btn.classList.toggle('def');
      att_btn.classList.toggle('att');
      //if at .2 org 25% chance retreat
      army_retreat(2); //retreat the units in army1 if they need retreating.
}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function army_retreat(num){
  let which_army;
  if (num == 1){
    which_army=army1_deployed;
  }
  else{
    which_army=army2_deployed;
  }
  for(let x=0; x<which_army.length; x++){
    if(which_army[x].organization<=0){
      let to_ret=which_army.splice(x, 1)[0];
      x--;
      updataDeployment(num);
      if(num==1){
        army1_deployed=which_army;
        display_retreat(1);
      }
      else{
        army2_deployed=which_army;
        display_retreat(2);
      }
      updateArmies(num);
      let id = CSS.escape(to_ret.coord); 
      
      // Find the button element with the specified ID
      let button = document.querySelector(`#${id}.button.combat_grid`);
      
      // If the button is found, update its class and style
      if (button) {
          button.classList.remove("deployed"); // Remove the 'deployed' class
          button.classList.add("empty"); // Add the 'empty' class
          button.style.backgroundColor = "white"; // Set background color to white
          button.style.backgroundImage = 'none';
      }
      
    }//unit deleted
    else if(which_army[x].organization<=0.3){
      let randomInt = Math.floor(Math.random() * 3);
      if (randomInt==1){
        let to_ret=which_army.splice(x, 1)[0];
        x--;
        updataDeployment(num);
        if(num==1){
          army1_retreated.push(to_ret);
          army1_deployed=which_army;
          display_retreat(1);
        }
        else{
          army2_retreated.push(to_ret);
          army2_deployed=which_army;
          display_retreat(2);
        }
        updateArmies(num);
        let id = CSS.escape(to_ret.coord); 
        
        // Find the button element with the specified ID
        let button = document.querySelector(`#${id}.button.combat_grid`);
        
        // If the button is found, update its class and style
        if (button) {
            button.classList.remove("deployed"); // Remove the 'deployed' class
            button.classList.add("empty"); // Add the 'empty' class
            button.style.backgroundColor = "white"; // Set background color to white
            button.style.backgroundImage = 'none';
        }
      }
    }//33% chance unit retreats

  }
}
function display_retreat(army_num){
  let color;
  let armyDeployContainer;
  let which_army;
  if(army_num==1){
    armyDeployContainer = document.getElementById('army1_ret');
      which_army=army1_retreated;
  // Clear the container before updating
  armyDeployContainer.innerHTML = '';
  }
  else{
    armyDeployContainer = document.getElementById('army2_ret');
      which_army=army2_retreated;
  // Clear the container before updating
  armyDeployContainer.innerHTML = '';
  }
  
  for (let i = 0; i < which_army.length; i++) {
    const unit = which_army[i];
    console.log("tring to print Unit type:", unit.unittype);
    const deployButton = document.createElement('button');
    deployButton.className = 'button deployment';
    deployButton.style.borderRadius = '10%';
    deployButton.id = (army1_deployed.length)*(army_num-1) + i;
    deployButton.onclick = function () {
      toggleReserves(deployButton, unit);
  };
    if (unit.unittype === "inf") {
      console.log("infantry");
      deployButton.style.backgroundImage = 'url("img_files/classic_inf.png")';
    }
    else if (unit.unittype === "grd") {
      console.log("guard");
      deployButton.style.backgroundImage = 'url("img_files/classic_grd.png")';
    }
    else if (unit.unittype === "cav") {
      console.log("cavalry");
      deployButton.style.backgroundImage = 'url("img_files/classic_cav.png")';
    }
    else if (unit.unittype === "art") {
      console.log("artillery");
      deployButton.style.backgroundImage = 'url("img_files/classic_arty.png")';
    }
    else if (unit.unittype === "eng") {
      console.log("engineer");
      deployButton.style.backgroundImage = 'url("img_files/classic_eng.png")'; 
    }
    else if (unit.unittype === "grc") {
      console.log("g cav");
      deployButton.style.backgroundImage = 'url("img_files/classic_gcav.png")';
    }
    else{//panic
      console.log("WHAT THE HELL?");
      return;
    }
    armyDeployContainer.appendChild(deployButton);
  }
  
}

function battle_delay() {
    console.log("Delayed log after 0.3 seconds");
  }

  