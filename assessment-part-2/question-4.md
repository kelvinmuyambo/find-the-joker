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

###2. OBSERVER
This design pattern defines a one-to-many dependency between objects so that when one object changes state, 
all its dependents are notified and updated automatically.
####EXAMPLE

```typescript

```


###3. ITERATOR
This design pattern provides a way to access the elements of an aggregate object 
sequentially without exposing its underlying representation.


```typescript

```
