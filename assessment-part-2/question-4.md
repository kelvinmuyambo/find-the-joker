##DESIGN PATTERNS FOR GAME DEV

###1. SINGLETON
Is a software design pattern that restricts the instantiation of a class to one "single" instance. 
This is useful when exactly one object is needed to coordinate actions across the system
#### EXAMPLE - Only need One Soldier Object in Game
````typescript
export class Soldier {
    static counter: number = 0;
    static soldier: Soldier = null;
    static getSoldier: Soldier = () => {
        // check if soldier has already been created
        if (Soldier.soldier == null)
            // create a soldier if it has not been created
            Soldier.soldier = new Soldier();
        return Soldier.soldier;
    }

    private constructor() {
    }
}
````



