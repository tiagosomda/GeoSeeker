//Code modified from: 
//http://wiki.unity3d.com/index.php?title=Server_Side_Highscores#JavaScript_-_HSController.js

// DB data variables
var missionName : String;
var latitude  : double;
var longitude : double;
var altitude  : double;
var hAccuracy : double;
var missionInfo : String;
var missionText : String[];
var server_get : WWW;
var server_post: WWW;
var currentMissionDetails : String[];
var userInfo : String;
var leaderboardList : String[];
var completedMissions : String;

//Add our URL
private var addMissionUrl : String;
private var getMissionUrl : String;
private var deleteMissionUrl : String;
private var getMissionDetailsUrl : String;
private var completeMissionUrl : String;
private var getUserInfoUrl : String;
private var loginUrl : String;
private var leaderboardUrl : String;
private var createUserUrl : String;
private var completedMissionsUrl : String;
private var dominateLandmarkUrl : String;

// Secret Key matching on server-side script
private var secretKey = "mySecretKey"; 

var testingData : String = "Landmark 1\nLandmark 2\nLandmark 3\nLandmark 4\nLandmark 5\nLandmark 6\nLandmark 7\nLandmark 8\nLandmark 9\nLandmark 10";


function Awake() {

	userInfo = "";

	addMissionUrl  = "http://www.tiagosomda.com/geoseeker/addLandmark.php?"; 
	getMissionUrl = "http://www.tiagosomda.com/geoseeker/getLandmark.php";
	deleteMissionUrl =   "http://www.tiagosomda.com/geoseeker/deleteLandmark.php?"; 
	getMissionDetailsUrl =   "http://www.tiagosomda.com/geoseeker/getMissionDetails.php?";
	completeMissionUrl = "http://www.tiagosomda.com/geoseeker/completeMission.php?";
	getUserInfoUrl = "http://www.tiagosomda.com/geoseeker/getUserInformation.php?";
	loginUrl = "http://www.tiagosomda.com/geoseeker/userLogin.php?";
	leaderboardUrl = "http://www.tiagosomda.com/geoseeker/getPlayersOrderedByPoints.php";
	createUserUrl = "http://www.tiagosomda.com/geoseeker/userRegister.php?";
	completedMissionsUrl = "http://www.tiagosomda.com/geoseeker/getUserCompletedMissions.php?";
	dominateLandmarkUrl = "http://www.tiagosomda.com/geoseeker/dominateLandmark.php?";
	
    missionName = 'NNNN';
	latitude  = Random.Range(-100,100);
	longitude = Random.Range(-100,100);
	altitude  = Random.Range(-100,100);
	hAccuracy = Random.Range(-100,100);
    missionInfo = 'great place to be';
}
  
function createMission(n : String, d : String, t : String, lat : double, longi : double, alti : double, hAccur : double) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    //Supply it with a string representing the players name and the players score.  
    //var hash = Md5.Md5Sum(missionName + secretKey);
 
    var addMissionUrl = addMissionUrl   + "name="      	+ WWW.EscapeURL(n) 
    									+ "&latitude=" 	+ lat 
    									+ "&longitude=" + longi
    									+ "&altitude=" 	+ alti
    									+ "&horizontalAccuracy=" + hAccur
                                    	+ "&landmarkInfo=" 		 + WWW.EscapeURL(d);
    									//+ "&hash=" + hash;
 
    // Post the URL to the site and create a download object to get the result.
    server_post = WWW(addMissionUrl);
    //server_post = WWW("http://localhost/unity_test/addlandmark.php?name=NCSU&latitude=78.2&longitude=77.6&altitude=33.4&horizontalAccuracy=10.2");
    yield server_post; // Wait until the download is done
    if(server_post.error) {
        print("There was an error posting the high score: " + server_post.error);
        print(addMissionUrl);
    } else {
        print("Added Landmark " + server_post.text);
    }
}   
 
function getMissions() {
	return missionText;
}

function updateMissions() {
    server_get = WWW(getMissionUrl);
    yield server_get;
 
    if(server_get.error) {
    	print("There was an error getting the missions: " + server_get.error + " ("+getMissionUrl+")");
    	missionText = testingData.Split('\n'[0]);
    } else {
       missionText = server_get.text.Split('\n'[0]);
    }
}

function getCompletedMissions() {
	var completedMissionsUrl = completedMissionsUrl+"id="+PlayerPrefs.GetString("PlayerID");
	var server_get = WWW(completedMissionsUrl);
	yield server_get;
	
	if(server_get.error) {
    	print("There was an error getting the missions: " + server_get.error + " ("+completedMissionsUrl+")");
    } else {
       var temp = server_get.text.Split(','[0]);
       var size = temp.Length;
       for(var i = 0; i < size; i++) {
       		PlayerPrefs.SetString(PlayerPrefs.GetString("PlayerID")+"Mission"+temp[i],"completed");
       }
    }
}

