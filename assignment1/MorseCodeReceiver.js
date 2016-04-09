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
var signal_history = []; // Stores the entire history of the signal as an array. An on signal is stored as true, and off as false.
var current_element = ''; // Stores the dots and dashes in the current element. A signifies a dot, B signifies a dash
var lookup=
 +{AB:"a", BAAA: "b", BABA:"c", BAA:"d",A:"e", AABA:"f", 
 +BBA:"g", AAAA:"h", AA: "i", ABBB:"j", BAB: "k", ABAA:"l", 
 +BB:"m", BA:"n", BBB:"o", ABBA:"p", BBAB:"q", ABA:"r", AAA:"s", 
 +B:"t", AAB:"u", AAAB:"v", ABB:"w", BAAB:"x", BABB:"y", BBAA:"z", 
 +BBBB:"0", ABBBB:"1", AABBB:"2", AAABB:"3", AAAAB:"4", AAAAA:"5", 
 +BAAAA:"6", BBAAA:"7", BBBAA:"8", BBBBA:"9", BABBA:"(", BABBAB:")", 
 +ABAABA:'“', BAAAB: "=", ABBBBA: "'", BAABA:'/', ABABA:"+", BBBAAA:":", 
 +ABABAB:".", BBAABB:",", AABBAA:"?", BAAAAB:"-", ABBABA:"@", AAABAAB:"$", 
 +AABBAB:"_", BABABB:"!", ABAB:"\n", AAABAB:"End transmission"};
// This is the object which is used to convert dots (A) and dashes (A) into characters

document.getElementById("restartButton").onclick = restartButtonClicked;
function restartButtonClicked()
{
    document.getElementById('messageField').innerHTML = "";
    signal_history = [];
    current_element = '';
}

function compare_arrays(a,b) {
    /* A simple function that compares two arrays. Used to check the signal history.
     * Inputs: a and b, two arrays
     * Outputs: true if each element of a is the same as its counterpart in array b, false otherwise
     */

    if (a === b) {return true} // If a and b both point to the same array object they must be the same.
    if (a.length != b.length) {return false} // If a and b are of differing lenth they can't be the same.

    for (i = 0; i < a.length; i++) {
        // We loop througgh each element, checking that the elements are not different. Once this clears we can return true.
        if (a[i] != b[i]) {
            return false
        }
    }

    return true
}

function check_history (signal) {
    /* A function to check the history of the signals and build the appropriate message in the output area.
     * This is called everytime a new signal is read.
     * Inputs: A new signal
     * Outputs: None
     */

    signal_history.push(signal); // Updates the signal history with the new signal.

    if (compare_arrays(signal_history.slice(-4), [true, true, true, false])) {
        // If there are 3 or more ON signals followed by an OFF, we register a dash.
        current_element += 'B'
    } else if (compare_arrays(signal_history.slice(-2), [true, false])) {
        // If there is only 1 ON signal followed by an OFF, we register a dot.
        current_element += 'A'
    } else if (compare_arrays(signal_history.slice(-7),[false, false, false, false, false, false, false])){
        //  If there are 7 or more OFF signals in a row, we start a new word and add a space character to the message.
        document.getElementById('messageField').innerHTML += ' ';
        current_element = '';
    } else if (compare_arrays(signal_history.slice(-3),[false, false, false])) {
        // If there are 3 - 7 OFF signals in a row we add a character to the message and start a new one.
        if (lookup[current_element] == "End transmission") {
            // We end the transmission if the 'End transmission' character occurs.
            messageFinished()
        } else if (lookup[current_element] != undefined) {
            // Otherwise, we simply add the new character.
            document.getElementById('messageField').innerHTML += lookup[current_element]
        }
        current_element = ''
    }
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
        check_history(false);
        return false;
    } else if (meanData[0] >= 200 && meanData[1] <= 150 && meanData[2] <= 150) {
        console.log(true);
        check_history(true);
        return true;
    } else {
        console.log("other");
        return false;
    }
}
