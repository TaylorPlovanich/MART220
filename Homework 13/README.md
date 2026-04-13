For this project I went with a sword model as the centerpiece because I thought it would look cool spinning in the middle of the scene. I built five shapes around it that orbit at different speeds which gave it kind of a solar system feel that I liked.

The hardest part for me was wrapping my head around push() and pop(). I kept running into issues where everything was rotating together and looked like a mess. Once I understood that those functions basically give each object its own little bubble of transformations, it started making a lot more sense.

I used createGraphics() for the textures instead of loading actual image files, which ended up being simpler than I expected. Each shape gets its own color so they're easy to tell apart as they move around.
Tools that helped me:

p5.js documentation for looking stuff up when I got stuck
Sketchfab for finding the sword model
VS Code + Live Server to preview everything locally
Claude (AI) for helping me understand concepts like how normalize works and why transformations stack the way they do in WEBGL