function dominateLandmark(missionId : String) {
	var dominateLandmarkUrl = dominateLandmarkUrl + "userId="+PlayerPrefs.GetString("PlayerID") + "&landmarkId="+missionId;
	var url_request = WWW(dominateLandmarkUrl);

	yield url_request;
	
	if(url_request.error) {
        print("There was an error deleting the mission: " + url_request.error);
        print(dominateLandmarkUrl);
    } else {
//        print("No error: " + url_request.text);
        //print(dominateLandmarkUrl);
    }
}

function deleteMission(n : String) {
	var deleteMissionUrl = deleteMissionUrl + "name="+ WWW.EscapeURL(n);
	
	server_post = WWW(deleteMissionUrl);
    //server_post = WWW("http://localhost/unity_test/addlandmark.php?name=NCSU&latitude=78.2&longitude=77.6&altitude=33.4&horizontalAccuracy=10.2");
    yield server_post; // Wait until the download is done
    if(server_post.error) {
        print("There was an error deleting the mission: " + server_post.error);
        print(addMissionUrl);
    } else {
        print("No error: " + server_post.text);
    }
	
}

function getMissionDetails(id : String) {
	var getMissionDetailsUrl = getMissionDetailsUrl + "id="+id;
	server_post = WWW(getMissionDetailsUrl);
	
	yield server_post;
	
	if(server_post.error) {
        print("There was an error deleting the mission: " + server_post.error);
        print(server_post.text);
    } else {
        currentMissionDetails = server_post.text.Split(','[0]);
    }

}

function completeMission(userId : String, missionId : String){
	//Sets local list of missions to completed
	PlayerPrefs.SetString("Mission"+missionId,"completed");
	//Creates URL to update list of completed missions by a user on the server
	var completeMissionUrl = completeMissionUrl + "userId="+userId+"&missionId="+missionId;
	server_post = WWW(completeMissionUrl);
	
	yield server_post;
	
	if(server_post.error) {
        print("There was an error compeleting the mission: " + server_post.error);
    } else {
       getUserInfo();
    }
  
 	//Updates local list of missions to completed - might not be necessary.
    getCompletedMissions();
    
}

function getUserInfo(){
	var getUserInfoUrl = getUserInfoUrl + "id="+PlayerPrefs.GetString("PlayerID");
	server_post = WWW(getUserInfoUrl);
	
	yield server_post;
	
	if(server_post.error) {
        print("There was an error getting the user info: " + server_post.error);
    } else {
  		var temp = server_post.text.Split(','[0]);
	    PlayerPrefs.SetString("PlayerID", temp[0]);
    	PlayerPrefs.SetString("PlayerName", temp[1]);
    	PlayerPrefs.SetString("PlayerPoints", temp[2]);
    	PlayerPrefs.SetString("PlayerCompleted", temp[3]);
    }
}

function login(username : String, password : String) {
	var loginUrl = loginUrl + "username="+ username +"&password="+password;
	
	server_post = WWW(loginUrl);
	
	yield server_post;
	
	if(server_post.error) {
        print("There was an error logging: " + server_post.error);
    } else {
    	if(server_post.text.Contains("Error")){
    		PlayerPrefs.SetString("PlayerID","Error");
    	} else {
    	    var temp = server_post.text.Split(','[0]);
	        PlayerPrefs.SetString("PlayerID", temp[0]);
    	    PlayerPrefs.SetString("PlayerName", temp[1]);
    	    PlayerPrefs.SetString("PlayerPoints", temp[2]);
    	    PlayerPrefs.SetString("PlayerCompleted", temp[3]);
    	}
    }
}

function createUser(username : String, password : String, email : String) {
	var createUserUrl = createUserUrl + "username="+ username +"&password="+password+"&email="+email;
	
	server_post = WWW(createUserUrl);
	
	yield server_post;
	
	if(server_post.error) {
        print("There was an error creating the user: " + server_post.error);
    } else {
    	var temp = server_post.text.Split(','[0]);
	    PlayerPrefs.SetString("PlayerID", temp[0]);
    	PlayerPrefs.SetString("PlayerName", temp[1]);
    	PlayerPrefs.SetString("PlayerPoints", temp[2]);
    	if(temp.Length == 4)
    		PlayerPrefs.SetString("PlayerCompleted", temp[3]);
    }
}

function getLeaderboardInfo() {

	server_post = WWW(leaderboardUrl);
	
	yield server_post;
	
	if(server_post.error) {
        print("There was an error getting the leaderboard: " + server_post.error);
    } else {
    	leaderboardList = server_post.text.Split('\n'[0]);
    	var size = leaderboardList.Length;
    	var i = 0;
    	for (i = 0; i < size-1; i++) {
    		var info = leaderboardList[i].Split(','[0]);
    		PlayerPrefs.SetString("RankName"+i, info[0]);
    		PlayerPrefs.SetString("RankPoints"+i, info[1]);
    	}
    }
}
