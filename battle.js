army1_retreated = [];
army2_retreated = [];
async function fight(){
    //get all the stats
    let roll1_army=document.getElementById('roll1').value;
    if( roll1_army == ''){
        //Math.random is between 0 and 1
        roll1_army = Math.floor(Math.random()*10);
        console.log(roll1_army);
    }
    let gen1=document.getElementById('gen_qual1').value;
    if( gen1 == ''){
        gen1 = 0
        console.log(gen1);
    }
    let terrain = document.getElementById('ter_mod').value;
    if( terrain == ''){
        terrain = 0
        console.log(terrain);
    }
    let entrench = document.getElementById('ent_mod').value;
    if( entrench == ''){
        entrench = 0
        console.log(entrench);
    }
    let tact1 = document.getElementById('tact1').value;
    if( tact1 == ''){
        tact1 = 0
        console.log(tact1);
    }
    let fort = document.getElementById('fort_lev').value;
    if( fort == ''){
        fort = 0
        console.log(fort);
    }
    //army1 modifiers
    let  roll2_army =document.getElementById('roll2').value;
    if( roll2_army == ''){
        roll2_army = Math.floor(Math.random()*10);
        console.log(roll2_army);
    }
    let gen2 =document.getElementById('gen_qual2').value;
    if( gen2 == ''){
        gen2 = 0;
        console.log(gen2);
    }
    let tact2  = document.getElementById('tact2').value;
    if( tact2 == ''){
        tact2 = 0;
        console.log(tact2);
    }
    //defined above army modifiers.
for(let i=0; i<army2_deployed.length; i++){//army 2 attack!
    let Stat;
    let damage;
    let deorg;
    let total_roll = roll2_army + gen2;
    let Roll_Multiplier = (total_roll / 5 +0.2);
    let num_def = army2_deployed[i].strength;
    Stat = army2_deployed[i].defence;
    console.log(num_def);
    if(army2_deployed[i].coord<total_Cwidth*3){//frontline calculations
        console.log("frontline");
        damage = num_def * (10+Stat)*Roll_Multiplier/(2500*(1.5+tact1));   
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
      await sleep(1000);
      def_btn.classList.toggle('def');
      att_btn.classList.toggle('att');
      //if at .2 org 25% chance retreat
}//army 2 has finished their turn.

army_retreat(1); //retreat the units in army1 if they need retreating.

for(let i=0; i<army1_deployed.length; i++){//army1 attack
    let Stat;
    let damage;
    let deorg;
    let total_roll = roll1_army-fort+gen1-terrain-entrench; 
    let Roll_Multiplier = (total_roll / 5 +0.2);
    let num_att = army1_deployed[i].strength;
    Stat = army1_deployed[i].attack;
    if(army1_deployed[i].coord>=total_Cwidth){//frontline calculations
        console.log("frontline");
        damage = num_att * (10+Stat)*Roll_Multiplier/(2500*(1.5+tact2));   
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
      await sleep(1000);
      def_btn.classList.toggle('def');
      att_btn.classList.toggle('att');
      //if at .2 org 25% chance retreat
}
army_retreat(2); //retreat the units in army1 if they need retreating.
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
      which_army.splice(x, 1)[0];
      updataDeployment(num);
      x--;
    }//unit deleted
    else if(which_army[x].organization<=0.3){
      let randomInt = Math.floor(Math.random() * 3);
      if (randomInt==1){
        let to_ret=which_army.splice(x, 1)[0];
        x--;
        updataDeployment(num);
        if(num==1){
          army1_retreated.push(to_ret);
        }
        else{
          army2_retreated.push(to_ret);
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

function battle_delay() {
    console.log("Delayed log after 0.3 seconds");
  }

  