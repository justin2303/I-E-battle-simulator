
  
total_Cwidth=0;
  function updateContainers() {
    const numContainers = parseInt(document.getElementById("num-containers").value);
    const gridContainer = document.querySelector('.grid-container');
    // Clear existing containers
    total_Cwidth=numContainers;
    gridContainer.innerHTML = '';
    var newTextElement = document.createElement('p');
    newTextElement.textContent = 'Army 1';
    gridContainer.appendChild(newTextElement);
    // Create two rows and containers dynamically
    for (let i = 0; i < 2; i++) {
      const rowContainer = document.createElement('div');
      rowContainer.className = 'row-container';
      for (let j = 0; j < numContainers; j++) {
        const combat_grid = document.createElement('button');
        combat_grid.className = 'button combat_grid';
        combat_grid.classList.toggle('empty');
        combat_grid.id = i*numContainers + j;
        combat_grid.onclick = function () {
          toggleGrid(combat_grid);
      };
        rowContainer.appendChild(combat_grid);
      }
  
      gridContainer.appendChild(rowContainer);
    }//army 1
    const frontcontainer = document.createElement('div');
    frontcontainer.className = 'row-container';
    for (let j = 0; j < numContainers; j++) {
      const front = document.createElement('div');
      front.className = 'frontline';
      frontcontainer.appendChild(front);
    }//make the front line
    gridContainer.appendChild(frontcontainer);

    for (let i = 0; i < 2; i++) {
      const rowContainer = document.createElement('div');
      rowContainer.className = 'row-container';
      for (let j = 0; j < numContainers; j++) {
        const combat_grid = document.createElement('button');
        combat_grid.className = 'button combat_grid';
        combat_grid.id = (i+2)*numContainers + j;
        combat_grid.classList.toggle('empty');
        combat_grid.onclick = function () {
          toggleGrid(combat_grid);
      };
        rowContainer.appendChild(combat_grid);
      }
  
      gridContainer.appendChild(rowContainer);
    }//army 2

    var newTextElement2 = document.createElement('p');
    newTextElement2.textContent = 'Army 2';
    gridContainer.appendChild(newTextElement2);
    const move_button = document.createElement('button');
    move_button.textContent="Move Unit";
    move_button.onclick = function (){
      moveUnit();
    }
    gridContainer.appendChild(move_button)
    }
    army1_deployed = [];
    army2_deployed = [];
  function toggleGrid(button){//toggle which map grid u wanna press
    if(button.classList.contains('empty')){
    document.querySelectorAll('.button.combat_grid').forEach(function(btn) {
        if (btn !== button && btn.classList.contains('pressed')&& btn.classList.contains('empty')) {
            btn.classList.remove('pressed');
        }//unpress the rest or itself
    });

    // toggle selection
    button.classList.toggle('pressed');
  }
  else{
    let wheretoplace;
    wheretoplace = document.getElementById('display_stat');
    wheretoplace.innerHTML = '';
    let which_army;
    let u_to_disp;
    //find the army
    if(button.id<total_Cwidth*2){
      which_army= army1_deployed;
    }
    else{
      which_army = army2_deployed;
    }
    //find the unit
    for (let i = 0; i < which_army.length; i++){
      if(which_army[i].coord==button.id){
        u_to_disp=which_army[i];
        break;
      } 
    }

    const table = document.createElement('table');
    table.className = 'short_table'; 
        // Create table rows and cells for each unit stat
        const properties = ['Name', 'Attack', 'Defence', 'Support', 'Maneuver', 'Strength', 'Organization', 'Discipline', 'Experience'];
        
        properties.forEach(property => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const propertyName = property.toLowerCase();
            cell1.textContent = property;
            cell2.textContent = u_to_disp[propertyName];
        });

        // Append the table to the button element
    wheretoplace.appendChild(table);
    button.classList.toggle('pressed');
    document.querySelectorAll('.button.combat_grid').forEach(function(btn) {
      if (btn !== button && btn.classList.contains('pressed')) {
          btn.classList.remove('pressed');
      }//unpress everything butitself
  });
  }
  }
  

  function deploy() {
    let grid_to_update;
    let army_indexer;
    let to_fill;
    // Find which grid is pressed, then find the pressed unit, and then deploy said unit, delete unit from reserve pool
    document.querySelectorAll('.button.combat_grid').forEach(function(btn) {
      if (btn.classList.contains('pressed') && btn.classList.contains('empty')) {
        console.log('Pressed button:', btn.id);
        grid_to_update=btn.id;
        btn.classList.remove('pressed');
        to_fill=btn;
      }
    });
    document.querySelectorAll('.button.reserve').forEach(function(btn) {
      if (btn.classList.contains('selected')) {
        console.log('unit:', btn.id);
        army_indexer=btn.id;
        btn.classList.remove('selected');
        return;
      }
    });
    if(grid_to_update==null || army_indexer==null ){
      return;
    }

    else{
      if(grid_to_update<(total_Cwidth*2)){
        //first find which army it belongs to
        if(army_indexer<army1.length){
          to_fill.classList.toggle('empty');
          let to_push = army1[army_indexer];
          let u_type = to_push.unittype;
          if (u_type === "inf") {
            console.log("infantry");
            to_fill.style.backgroundImage = 'url("img_files/classic_inf.png")';
          }
          else if (u_type === "grd") {
            console.log("guard");
            to_fill.style.backgroundImage = 'url("img_files/classic_grd.png")';
          }
          else if (u_type === "cav") {
            console.log("cavalry");
            to_fill.style.backgroundImage = 'url("img_files/classic_cav.png")';
          }
          else if (u_type === "art") {
            console.log("artillery");
            to_fill.style.backgroundImage = 'url("img_files/classic_arty.png")';
          }
          else if (u_type === "eng") {
            console.log("engineer");
            to_fill.style.backgroundImage = 'url("img_files/classic_eng.png")'; 
          }
          else if (u_type === "grc") {
            console.log("g cav");
            to_fill.style.backgroundImage = 'url("img_files/classic_gcav.png")';
          }
          to_push.coord = grid_to_update;
          army1_deployed.push(to_push);
          army1.splice(army_indexer, 1);
          updateArmies(1);
          updateArmies(2);
          updataDeployment(1);
          to_fill.style.backgroundColor='blue';
        }//else do nothing
        return;
      }
      else{
        if(army_indexer>=army1.length){
          console.log(army_indexer);
          to_fill.classList.toggle('empty');
          army_indexer-=army1.length
          let to_push = army2[army_indexer];
          let u_type = to_push.unittype;
          if (u_type === "inf") {
            console.log("infantry");
            to_fill.style.backgroundImage = 'url("img_files/classic_inf.png")';
          }
          else if (u_type === "grd") {
            console.log("guard");
            to_fill.style.backgroundImage = 'url("img_files/classic_grd.png")';
          }
          else if (u_type === "cav") {
            console.log("cavalry");
            to_fill.style.backgroundImage = 'url("img_files/classic_cav.png")';
          }
          else if (u_type === "art") {
            console.log("artillery");
            to_fill.style.backgroundImage = 'url("img_files/classic_arty.png")';
          }
          else if (u_type === "eng") {
            console.log("engineer");
            to_fill.style.backgroundImage = 'url("img_files/classic_eng.png")'; 
          }
          else if (u_type === "grc") {
            console.log("g cav");
            to_fill.style.backgroundImage = 'url("img_files/classic_gcav.png")';
          }
          to_push.coord = grid_to_update;
          army2_deployed.push(to_push);
          army2.splice(army_indexer, 1);
          updateArmies(2);
          updataDeployment(2);
          to_fill.style.backgroundColor='red';
        }//else do nothing
        return;
      }
      }

  }

  function updataDeployment(army_num) {
    let color;
    let armyDeployContainer;
    let which_army;
    if(army_num==1){
      armyDeployContainer = document.getElementById('army1_dep');
        color='blue';
        which_army=army1_deployed;
    // Clear the container before updating
    armyDeployContainer.innerHTML = '';
    }
    else{
      armyDeployContainer = document.getElementById('army2_dep');
        color='red';
        which_army=army2_deployed;
    // Clear the container before updating
    armyDeployContainer.innerHTML = '';
    }
    
    for (let i = 0; i < which_army.length; i++) {
      const unit = which_army[i];
      console.log("tring to print Unit type:", unit.unittype);
      const deployButton = document.createElement('button');
      deployButton.className = 'button deployment';
      deployButton.style.borderRadius = '10%';
      deployButton.style.backgroundColor = color;
      deployButton.id = (army1_deployed.length)*(army_num-1) + i;
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

function moveUnit(){
  let empty_grid;
  let filled_grid;
  document.querySelectorAll('.button.combat_grid').forEach(function(btn) {
    if (btn.classList.contains('pressed') && btn.classList.contains('empty')) {
      console.log('Pressed button:', btn.id);
      empty_grid=btn;
      btn.classList.remove('pressed');
    }//should never have more than 1
    else if (btn.classList.contains('pressed')){
      console.log('Filled button:', btn.id);
      filled_grid=btn;
      btn.classList.remove('pressed');
    }//should never have more than 1
  });

  if(filled_grid==null || empty_grid == null){
    return; //needs both to be on
  }
  else if (filled_grid.id<2*total_Cwidth && empty_grid.id>=2*total_Cwidth ){
    return; //cant dep army1 in army2 zone
  }
  else if (filled_grid.id>=2*total_Cwidth && empty_grid.id<2*total_Cwidth){
    return; //cant dep army2 in army1 zone
  }
  else{
    //this is valid
    filled_grid.classList.toggle('empty');
    empty_grid.classList.toggle('empty');
    //flip the emtpy/filleds
    let which_army;
    let u_to_disp;
    let color;
    //find the army
    if(filled_grid.id<total_Cwidth*2){
      which_army= army1_deployed;
      color='blue';
    }
    else{
      which_army = army2_deployed;
      color='red';
    }
    //find the unit
    for (let i = 0; i < which_army.length; i++){
      if(which_army[i].coord==filled_grid.id){
        u_to_disp=which_army[i];
        which_army[i].coord=empty_grid.id;
        filled_grid.style.backgroundImage = 'none';
        filled_grid.style.backgroundColor = 'white';
        break;
      } 
    }//found the unit
    if (u_to_disp.unittype === "inf") {
      console.log("infantry");
      empty_grid.style.backgroundImage = 'url("img_files/classic_inf.png")';
    }
    else if (u_to_disp.unittype === "grd") {
      console.log("guard");
      empty_grid.style.backgroundImage = 'url("img_files/classic_grd.png")';
    }
    else if (u_to_disp.unittype === "cav") {
      console.log("cavalry");
      empty_grid.style.backgroundImage = 'url("img_files/classic_cav.png")';
    }
    else if (u_to_disp.unittype === "art") {
      console.log("artillery");
      empty_grid.style.backgroundImage = 'url("img_files/classic_arty.png")';
    }
    else if (u_to_disp.unittype === "eng") {
      console.log("engineer");
      empty_grid.style.backgroundImage = 'url("img_files/classic_eng.png")'; 
    }
    else if (u_to_disp.unittype === "grc") {
      console.log("g cav");
      empty_grid.style.backgroundImage = 'url("img_files/classic_gcav.png")';
    }
    else{//panic
      console.log("WHAT THE HELL?");
      return;
    }
    empty_grid.style.backgroundColor = color;

    
  }

}