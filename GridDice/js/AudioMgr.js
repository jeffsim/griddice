(function () {
    "use strict";

    WinJS.Namespace.define("GridDice", {

        // AudioMgr object definition
        AudioMgr: {
            initialize: function () {

                // Determine the format that the current environment supports
                // near as I can tell, it's:
                //      Safari, Chrome, IE9+:   MP3
                //      Firefox, Opera:         OGG
                //      Win8:                   Just about anything
                var format = null;
                // TODO (HMM): For some reason new Audio() is throwing a NotImplemented exception for me on Win8 after reinstalling my dev machine.
                //             I'm not sure why yet, so I'm wrapping this in a try/catch just in case.
                try {
                    var audio = new Audio("audio/mp3/buttonClick.mp3");
                    if (audio.canPlayType("audio/mpeg") == "probably" || audio.canPlayType("audio/mpeg") == "maybe")
                        format = "mp3";
                    else if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe")
                        format = "ogg";
                } catch (ex)
                {
                }
                this.audioEnabled = format != null;

                if (this.audioEnabled) {

                    GridDice.sounds.buttonClick = new Audio("audio/" + format + "/buttonClick." + format);
                    GridDice.sounds.slideDown = new Audio("audio/" + format + "/slideDown." + format);
                    GridDice.sounds.slideUp = new Audio("audio/" + format + "/slideUp." + format);
                    GridDice.sounds.scoreCategoryClicked = new Audio("audio/" + format + "/scoreCategoryClicked." + format);
                    GridDice.sounds.bonusAwarded = new Audio("audio/" + format + "/bonusAwarded." + format);
                    GridDice.sounds.tilesRemoved = new Audio("audio/" + format + "/tilesRemoved." + format);

                    GridDice.sounds.die = [];
                    GridDice.sounds.die[0] = new Audio("audio/" + format + "/dieC." + format);
                    GridDice.sounds.die[1] = new Audio("audio/" + format + "/dieD." + format);
                    GridDice.sounds.die[2] = new Audio("audio/" + format + "/dieE." + format);
                    GridDice.sounds.die[3] = new Audio("audio/" + format + "/dieF." + format);
                    GridDice.sounds.die[4] = new Audio("audio/" + format + "/dieG." + format);

                    // Tweak volume of some of the sound effects that are too loud
                    // TODO (CLEANUP): remaster audio source files.
                    GridDice.sounds.tilesRemoved.volume = .5;
                    GridDice.sounds.die.forEach(function (die) {
                        die.volume = .25;
                    });
                }
            },

            play: function (soundEffect) {
                if (this.audioEnabled)
                    soundEffect.play();
            }
        },

        sounds: {}
    });
})();
