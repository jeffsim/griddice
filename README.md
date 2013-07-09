# [Grid Dice] (http://griddice.bluesky.io)
========

## About Grid Dice
Grid Dice is a simple game created to demonstrate the ability to publish WinJS games on the web using [Bluesky.io] (http://bluesky.io).  It's not a *great* game, but that's not the point (grin).  Grid Dice uses all of the following features on WinJS in order to show them working using Bluesky on the web:

- WinJS Navigation and application model.
- Databinding and Templates
- Grouped Listviews
- Binding converters
- ApplicationData and localSettings
- Appbar
- Dynamic resizing of page for web; also fully functional snappedview in win8
- ... and lots more.

## Where to try it out:
Places you can see GridDice in action:
- Published on the Windows 8 store ([link] (http://apps.microsoft.com/windows/en-us/app/grid-dice/7b2ad4fc-5f78-4d5f-8267-82fa8fdf2770))
- Published on the Web: [griddice.bluesky.io] (griddice.bluesky.io)
- Published in the Chrome store: ([link] (https://chrome.google.com/webstore/detail/grid-dice/dcillpbbchbdjenomiiaollcfbofojbi?hl=en&gl=US)]
- Published on Facebook app: (link coming soon)

## How do I build it and try it locally?
This has been tested using Visual Studio 2012 on Windows 8.  I don't know if it works on VS2010 or Win8.1 yet, so if either of those is you, then proceed cautiously (and let me know if it works!).

Load GridDice.sln into VS2012.  You'll notice that there are two projects within the solution - one is for Windows 8 and the other is for the web.  To run either the web or win8 project, right-click on the appropriate project, select "Set as Startup project", and hit F5.  

Both the Web and Win8 projects reference the same files (one codebase), so changing a file for one project will change it for the other as well.  The only difference is in the bootstrap page; default.html for win8 and defaultweb.html for bluesky.  This is so that the correct winjs/bluesky js files can be referenced.  Other than that, there's just one codebase for both.

Since the point of this game is to demonstrate what Bluesky can do, the game is written using DOM manipulation rather than Canvas (e.g. you can't demonstrate a WinJS grouped listview using Canvas).

## What's left to do?
There are a few remaining TODOs:
* Audio may not work on win8; I'm suddenly getting a not implemented error on my machine when doing new Audio() - not sure if that's just my machine or not
* Snapped view (and very thin view for web app) isn't centered correctly

##Contact
- Email: jeffsim@bluesky.io (Jeff Simon)
- Follow: http://twitter.com/blueskydotio