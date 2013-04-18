#pragma strict

var screen : ScreenController;
var server : ServerController;
var location : LocationController;

var cameraFeed : GameObject;
var exitScreen : GameObject;
var googleMap : LandmarkGoogleMap;
var completedSound : AudioClip;
var dominateSound : AudioClip;

enum lndmrksPage { viewLandmarks, createLandmark, viewLandmark}
var currentPage : lndmrksPage;

private var newMissionName : String;
private var newMissionDescriptions : String;
private var newMissionTags : String;

private var viewingLandmarkIndex : int;
private var lastDistance : double;

public var 	landmarkPicture : Texture;
public var  googleMapPicture : Texture;

public var  webcamTexture : WebCamTexture;
public var  landmarkPicture_pre : Texture;
public var  landmarkPicture_post : Texture;
public var 	pictureTaken = false;


// Internal variables for managing touches and drags
private var selected :int = -1;
private var scrollVelocity :float = 0f;
private var timeTouchPhaseEnded = 0f;
private var previousDelta :float = 0f;
private var inertiaDuration :float = 0.5f;

private var scrollPosition = Vector2.zero; ;

// size of the window and scrollable list
private var numRows : int;
private var rowSize : Vector2;
private var windowMargin : Vector2;
private var listMargin : Vector2;
private var windowRect :Rect ;

function Start() {
	server.updateMissions();
	currentPage = lndmrksPage.viewLandmarks;
	location.getLocation();

	newMissionName = "Enter name";
	newMissionDescriptions = "Enter description";
}

function draw() {

	if (currentPage == lndmrksPage.createLandmark) {
		createLandmark();
	} else  if (currentPage == lndmrksPage.viewLandmark) {
		showSingleLandmark(viewingLandmarkIndex);
	} else if (currentPage == lndmrksPage.viewLandmarks) {
		showLandmarks();
	}

}

function showSingleLandmark(index : int) {
	checkMissionLocation();
	
	//Mission Not Completed
	if (PlayerPrefs.GetString(PlayerPrefs.GetString("PlayerID")+"Mission"+server.landmarks[index].id) != "completed") {
		//Mission Not visited Box
		GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"");
		
		if (lastDistance < 0.01) {
			if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "REGISTER LANDMARK")) {
				server.completeMission(index);
				audio.PlayOneShot(completedSound);
			}	
		} else {
			if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "NOT CLOSE ENOUGH")) {
		
			}
		}
		

	//Mission Completed
	} else {
		//There is a owner
		if(server.landmarks[index].ownerId != "NONE") {
			//You are the owner
			if (server.landmarks[index].ownerId == PlayerPrefs.GetString("PlayerID")) {
				//Golden box
				GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"");
				if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "YOU ARE THE DOMINATOR")) {
				
				}
			//You can Steal the Landmark
			} else if (int.Parse(server.landmarks[index].ownerPoints) < int.Parse(PlayerPrefs.GetString("PlayerPoints"))){
				//Green
				GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"");
				if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "STEAL LANDMARK")) {
					audio.PlayOneShot(dominateSound);
					server.dominateLandmark(index);
				}
			//You can't steal
			} else {
				//Green
				GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"");
				if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "NOT ENOUGH POINTS TO STEAL")) {
				
				}	
			}
		//There is no owner
		} else {
			//Green
			GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"");
			if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "TAKE OVER LANDMARK")) {
				audio.PlayOneShot(dominateSound);
				server.dominateLandmark(index);			
			}
		}
	}
	
	
	//LandmarkName
	GUI.Label(Rect(Screen.width*0.1,Screen.height*0.15, Screen.width*.4, Screen.width*0.4), server.landmarks[index].name);
	
	//Landmark Picture
	GUI.DrawTexture(Rect(Screen.width*0.1,Screen.height*0.25, Screen.width*.4, Screen.width*0.4),landmarkPicture);	
	
	//DominatedBy
	GUI.Label(Rect(Screen.width*0.55,Screen.height*0.25, Screen.width*.4, Screen.width*0.4), "Dominated By:");
	
	//OwnerName
	GUI.Label(Rect(Screen.width*0.55,Screen.height*0.3, Screen.width*.4, Screen.width*0.4), server.landmarks[index].ownerName);
	
	//OwnerPoints
	GUI.Label(Rect(Screen.width*0.8,Screen.height*0.3, Screen.width*.4, Screen.width*0.4), server.landmarks[index].ownerPoints);
	
	//Description Label
	GUI.Label(Rect(Screen.width*0.1,Screen.height*0.55, Screen.width*.4, Screen.width*0.4), "Description: ");
	//Description Text
	GUI.Label(Rect(Screen.width*0.1,Screen.height*0.6, Screen.width*.4, Screen.width*0.4), server.landmarks[index].description);
	
	//GoogleMaps
	GUI.DrawTexture(Rect(Screen.width*0.55,Screen.height*0.55, Screen.width*.4, Screen.width*0.4), googleMapPicture);

}

