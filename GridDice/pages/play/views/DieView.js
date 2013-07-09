"use strict";

WinJS.Namespace.define("GridDice", {

    // DieView object definition
    DieView: WinJS.Class.define(

        // DieView constructor
        function (dieModel, $gameBoardDiv) {

            // Keep track of the model which we are displaying
            this.model = dieModel;

            this.$gameBoardDiv = $gameBoardDiv;

            // Listen for changes to our DieModel
            this.model.addEventListener("faceChanged", this.initializeVisual.bind(this));
            this.model.addEventListener("addedToStreak", this.addedToStreak.bind(this));
            this.model.addEventListener("removedFromStreak", this.removedFromStreak.bind(this));
            this.model.addEventListener("removedFromBoard", this.removedFromBoard.bind(this));
            this.model.addEventListener("shiftedDown", this.shiftedDown.bind(this));
            this.model.addEventListener("slideInFrom", this.slideInFrom.bind(this));
        },

        // DieView instance members

        {
            addedToStreak: function () {
                this.$visual.css("background-image", "url('/images/diceLit.png')");
                if (GridDice.AudioMgr.audioEnabled)
                    GridDice.AudioMgr.play(GridDice.sounds.die[this.model.gameBoardModel.streakDice.length - 1]);
                // add wiggle animation
                var startX = parseInt(this.$visual.css("left"));
                var startY = parseInt(this.$visual.css("top"));
                var that = this;
                this.wiggleAnim = setInterval(function () {
                    if (!that.$visual)
                        return;
                    that.$visual.css("left", (startX + Math.floor(Math.random() * 4) - 2) + "px");
                    that.$visual.css("top", (startY + Math.floor(Math.random() * 4) - 2) + "px");
                }, 100);
            },

            removedFromStreak: function () {
                this.$visual.css("background-image", "url('/images/dice.png')");

                // remove wiggle animation
                this.clearWiggle();
            },

            clearWiggle: function () {
                if (!this.wiggleAnim)
                    return;
                clearInterval(this.wiggleAnim);

                // Restore original position
                if (this.$visual) {
                    this.$visual.css("left", (this.model.x * 85 + 5) + "px");
                    this.$visual.css("top", (this.model.y * 85 + 5) + "px");
                }
                this.wiggleAnim = null;
            },

            removedFromBoard: function (eventInfo) {

                var doAnim = eventInfo.detail.doAnim;
                var index = eventInfo.detail.index;
                var $oldVisual = this.$visual;
                this.$visual = null;

                if (doAnim) {
                    var that = this;
                    // Todo: add slight shrink animation too
                    setTimeout(function () {
                        $oldVisual.animate({
                            opacity: 0,
                            scale: 1.1
                        }, 750, function () {
                            $oldVisual.remove();
                            that.clearWiggle();
                        });
                    }, index * 100);
                } else {
                    $oldVisual.remove();
                    this.clearWiggle();
                }
            },

            shiftedDown: function (eventInfo) {
                var numToShift = eventInfo.detail.amount;
                var that = this;
                this.animating = true;
                this.$visual.delay(500).animate({ top: "+=" + (numToShift * 85) + "px" }, 250 * numToShift, function () {
                    that.animating = false;
                });
            },

            slideInFrom: function (eventInfo) {
                var startSlot = eventInfo.detail.startSlot;
                var curTop = parseInt(this.$visual.css("top"));
                var that = this;
                this.animating = true;
                this.$visual.css("top", (curTop + startSlot * 85) + "px");
                this.$visual.delay(500).animate({ top: "+=" + (-startSlot * 85) + "px" }, 250 * (-startSlot), function () {
                    that.animating = false;
                });
            },

            initializeVisual: function () {

                // Create our visual using the 'diceTemplate' template
                var $diceDiv = $(".diceTemplate").clone(true);
                var that = this;
                return WinJS.Binding.processAll($diceDiv[0], this.model).then(function () {

                    // Populate this card's visual with the template that we just bound to this card's model
                    that.$visual = $diceDiv.children();

                    // Add the card's visual to the gameboard and place it
                    that.$visual.css("left", (that.model.x * 85 + 5) + "px");
                    that.$visual.css("top", (that.model.y * 85 + 5) + "px");
                    that.$gameBoardDiv.append(that.$visual);

                    // Initialize input handlers; pass events on to our model
                    // NOTE: For simplicity, we're just doing MV here instead of MVC.

                    that.$visual.on("mousedown", function (event) {

                        // We need to prevent the default event so that we can drag across cards
                        event.preventDefault();

                        // inform our model that we were pressed
                        if (that.$visual && !that.animating)
                            that.model.cursorPressed();
                    });

                    that.$visual.on("mouseup", function (event) {

                        // inform our controller that the cursor entered the card
                        event.preventDefault();
                        if (that.$visual)
                            that.model.cursorReleased();
                    });

                    that.$visual.on("mouseenter", function (event) {

                        // inform our controller that the cursor entered the card
                        if (that.$visual && !that.animating)
                            that.model.cursorEntered();
                    });

                    that.$visual.on("mouseleave", function (event) {

                        // inform our controller that the cursor left the card
                        if (that.$visual && !that.animating)
                            that.model.cursorExited();
                    });
                });
            },

            model: null
        })
});

// FaceConverter
WinJS.Namespace.define("GridDice", {

    FaceConverter: WinJS.Binding.converter(function (face) {

        return (-80 * (face - 1)) + "px 0px";
        return "-80px 0px";
        switch (face) {
            case 1: return ".";
            case 2: return "..";
            default:
                return face;
        }
    })
});