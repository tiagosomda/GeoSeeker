
var la : int;
var lo : int;
var at : int;
var ha : int;
var counter : int;

function getLocation () {
    // First, check if user has location service enabled
    if (!Input.location.isEnabledByUser)
        return;

    // Start service before querying location
    Input.location.Start ();

    // Wait until service initializes
    var maxWait : int = 20;
    while (Input.location.status
           == LocationServiceStatus.Initializing && maxWait > 0) {
        yield WaitForSeconds (1);
        maxWait--;
    }

    // Service didn't initialize in 20 seconds
    if (maxWait < 1) {
        print ("Timed out");
        return;
    }

    // Connection has failed
    if (Input.location.status == LocationServiceStatus.Failed) {
        print ("Unable to determine device location");
        return;
    }
    // Access granted and location value could be retrieved
    else {
//        print ("Location: " + Input.location.lastData.latitude + " " +
//					            Input.location.lastData.longitude + " " +
//          					Input.location.lastData.altitude + " " +
//         						Input.location.lastData.horizontalAccuracy + " " +
//       						Input.location.lastData.timestamp);
          
    }

    // Stop service if there is no need to query location updates continuously
    la = Input.location.lastData.latitude;
    lo = Input.location.lastData.longitude;
    at = Input.location.lastData.altitude;
    ha = Input.location.lastData.horizontalAccuracy;
    Input.location.Stop ();

}

//function OnGUI() {

	//GUI.Label(new Rect(Screen.width/2 -100, Screen.height/2, Screen.width, 50), Input.location.lastData.latitude +" | "+ Input.location.lastData.longitude +" | "+ Input.location.lastData.altitude+ " | " + Input.location.lastData.horizontalAccuracy + " | " + Input.location.lastData.timestamp + " || " + counter);
	//if(GUI.Button (new Rect(0, (Screen.height/4)*3, Screen.width, 50),"Get Location")){getLocation();}
//}