function viewLandmark(index : int) {
	checkMissionLocation();
	
	//If mission was completed	
	if(PlayerPrefs.GetString(PlayerPrefs.GetString("PlayerID")+"Mission"+server.landmarks[index].id) == "completed") {
		//Draw Box Green Box for completed Mission
		GUI.Box(Rect(0,screen.rowHeight,Screen.width, Screen.height),"","completedMissionBox");
		GUI.Box(Rect(Screen.width*.1-1,screen.rowHeight*2-1, Screen.width*0.8+2, Screen.height*0.25+2),"Google Maps","landmarkBox");
		GUI.Label(Rect(Screen.width*.4,screen.rowHeight*3, Screen.width,screen.rowHeight), "In Range!");
		GUI.Box(Rect(0,Screen.height*0.9, Screen.width, screen.rowHeight),"");

		//There is an onwer
		if(server.landmarks[index].ownerId != "NONE") {
			//You are the owner
			if (server.landmarks[index].id == PlayerPrefs.GetString("PlayerID")) {
				GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "YOU ARE THE DOMINATOR");
			//You aren't the owner and you have more points
			} else	if (int.Parse(server.landmarks[index].ownerPoints) < int.Parse(PlayerPrefs.GetString("PlayerPoints"))){
				if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Dominate Landmark")) {
					server.dominateLandmark(index);
					audio.PlayOneShot(dominateSound);
					currentPage = lndmrksPage.viewLandmarks;
				}
			//You aren't the owner and you don't have enough points to dominate the landmark
			} else {
				if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Can't Dominate")) { 
					//screen.toolbarInt = 0;
				}
			}
		//There is no owner
		} else {
			if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Dominate Landmark")) {
				audio.PlayOneShot(dominateSound);
				server.dominateLandmark(index);
				currentPage = lndmrksPage.viewLandmarks;
			}
		}	
	//If mission was not completed
	} else {
		GUI.Box(Rect(0,screen.rowHeight+2,Screen.width, Screen.height),"");
		
		if (lastDistance < 0.01) { //Within Range to complete
			GUI.Box(Rect(Screen.width*.1-1,screen.rowHeight*2-1, Screen.width*0.8+2, Screen.height*0.25+2),"Google Maps","landmarkBox");
			GUI.Label(Rect(Screen.width*.4,screen.rowHeight*3, Screen.width,screen.rowHeight), "In Range!");
			GUI.Box(Rect(0,Screen.height*0.9, Screen.width, screen.rowHeight),"");
	
			if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Complete Mission")) { 
				server.completeMission(index);
				audio.PlayOneShot(completedSound);
				currentPage = lndmrksPage.viewLandmarks;
			}
		} else { // Not within Range to complete
			var d;
			var temp : int;
			if (lastDistance > 1) {
				temp = lastDistance;
				d = temp + " km away";
			} else {
				temp = lastDistance*1000;
				d = temp + " meters away";
			}
			
			GUI.Box(Rect(Screen.width*.1-1,screen.rowHeight*2-1, Screen.width*0.8+2, Screen.height*0.25+2),"Google Maps","landmarkBox");
			GUI.Label(Rect(Screen.width*.4,screen.rowHeight*3, Screen.width,screen.rowHeight), d.ToString());
			GUI.Box(Rect(0,Screen.height*0.9, Screen.width, screen.rowHeight),"");
			
			if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Update Location")){location.getLocation();}
		}	
	}
	
	//Back Button to view all landmarks
	GUI.Box(Rect(0,screen.rowHeight,Screen.width, screen.rowHeight/2),"");
	if (GUI.Button(Rect(1,screen.rowHeight+1,Screen.width-2, screen.rowHeight/2-1), "Back")){currentPage = lndmrksPage.viewLandmarks;}	
	
	//Only display description if recordData was parsed
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*4.5, Screen.width*0.8, screen.rowHeight),"Description: ");
	GUI.Label(Rect(Screen.width*.1+5,screen.rowHeight*5+5, Screen.width*0.8-10, Screen.height*0.35-10),server.landmarks[index].description);

}

