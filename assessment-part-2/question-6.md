##GAME LOOP
A game loop runs continuously during gameplay. Each turn of the loop, it processes user input without blocking, updates the game state, and renders the game. It tracks the passage of time to control the rate of gameplay.

###EXAMPLE CODE
```typescript
while (gameRunning)
{
  getUserInput();
  processUserInput()
  updateGameValues();
  renderGameChanges();
  //run again in a continuous loop as long as game is running
}
```

##FPS (Frames Per Second)
A "frame" is usually a single image in the series of images presented to your screen rapidly so as to give the illusion 
of motion in your game, and so the terms generally refer to how many of those images your game can simulate and 
produce within one second.

FPS is often used as a crude measurement of performance, but it's important to remember that 
it's a non-linear measurement: the difference between 30 and 60 FPS is much larger than 60 and 90 FPS.
