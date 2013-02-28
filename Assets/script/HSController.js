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

//Add our URL
var addMissionUrl  = "http://localhost/unity_test/addlandmark.php?"; 
var getMissionUrl = "http://localhost/unity_test/getLandmark.php";    

// Secret Key matching on server-side script
private var secretKey = "mySecretKey"; 

var testingData : String = "Landmark 1\nLandmark 2\nLandmark 3\nLandmark 4\nLandmark 5\nLandmark 6\nLandmark 7\nLandmark 8\nLandmark 9\nLandmark 10";


function Start() {
    missionName = 'NNNN';
	latitude  = Random.Range(-100,100);
	longitude = Random.Range(-100,100);
	altitude  = Random.Range(-100,100);
	hAccuracy = Random.Range(-100,100);
    missionInfo = 'great place to be';
}
  
function postScore() {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.  
    var hash = Md5.Md5Sum(missionName + secretKey);
 
    var addMissionUrl = addMissionUrl   + "name="      	+ WWW.EscapeURL(missionName) 
    									+ "&latitude=" 	+ latitude 
    									+ "&longitude=" + longitude
    									+ "&altitude=" 	+ altitude
    									+ "&horizontalAccuracy=" + hAccuracy
                                    	+ "&landmarkInfo=" 		 + missionInfo;
    									//+ "&hash=" + hash;
 
    // Post the URL to the site and create a download object to get the result.
    hs_post = WWW(addMissionUrl);
    //hs_post = WWW("http://localhost/unity_test/addlandmark.php?name=NCSU&latitude=78.2&longitude=77.6&altitude=33.4&horizontalAccuracy=10.2");
    yield hs_post; // Wait until the download is done
    if(hs_post.error) {
        print("There was an error posting the high score: " + hs_post.error);
    } else {
        print("No error: " + hs_post.text);
    }
}   
 
// Get the scores from the MySQL DB to display in a GUIText.
function getLandmark() {
    hs_get = WWW(getMissionUrl);
    yield hs_get;
 
    if(hs_get.error) {
    	print("There was an error getting the high score: " + hs_get.error);
    	missionText = testingData;
    } else {
        missionText = hs_get.text;
       // print(hs_get.text); // this is a GUIText that will display the scores in game.
    }
}

function test() {
	print("Testing Function");
}