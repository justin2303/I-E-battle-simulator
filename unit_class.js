class battle_unit{
    constructor(){
        this._unittype="";
        this._name=null;
        this._attack = 0;
        this._defence=0;
        this._support=0;
        this._maneuver=0;
        this._strength=0;
        this._organization=0;
        this._discipline=0;
        this._experience=0;
        this._coord=-1;
    }
    set unittype(value) {
        this._unittype = value;
    }
    set name(value) {
        this._name = value;
    }
    set attack(value) {
        this._attack = value;
    }
    set defence(value) {
        this._defence = value;
    }
    set support(value) {
        this._support = value;
    }
    set maneuver(value) {
        this._maneuver = value;
    }
    set strength(value) {
        this._strength = value;
    }
    set organization(value) {
        this._organization = value;
    }
    set discipline(value) {
        this._discipline = value;
    }
    set experience(value) {
        this._experience = value;
    }
    set coord(value) {
      this._coord= value;
  }

    get unittype(){
        return this._unittype;
    }

    get name() {
        return this._name;
      }
    
      get attack() {
        return this._attack;
      }
    
      get defence() {
        return this._defence;
      }
    
      get support() {
        return this._support;
      }
    
      get maneuver() {
        return this._maneuver;
      }
      get strength() {
        return this._strength;
      }
    
      get organization() {
        return this._organization;
      }
    
      get discipline() {
        return this._discipline;
      }
    
      get experience() {
        return this._experience;    
      }

      get coord() {
        return this._coord;    
    }
      

}