function showLandmarks() {
	GUI.Box(new Rect(0,screen.rowHeight*1.5 - screen.rowHeight/2, Screen.width, screen.rowHeight*9),"");
	if (server.missionText != "") {
		numRows = server.missionText.Length;
		
		var n = server.landmarks.length;
		scrollPosition = GUI.BeginScrollView(Rect(0, Screen.height*0.1+2, Screen.width, Screen.height*0.82), scrollPosition, Rect(0, 0, Screen.width, (Screen.height*0.1)*(n)));
			for (var i = 0; i < n; i++) {

				//Only display landmark if there is data
				GUI.Box(Rect(1,screen.rowHeight*i, Screen.width-2,screen.rowHeight),"","landmarkBox");
				var isCompleted = "notVisitedLandmark";
				if(server.landmarks[i] != null) {				 
					if(PlayerPrefs.GetString(PlayerPrefs.GetString("PlayerID")+"Mission"+server.landmarks[i].id) == "completed") {
						isCompleted = "visitedLandmark";
					}
						
					if(GUI.Button(Rect(1,screen.rowHeight*i+1, Screen.width-2, screen.rowHeight-2), "", isCompleted)){
						viewingLandmarkIndex=i;
						currentPage = lndmrksPage.viewLandmark;
						server.getMissionDetails(server.landmarks[i].id);
						location.getLocation();
						checkMissionLocation();
						showSingleLandmark(i);
					}
					GUI.Label(Rect(Screen.width*0.1, screen.rowHeight*i + screen.rowHeight*0.2, Screen.width,screen.rowHeight), server.landmarks[i].name);
				}	   	
			}
		GUI.EndScrollView ();
	} else {
		GUI.Button(new Rect(0,screen.rowHeight*2 - screen.rowHeight/2, Screen.width, screen.rowHeight), "No Missions");	
	}
	
	//Surrounding Box and Button to create a New Mission
	GUI.Box(Rect(0,Screen.height-Screen.height*0.1,Screen.width,Screen.height*0.1),"");
	if(GUI.Button(Rect(1,Screen.height*0.9+1,Screen.width-2, Screen.height*0.1-2),"Create New Landmark")){currentPage = lndmrksPage.createLandmark; location.getLocation();}
}

function createLandmark() {

	// BackgroundImage
	GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"");

	//LandmarkName Field
	newMissionName = GUI.TextField(Rect(Screen.width*0.1,Screen.height*0.15, Screen.width*.8, screen.rowHeight*0.7), newMissionName,20);
	
	//Selects Picture or Photo Image
	var pic : Texture;
	if(pictureTaken) {
		pic = landmarkPicture_post;
	} else {
		pic = landmarkPicture_pre;
	}
	

	if(GUI.Button(Rect(Screen.width*0.1,Screen.height*0.25, Screen.width*.4, Screen.width*0.4),"")) {
		cameraFeed.SetActive(true);
		pictureTaken = false;
	}
	
	//Landmark Picture
	GUI.DrawTexture(Rect(Screen.width*0.1,Screen.height*0.25, Screen.width*.4, Screen.width*0.4), pic);
	//GUI.DrawTexture(Rect(0,-Screen.width,Screen.height,Screen.width), pic);	
	
	//GPS Coordinates
	GUI.Label(Rect(Screen.width*0.55,Screen.height*0.25, Screen.width*.5, Screen.width*0.4), "GPS Coordinates:");
	
	//X Loc
	GUI.Label(Rect(Screen.width*0.55,Screen.height*0.3, Screen.width*.4, Screen.width*0.4), "X Loc: "+ Input.location.lastData.latitude);
	//Y Loc
	GUI.Label(Rect(Screen.width*0.55,Screen.height*0.35, Screen.width*.4, Screen.width*0.4), "Y Loc: "+ Input.location.lastData.longitude);
	//Altitude
	GUI.Label(Rect(Screen.width*0.55,Screen.height*0.4, Screen.width*.4, Screen.width*0.4), "Altitude: "+ Input.location.lastData.altitude);
	
	//Description Label
	GUI.Label(Rect(Screen.width*0.1,Screen.height*0.55, Screen.width*.4, Screen.width*0.4), "Description: ");
	
	//Description Text Field
	newMissionDescriptions = GUI.TextField(Rect(Screen.width*0.1,Screen.height*0.6, Screen.width*.4, Screen.width*0.4), newMissionDescriptions);
	
	//GoogleMaps
	GUI.DrawTexture(Rect(Screen.width*0.55,Screen.height*0.55, Screen.width*.4, Screen.width*0.4), googleMapPicture);
	
	//Submit LandmarkButton	
	GUI.Box(Rect(0,Screen.height-Screen.height*0.1,Screen.width, Screen.height*0.1),"");
	if(GUI.Button(Rect(1,Screen.height-Screen.height*0.1+1,Screen.width-2, Screen.height*0.1-2), "SEND REQUEST TO ADMIN")){submitLandmark();}
	
}

