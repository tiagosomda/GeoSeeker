//Code modified from: 
//http://wiki.unity3d.com/index.php?title=Server_Side_Highscores#JavaScript_-_HSController.js

// DB data variables
var missionName : String;
var latitude  : double;
var longitude : double;
var altitude  : double;
var hAccuracy : double;
var missionInfo : String; //BAD NAME
var missionText = "";
var hs_get : WWW;
var hs_post: WWW;
var currentMissionDetails : String;

//Add our URL
var addMissionUrl : String;
var getMissionUrl : String;
var deleteMissionUrl : String;
var getMissionDetailsUrl : String;

// Secret Key matching on server-side script
private var secretKey = "mySecretKey"; 

var testingData : String = "Landmark 1\nLandmark 2\nLandmark 3\nLandmark 4\nLandmark 5\nLandmark 6\nLandmark 7\nLandmark 8\nLandmark 9\nLandmark 10";


function Start() {

	addMissionUrl  = "http://www.tiagosomda.com/geoseeker/addLandmark.php?"; 
	getMissionUrl = "http://www.tiagosomda.com/geoseeker/getLandmark.php";
	deleteMissionUrl =   "http://www.tiagosomda.com/geoseeker/deleteLandmark.php?"; 
	getMissionDetailsUrl =   "http://www.tiagosomda.com/geoseeker/getMissionDetails.php?"; 

    missionName = 'NNNN';
	latitude  = Random.Range(-100,100);
	longitude = Random.Range(-100,100);
	altitude  = Random.Range(-100,100);
	hAccuracy = Random.Range(-100,100);
    missionInfo = 'great place to be';
}
  
function createMission(n : String, d : String, t : String, lat : double, longi : double, alti : double, hAccur : double) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.  
    var hash = Md5.Md5Sum(missionName + secretKey);
 
    var addMissionUrl = addMissionUrl   + "name="      	+ WWW.EscapeURL(n) 
    									+ "&latitude=" 	+ lat 
    									+ "&longitude=" + longi
    									+ "&altitude=" 	+ alti
    									+ "&horizontalAccuracy=" + hAccur
                                    	+ "&landmarkInfo=" 		 + WWW.EscapeURL(d);
    									//+ "&hash=" + hash;
 
    // Post the URL to the site and create a download object to get the result.
    hs_post = WWW(addMissionUrl);
    //hs_post = WWW("http://localhost/unity_test/addlandmark.php?name=NCSU&latitude=78.2&longitude=77.6&altitude=33.4&horizontalAccuracy=10.2");
    yield hs_post; // Wait until the download is done
    if(hs_post.error) {
        print("There was an error posting the high score: " + hs_post.error);
        print(addMissionUrl);
    } else {
        print("No error: " + hs_post.text);
    }
}   
 
// Get the scores from the MySQL DB to display in a GUIText.
function updateMissions() {
    hs_get = WWW(getMissionUrl);
    yield hs_get;
 
    if(hs_get.error) {
    	print("There was an error getting the high score: " + hs_get.error);
    	missionText = testingData;
    } else {
       missionText = hs_get.text;
       //print(missionText); // this is a GUIText that will display the scores in game.
    }
}

function getMissions() {
	return missionText;
}

function deleteMission(n : String) {
	var deleteMissionUrl = deleteMissionUrl + "name="+ WWW.EscapeURL(n);
	
	hs_post = WWW(deleteMissionUrl);
    //hs_post = WWW("http://localhost/unity_test/addlandmark.php?name=NCSU&latitude=78.2&longitude=77.6&altitude=33.4&horizontalAccuracy=10.2");
    yield hs_post; // Wait until the download is done
    if(hs_post.error) {
        print("There was an error deleting the mission: " + hs_post.error);
        print(addMissionUrl);
    } else {
        print("No error: " + hs_post.text);
    }
	
}

function getMissionDetails(id : String) {
	var getMissionDetailsUrl = getMissionDetailsUrl + "id="+id;
	hs_post = WWW(getMissionDetailsUrl);
	
	yield hs_post;
	
	if(hs_post.error) {
        print("There was an error deleting the mission: " + hs_post.error);
        print(hs_post.text);
    } else {
        currentMissionDetails = hs_post.text;
    }

}