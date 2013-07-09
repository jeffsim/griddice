// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
           
            if (app.sessionState.history)
                nav.history = app.sessionState.history;

            args.setPromise(WinJS.UI.processAll().then(function () {

                // initialize the settings pane
                GridDice.SettingsManager.initialize();

                // Initialize the audio manager
                GridDice.AudioMgr.initialize();

                // hook up the 'more game' appbar button handler
                $("#moreGamesCmd").click(function () {
                    if (Windows.ApplicationModel.IsBluesky) {
                        window.open("http://www.wanderlinggames.com");
                    }
                    else
                        Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri("ms-windows-store:SEARCH?query=Wanderling%20Games"));
                });

                // Show a "Settings" button in the appbar for users that aren't used to Win8 or don't have the ability to otherwise bring it up
                if (Windows.ApplicationModel.IsBluesky) {
                    $("#settingsCmd").click(function () {
                        var settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();
                        settingsPane.show();
                    });
                }

                // hook up our appbar bringer-upper.  This is here since web users don't know about the appbar (and possibly don't have a right-button anyways)
                $("#appbarButton").click(function () {
                    appbar.winControl.show();
                });

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
        Application.navigator.pageControl && Application.navigator.pageControl.oncheckpoint && Application.navigator.pageControl.oncheckpoint();
    };

    app.start();
})();
