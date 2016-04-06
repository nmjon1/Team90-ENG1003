/*
 * Morse Code receiver app information:
 *
 * Function: messageFinished(): stops the capturing process
 *
 *     You can call this function to let the app know that the 
 *     end-of-transmission signal has been received.
 *
 * -------------------------------------------------------
 *
 * ID: messageField: id of the message text area
 *
 *     This will be a textarea element where you can display
 *     the recieved message for the user.
 * 
 * -------------------------------------------------------
 *
 * ID: restartButton: id of the Restart button
 *
 *     This is a button element.  When clicked this should 
 *     cause your app to reset its state and begin recieving
 *     a new message.
 *
 */


// ADD YOUR ADDITIONAL FUNCTIONS AND GLOBAL VARIABLES HERE
var blueLength, redLength;
function detectRedLength() {
    
}

function detectBlueLength() {
    
}
/*
 * This function is called once per unit of time with camera image data.
 * 
 * Input : Image Data. An array of integers representing a sequence of pixels.
 *         Each pixel is representing by four consecutive integer values for 
 *         the 'red', 'green', 'blue' and 'alpha' values.  See the assignment
 *         instructions for more details.
 * Output: You should return a boolean denoting whether or not the image is 
 *         an 'on' (red) signal.
 */
function decodeCameraImage(data) {
    var counter = 0;
    var meanData = [0, 0, 0, 0];
    //Adds data into one 4 value array
    for (i = 0; i < data.length; i++) {
        meanData[counter] += data[i];
        if (counter === 3) {
            counter = 0;
        } else {
            counter++;
        }
    }
    for (i = 0; i < meanData.length; i++) {
        meanData[i] = 4 * meanData[i] / (data.length + 1);
    }
    //If the camera is not producing the correct image shape (for example, using a different phone), then there will be many pixels where the value for RGBA is 0,0,0,0, which may skew the average to the point where the red may not be recognised. To remove this, the following loop is used, exploiting the fact that Alpha should always be 255 for the video image.
    for (i = 0; i < meanData.length; i++) {
        meanData[i] = meanData[i] * 255 / meanData[3];
    }
    
    //Numbers below to be tweeked when access to actual camera is obtained.
    if (meanData[0] <= 150 && meanData[1] <= 150 && meanData[2] >= 200) {
        console.log(false);
        return false;
    } else if (meanData[0] >= 200 && meanData[1] <= 150 && meanData[2] <= 150) {
        console.log(true);
        return true;
    } else {
        console.log("other");
        return false;
    }
}