function Update() {
	if (Input.GetKeyDown(KeyCode.Escape)) {
		if (currentPage == lndmrksPage.viewLandmarks) {
			exitScreen.SetActive(true);
		}
	}
	checkForTouch();
}

function checkForTouch() {
	if (Input.touchCount != 1) //if this is a short touch
	{
		selected = -1;
		
		if ( scrollVelocity != 0.0f )
		{
			// slow down over time
			var t : float;
			t = Time.time;
			t = t - timeTouchPhaseEnded;
			t = t / inertiaDuration;
			var frameVelocity : float = Mathf.Lerp(scrollVelocity, 0, t);
			scrollPosition.y += frameVelocity * Time.deltaTime;
			
			// after N seconds, we’ve stopped
			if (t >= inertiaDuration) scrollVelocity = 0.0f;
		}
		return;
	}

	var touch : Touch = Input.touches[0];
	if (touch.phase == TouchPhase.Began)
	{
		selected = TouchToRowIndex(touch.position);
		previousDelta = 0.0f;
		scrollVelocity = 0.0f;
	}
	else if (touch.phase == TouchPhase.Canceled)
	{
		selected = -1;
		previousDelta = 0f;
	}
	else if (touch.phase == TouchPhase.Moved)
	{
		// dragging
		selected = -1;
		previousDelta = touch.deltaPosition.y;
		scrollPosition.y += touch.deltaPosition.y;
	}
	else if (touch.phase == TouchPhase.Ended)
	{
		// Was it a tap, or a drag-release?
		if ( selected > -1 )
		{
			Debug.Log("Player selected row " + selected);
		}
		else
		{
			// impart momentum, using last delta as the starting velocity
			// ignore delta = 10)
			scrollVelocity = touch.deltaPosition.y / touch.deltaTime;
			timeTouchPhaseEnded = Time.time;
		}
	}

}

function TouchToRowIndex(touchPos : Vector2) : int //this checks which row was touched
{
	//
	var yy :float = Screen.height - touchPos.y; // invert coordinates
	yy += scrollPosition.y; // adjust for scroll position
	yy -= windowMargin.y; // adjust for window y offset
	yy -= listMargin.y; // adjust for scrolling list offset within the window
	var irow: int = yy / rowSize.y;
	
	irow = Mathf.Min(irow, numRows); // they might have touched beyond last row
	return irow;
}

function checkMissionLocation() {
	lastDistance = getDistance(Input.location.lastData.latitude,Input.location.lastData.longitude,
				       		   float.Parse(server.landmarks[viewingLandmarkIndex].lat), float.Parse(server.landmarks[viewingLandmarkIndex].log));
}

function getDistance(lat1: double, lng1 : double, lat2 : double, lng2 :double) {
	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2; 
	var b = Rad(lng1) - Rad(lng2);
	var s = 2 * Mathf.Asin(Mathf.Sqrt(Mathf.Pow(Mathf.Sin(a/2),2) + 
	Mathf.Cos(radLat1)*Mathf.Cos(radLat2)*Mathf.Pow(Mathf.Sin(b/2),2)));
	s = s*6378.137;
	return s;
}

function Rad(d : double) {
	return d* Mathf.PI / 180;
}

function submitLandmark() {
	server.createMission(newMissionName, newMissionDescriptions, newMissionTags,
							 Input.location.lastData.latitude, Input.location.lastData.longitude, 
							 Input.location.lastData.altitude, Input.location.lastData.horizontalAccuracy);
	
	server.updateMissions();
	currentPage = lndmrksPage.viewLandmarks;
}

function deleteLandmark(n : String) {
	server.deleteMission(n);
	server.updateMissions();
}