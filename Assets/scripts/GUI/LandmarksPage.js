#pragma strict
var screen : ScreenController;
var server : ServerController;
var location : LocationController;

enum lndmrksPage { viewLandmarks, createLandmark, viewLandmark}
var currentPage : lndmrksPage;

private var newMissionName : String;
private var newMissionDescriptions : String;
private var newMissionTags : String;

private var viewingLandmarkId : String;
private var lastDistance : double;


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
	yield server.updateMissions();
	currentPage = lndmrksPage.viewLandmarks;
	location.getLocation();

	newMissionName = "Enter name";
	newMissionDescriptions = "Enter description";
}

function draw() {

	if (currentPage == lndmrksPage.createLandmark) {
		createLandmark();
	} else  if (currentPage == lndmrksPage.viewLandmark) {
		viewLandmark(viewingLandmarkId);
	} else if (currentPage == lndmrksPage.viewLandmarks) {
		showLandmarks();
	}

}

function viewLandmark(id : String) {
	checkMissionLocation();
	GUI.Box(Rect(0,screen.rowHeight+2,Screen.width, Screen.height),"");
	var recordData = server.currentMissionDetails.Split(','[0]);
	GUI.Box(Rect(0,screen.rowHeight+2,Screen.width, screen.rowHeight/2),"");
	if (GUI.Button(Rect(1,screen.rowHeight+2,Screen.width-2, screen.rowHeight/2-1), "View all Landmarks")){currentPage = lndmrksPage.viewLandmarks;}
	
	//Draw Google Maps and Complete Mission/Update Location Button	
	if (lastDistance < 0.01) {
		GUI.Box(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width*0.8, Screen.height*0.25),"Google Maps");
		GUI.Label(Rect(Screen.width*.4,screen.rowHeight*3, Screen.width,screen.rowHeight), "In Range!");
		GUI.Box(Rect(0,Screen.height*0.9, Screen.width, screen.rowHeight),"");
		
		if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Complete Mission")){server.completeMission('111', recordData[0]);}
	} else {	
		var d;
		var temp : int;
		if (lastDistance > 1) {
			temp = lastDistance;
			d = temp + " km away";
		} else {
			temp = lastDistance*1000;
			d = temp + " meters away";
		}
		
		GUI.Box(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width*0.8, Screen.height*0.25),"Google Maps");
		GUI.Label(Rect(Screen.width*.4,screen.rowHeight*3, Screen.width,screen.rowHeight), d.ToString());
		GUI.Box(Rect(0,Screen.height*0.9, Screen.width, screen.rowHeight),"");
		
		if(GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Update Location")){yield location.getLocation();}
	}
	
	//Only display data if recordData was parsed
	if (recordData.Length == 7){
		GUI.Label(Rect(Screen.width*.1,screen.rowHeight*4.5, Screen.width*0.8, screen.rowHeight),"Description: ");
		GUI.Box(Rect(Screen.width*.1,screen.rowHeight*5, Screen.width*0.8, Screen.height*0.35),"");
		GUI.Label(Rect(Screen.width*.1+5,screen.rowHeight*5+5, Screen.width*0.8-10, Screen.height*0.35-10),recordData[6]);
	}

}

function createLandmark() {
	GUI.Box(Rect(0,screen.rowHeight+2,Screen.width, Screen.height),"");
	GUI.Box(Rect(0,screen.rowHeight+2,Screen.width, screen.rowHeight/2),"");
	if (GUI.Button(Rect(1,screen.rowHeight+2,Screen.width-2, screen.rowHeight/2-1), "View all Landmarks")){currentPage = lndmrksPage.viewLandmarks;}

	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width, screen.rowHeight), "Mission Name: ");
	newMissionName = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*2.5, Screen.width*.8, screen.rowHeight*0.7), newMissionName,12);
	
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*3.2, Screen.width, screen.rowHeight), "Description: ");
	newMissionDescriptions = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*3.7, Screen.width*0.8, Screen.width*0.2), newMissionDescriptions);
	
	GUI.Box(Rect(Screen.width*.1,screen.rowHeight*5.5, Screen.width*0.8, Screen.height*0.25),"Google Maps");
	
	GUI.Box(Rect(0,Screen.height-Screen.height*0.1,Screen.width, Screen.height*0.1),"");
	if(GUI.Button(Rect(1,Screen.height-Screen.height*0.1+1,Screen.width-2, Screen.height*0.1-2), "Submit Landmark")){submitLandmark();}
}

function showLandmarks() {
	GUI.Box(new Rect(0,screen.rowHeight*1.5 - screen.rowHeight/2, Screen.width, screen.rowHeight*9),"");
	if (server.missionText != "") {
		var i = 0;
		var records = server.missionText.Split('\n'[0]);
		numRows = records.Length;
		scrollPosition = GUI.BeginScrollView(Rect(0, Screen.height*0.1+2, Screen.width, Screen.height*0.82), scrollPosition, Rect(0, 0, Screen.width, (Screen.height*0.1)*(numRows-1)));
			for (i = 0; i < numRows -1; i++) {
				var recordData = records[i].Split(','[0]);
				GUI.Box(Rect(0,screen.rowHeight*i, Screen.width,screen.rowHeight),"");	
			   	if(GUI.Button(Rect(1,screen.rowHeight*i+1, Screen.width-2, screen.rowHeight-2), "")){
			   		viewingLandmarkId=recordData[1]; 	
			   		currentPage = lndmrksPage.viewLandmark;
			   		server.getMissionDetails(recordData[1]);
			   		yield location.getLocation();
			   		viewLandmark(recordData[1]);
			   	}
			   	GUI.Label(Rect(Screen.width*0.1, screen.rowHeight*i + screen.rowHeight*0.2, Screen.width,screen.rowHeight), recordData[0]);
			}
		GUI.EndScrollView ();
	} else {
		GUI.Button(new Rect(0,screen.rowHeight*2 - screen.rowHeight/2, Screen.width, screen.rowHeight), "No Missions");	
	}
	
	GUI.Box(Rect(0,Screen.height-Screen.height*0.1,Screen.width,Screen.height*0.1),"");
	if(GUI.Button(Rect(1,Screen.height*0.9+1,Screen.width-2, Screen.height*0.1-2),"Create New Mission")){currentPage = lndmrksPage.createLandmark;}
}

function Update() {
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
	var recordData = server.currentMissionDetails.Split(','[0]);
	if (recordData.Length == 6){
		lastDistance = getDistance(Input.location.lastData.latitude,Input.location.lastData.longitude,
					       		   float.Parse(recordData[2]), float.Parse(recordData[3]));
	}
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
	yield server.createMission(newMissionName, newMissionDescriptions, newMissionTags,
							 Input.location.lastData.latitude, Input.location.lastData.longitude, 
							 Input.location.lastData.altitude, Input.location.lastData.horizontalAccuracy);
	//server.createMissionTest(newMissionName, newMissionDescriptions, newMissionTags,
	//						 Input.location.lastData.latitude, Input.location.lastData.longitude, 
	//						 Input.location.lastData.altitude, Input.location.lastData.horizontalAccuracy);
	
	yield server.updateMissions();
	currentPage = lndmrksPage.viewLandmarks;
}

function deleteLandmark(n : String) {
	server.deleteMission(n);
	yield server.updateMissions();
}