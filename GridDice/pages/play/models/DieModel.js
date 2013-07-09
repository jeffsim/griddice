"use strict";

WinJS.Namespace.define("GridDice", {

    // DieModel object definition
    DieModel: WinJS.Class.define(

        // DieModel constructor
        function (gameBoardModel, x, y) {

            this.gameBoardModel = gameBoardModel;
            this.x = x;
            this.y = y;
        },

        // DieModel instance members
        {
            setTo: function (dieFace) {

                this.face = dieFace;

                // Trigger a change event for anything that's listening for changes to this model
                this.dispatchEvent("faceChanged");
            },

            // TODO: Move these to a DieController class?
            cursorPressed: function () {

                this.gameBoardModel.cursorPressedOverDie(this);
            },

            cursorReleased: function () {

                this.gameBoardModel.cursorReleasedOverDie(this);
            },

            cursorEntered: function () {

                this.gameBoardModel.cursorEnteredDie(this);
            },

            cursorExited: function () {

                this.gameBoardModel.cursorExitedDie(this);
            },

            addToStreak: function () {
                this.dispatchEvent("addedToStreak");
            },

            removeFromStreak: function () {
                this.dispatchEvent("removedFromStreak");
            },

            removeFromBoard: function (eventInfo) {
                this.dispatchEvent("removedFromBoard", eventInfo);
            },

            shiftDown: function(slotsToShift) {
                this.y += slotsToShift;
                this.dispatchEvent("shiftedDown", {amount: slotsToShift});
            },
            slideInFrom: function (startSlot) {
                this.dispatchEvent("slideInFrom", { startSlot: startSlot });
            },
            face: 0,
        })
});

WinJS.Class.mix(GridDice.DieModel, WinJS.Utilities.eventMixin);
