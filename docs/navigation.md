# Navigation in the Braille Display Controller

This is a description on how to use the keyboard to navigate throughout the webpages on the Braille Display.

## Navigation and Selection

***Note:** Focusing an element gives you the option to then select it. Focusing a Text-to-speech(TTS)-enabled element will cause it to be read aloud, and selecting it will result in a TTS confirmation of the selection.*

- `f` - Focuses the previous element to the one currently in focus on the page. If no element is focused, then the first focused element on the page will be chosen.
- `j` - Focuses the next element to the one currently in focus on the page. If no element is focused, then the first focused element on the page will be chosen.
- `Space Bar` - The space bar will select the currently focused element. Pressing it a second time after selecting an element in games will result in a submission.

## Assistance

- `H` - Reads aloud a help message to the user using TTS.
- `C` - Opens up the display connection menu.
- `1` - Navigates back to the home page to select a new webpage.

## Multi-Line Display Navigation

If the display has text or elements that require more than 6 braille characters to be used, this will cause an overflow of the display. The first 6 characters will be displayed, and the display may then move forward or backward.

There are two modes of navigation, page navigation and line navigation. Page navigation allows for faster navigation through an entire line of text, but may be harder if the context of previous characters is necessary. Line navigation is a slower paced navigation, but it shifts the bottom 3 characters up to preserve context.

### Page Navigation

- `]` (Right square bracket) - Moves the text forward a whole page (6 characters)
- `[` (Left square bracket) - Moves the text backward a whole page (6 characters)

### Line Navigation

- `.` (Period or 'greater than' sign) - Moves the text forward a single line (3 characters).
- `,` (Comma or 'less than' sign) - Moves the text backward a single line (3 characters).

## Navigation Support Per Page

*Last updated 05/21/24.*

- [Shape and Number Controller](https://dtsivkovski.github.io/HapticResearch/controller.html)
  - [ ] - Focus and Selection
  - [x] - Assistance (TTS feature not enabled)
  - [x] - Multi-Line Display Navigation
- [Shape Game](https:https://dtsivkovski.github.io/HapticResearch/shapegame.html)
  - [x] - Focus and Selection
  - [x] - Assistance
  - [ ] - Multi-Line Display Navigation (*not necessary for shapes*)
- [Basic Math Game](https://dtsivkovski.github.io/HapticResearch/mathgame.html)
  - [x] - Focus and Selection
  - [x] - Assistance
  - [x] - Multi-Line Display Navigation
- [Fraction Game](https://dtsivkovski.github.io/HapticResearch/mathgame.html)
  - [x] - Focus and Selection
  - [x] - Assistance
  - [ ] - Multi-Line Display Navigation
