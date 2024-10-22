# MotionCanvas
In MotionCanvas, you can set a motion threshold to determine when to trigger specific JavaScript actions. When the detected movement exceeds this threshold, you can execute functions. For this sample, it is to used the Javascript to trigger video play/stop/pause.

Note: 
1. It cannot be executed without webcam/external camera access.
2. It is to be executed in a chrome-kiosk mode


############################################################################
There are 2 different options/types:
Option 1 = video looping 
Option 2 = logo will be shown, if threshold is reached, will play the video.

To change option: 
1. open script.js file
2. on line 3 
    var type = 2;
    change type = 1 for option 1, and type = 2 for option 2.
