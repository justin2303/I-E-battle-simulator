
  
  function toggleButton(button, u_type) {//toggle active status on image
    // Remove 'active' class from all buttons with the same type
    document.querySelectorAll('.button.unit-type').forEach(function(btn) {
      if (btn !== button && btn.classList.contains('active')) {
        btn.classList.remove('active');
      }
    });

    // Toggle 'active' class on the clicked button
    button.classList.toggle('active');
    switch(u_type) {
      case 3:
        console.log("Guard cavalry selected");
        document.getElementById('Unit_name').value = "sail61e_fred's hussar_elites";
        document.getElementById('Unit_attack').value = "8";
        document.getElementById('Unit_defence').value = "5";
        document.getElementById('Unit_sup').value = "0";
        document.getElementById('Unit_man').value = "2";
        document.getElementById('Unit_str').value = "3000";
        document.getElementById('Unit_org').value = "2";
        document.getElementById('Unit_dis').value = "15";
        document.getElementById('Unit_exp').value = "1";
        break;

      case 2:
        console.log("Cavalry selected");
        document.getElementById('Unit_name').value = "61e regiment de Hussards";
        document.getElementById('Unit_attack').value = "5";
        document.getElementById('Unit_defence').value = "4";
        document.getElementById('Unit_sup').value = "0";
        document.getElementById('Unit_man').value = "3";
        document.getElementById('Unit_str').value = "3000";
        document.getElementById('Unit_org').value = "1";
        document.getElementById('Unit_dis').value = "10";
        document.getElementById('Unit_exp').value = "1";
        break;
      case 0:
        console.log("Infantry selected");
        document.getElementById('Unit_name').value = "95th Jason Venetis";
        document.getElementById('Unit_attack').value = "5";
        document.getElementById('Unit_defence').value = "5";
        document.getElementById('Unit_sup').value = "0";
        document.getElementById('Unit_man').value = "1";
        document.getElementById('Unit_str').value = "3000";
        document.getElementById('Unit_org').value = "1.5";
        document.getElementById('Unit_dis').value = "10";
        document.getElementById('Unit_exp').value = "1";
        break;
      case 1:
        console.log("Guard selected");
        document.getElementById('Unit_name').value = "Corentin Leroy Division";
        document.getElementById('Unit_attack').value = "8";
        document.getElementById('Unit_defence').value = "5";
        document.getElementById('Unit_sup').value = "0";
        document.getElementById('Unit_man').value = "2";
        document.getElementById('Unit_str').value = "3000";
        document.getElementById('Unit_org').value = "2";
        document.getElementById('Unit_dis').value = "10";
        document.getElementById('Unit_exp').value = "1";
        break;
      case 5:
        console.log("Engineer selected");
        document.getElementById('Unit_name').value = "ERB mega evento campers";
        document.getElementById('Unit_attack').value = "1";
        document.getElementById('Unit_defence').value = "7";
        document.getElementById('Unit_sup').value = "0.3";
        document.getElementById('Unit_man').value = "1";
        document.getElementById('Unit_str').value = "3000";
        document.getElementById('Unit_org').value = "0.8";
        document.getElementById('Unit_dis').value = "10";
        document.getElementById('Unit_exp').value = "1";
        break;
      case 4:
        console.log("Artillery selected");
        document.getElementById('Unit_name').value = "40NN Niko's Ninjas";
        document.getElementById('Unit_attack').value = "0.5";
        document.getElementById('Unit_defence').value = "3";
        document.getElementById('Unit_sup').value = "0.7";
        document.getElementById('Unit_man').value = "2";
        document.getElementById('Unit_str').value = "3000";
        document.getElementById('Unit_org').value = "0.8";
        document.getElementById('Unit_dis').value = "10";
        document.getElementById('Unit_exp').value = "1"; 
        break;
      default:
        console.log("No unit selected or invald unit type");
    }
  }

  function getActiveUnitId() {
    const activeUnit = document.querySelector('.button.unit-type.active');
    return activeUnit ? activeUnit.id : null;
  }
  
  army1 = [];
  army2 = [];
  function addreserves(army_number){
    const activeUnitId = getActiveUnitId();
    const newUnit = new battle_unit();
    if(activeUnitId==null){
        return;
    }
    newUnit.unittype = activeUnitId;
    newUnit.name = document.getElementById('Unit_name').value;
    newUnit.attack = document.getElementById('Unit_attack').value;
    newUnit.defence = document.getElementById('Unit_defence').value;
    newUnit.support = document.getElementById('Unit_sup').value;
    newUnit.maneuver = document.getElementById('Unit_man').value;
    newUnit.strength = document.getElementById('Unit_str').value;
    newUnit.organization = document.getElementById('Unit_org').value;
    newUnit.discipline = document.getElementById('Unit_dis').value;
    newUnit.experience = document.getElementById('Unit_exp').value;
    console.log("New Unit:", newUnit);
    if(army_number==1){
        army1.push(newUnit);
        army1=mergeSort(army1);
    }
    else{
        army2.push(newUnit);
        army2=mergeSort(army2);
    }
    updateArmies(army_number);
  }

  function updateArmies(army_num) {
    let color;
    let armyReserveContainer;
    let which_army;
    if(army_num==1){
        armyReserveContainer = document.getElementById('army1_res');
        color='blue';
        which_army=army1;
    // Clear the container before updating
        armyReserveContainer.innerHTML = '';
    }
    else{
        armyReserveContainer = document.getElementById('army2_res');
        color='red';
        which_army=army2;
    // Clear the container before updating
        armyReserveContainer.innerHTML = '';
    }
    
    for (let i = 0; i < which_army.length; i++) {
      const unit = which_army[i];
      console.log("tring to print Unit type:", unit.unittype);
      const reserveButton = document.createElement('button');
      reserveButton.className = 'button reserve';
      reserveButton.style.borderRadius = '10%';
      reserveButton.style.backgroundColor = color;
      reserveButton.id = army1.length*(army_num-1) + i;
      reserveButton.onclick = function () {
        toggleReserves(reserveButton, unit);
    };//toggleReserves(this, which_unit)
      if (unit.unittype === "inf") {
        console.log("infantry");
        reserveButton.style.backgroundImage = 'url("img_files/classic_inf.png")';
      }
      else if (unit.unittype === "grd") {
        console.log("guard");
        reserveButton.style.backgroundImage = 'url("img_files/classic_grd.png")';
      }
      else if (unit.unittype === "cav") {
        console.log("cavalry");
        reserveButton.style.backgroundImage = 'url("img_files/classic_cav.png")';
      }
      else if (unit.unittype === "art") {
        console.log("artillery");
        reserveButton.style.backgroundImage = 'url("img_files/classic_arty.png")';
      }
      else if (unit.unittype === "eng") {
        console.log("engineer");
        reserveButton.style.backgroundImage = 'url("img_files/classic_eng.png")'; 
      }
      else if (unit.unittype === "grc") {
        console.log("g cav");
        reserveButton.style.backgroundImage = 'url("img_files/classic_gcav.png")';
      }
      else{//panic
        console.log("WHAT THE HELL?");
        return;
      }
      armyReserveContainer.appendChild(reserveButton);
    }
    
  }

function toggleReserves(button, unit) {
    wheretoplace = document.getElementById('display_stat');
    document.querySelectorAll('.button.reserve').forEach(function(btn) {
        if (btn !== button && btn.classList.contains('selected')) {
            btn.classList.remove('selected');
        }
    });
    wheretoplace.innerHTML = '';

    // toggle selection
    button.classList.toggle('selected');

    // Create a table for displaying unit stats
    const table = document.createElement('table');
    table.className = 'short_table'; 
    if (button.classList.contains('selected')) {
        // Create table rows and cells for each unit stat
        const properties = ['Name', 'Attack', 'Defence', 'Support', 'Maneuver', 'Strength', 'Organization', 'Discipline', 'Experience'];
        
        properties.forEach(property => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const propertyName = property.toLowerCase();
            cell1.textContent = property;
            cell2.textContent = unit[propertyName];
        });

        // Append the table to the button element
    wheretoplace.appendChild(table);
    }
    
}
