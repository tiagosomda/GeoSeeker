#pragma strict

var screen : ScreenController;
var server : ServerController;
var location : LocationController;

enum MissionsPage { viewMissions, AddMission, viewSingleMission}
var currentPage : MissionsPage;

var newMissionName : String;
var newMissionDescriptions : String;
var newMissionTags : String;

var viewingMissionsId : String;

function Start () {
	yield server.updateMissions();
	currentPage = MissionsPage.viewMissions;
	location.getLocation();
	
	newMissionName = "Enter name";
	newMissionDescriptions = "Enter description";
	newMissionTags = "Enter tags";
}

function Update () {}
function refreshMissionList() {
	yield server.updateMissions();
}
function draw () {
	GUI.Box(new Rect(0,screen.rowHeight*2 - screen.rowHeight/2, Screen.width, screen.rowHeight*9),"");
	
	if (currentPage == MissionsPage.AddMission) {
		if(GUI.Button(new Rect(0,screen.rowHeight, Screen.width, screen.rowHeight/2), "View Missions")) {currentPage = MissionsPage.viewMissions;}
		addMissionScreen();
	} else if(currentPage == MissionsPage.viewMissions){
		if(GUI.Button(new Rect(0,screen.rowHeight, Screen.width*.5, screen.rowHeight/2), "Refresh")) {refreshMissionList();}
		if(GUI.Button(new Rect(Screen.width*.5,screen.rowHeight, Screen.width*.5, screen.rowHeight/2), "Add Mission")) {currentPage = MissionsPage.AddMission;}
		viewMissionsScreen();
	} else if(currentPage == MissionsPage.viewSingleMission) {
		showSingleMission(viewingMissionsId);
		if(GUI.Button(new Rect(0,screen.rowHeight, Screen.width, screen.rowHeight/2), "Back")) {currentPage = MissionsPage.viewMissions;}
	}
}


function viewMissionsScreen() {
	if (server.missionText != "") {
		var i = 0;
		var records = server.missionText.Split('\n'[0]);
		for (i = 0; i < records.Length -1; i++) {
			var recordData = records[i].Split(','[0]);	
		   	if(GUI.Button(new Rect(0,screen.rowHeight*(i + 2) - screen.rowHeight/2, Screen.width*0.1, screen.rowHeight), "X")){deleteMission(recordData[0]);}
		   	if(GUI.Button(new Rect(Screen.width*0.1,screen.rowHeight*(i + 2) - screen.rowHeight/2, Screen.width*0.8, screen.rowHeight), recordData[0])){viewingMissionsId=recordData[1]; 	currentPage = MissionsPage.viewSingleMission;
;showSingleMission(recordData[1]);}
			if(GUI.Button(new Rect(Screen.width*0.9,screen.rowHeight*(i + 2) - screen.rowHeight/2, Screen.width*0.1, screen.rowHeight), "V")){checkMissionLocation();}
		}
	} else {
		GUI.Button(new Rect(0,screen.rowHeight*2 - screen.rowHeight/2, Screen.width, screen.rowHeight), "No Missions");	
	}
}

function addMissionScreen() {
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*2.5, Screen.width, screen.rowHeight), "Mission Name: ");
	newMissionName = GUI.TextField(new Rect((Screen.width*.1) * 5,screen.rowHeight*2.5, Screen.width*.4, screen.rowHeight/2), newMissionName,12);
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*3, Screen.width, screen.rowHeight), "Description: ");
	newMissionDescriptions = GUI.TextField(new Rect(Screen.width*.1,screen.rowHeight*3.5, Screen.width*0.8, Screen.width*0.2), newMissionDescriptions);
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*5, Screen.width, screen.rowHeight), "Tags: ");
	newMissionTags = GUI.TextField(new Rect(Screen.width*.1,screen.rowHeight*5.5, Screen.width*0.8, Screen.width*0.2), newMissionTags);
	
	//Location
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*7, Screen.width*.9, screen.rowHeight), "Latitude: " + Input.location.lastData.latitude);
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*7.5, Screen.width*.9, screen.rowHeight), "Longitute: "  + Input.location.lastData.longitude);
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*8, Screen.width*.9, screen.rowHeight), "Altitude: "  + Input.location.lastData.altitude);
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*8.5, Screen.width*.9, screen.rowHeight), "Horizontal Accuracy: "  + Input.location.lastData.horizontalAccuracy);
	
	if(GUI.Button(new Rect(Screen.width*0.1,screen.rowHeight*9,screen.rowWidth*1.2,screen.rowHeight/2), "Update Loc")){location.getLocation();}
	if(GUI.Button(new Rect(Screen.width*0.5,screen.rowHeight*9,screen.rowWidth*1.2,screen.rowHeight/2), "Submit Mission")){submitMission();}
}

function submitMission() {
	yield server.createMission(newMissionName, newMissionDescriptions, newMissionTags,
							 Input.location.lastData.latitude, Input.location.lastData.longitude, 
							 Input.location.lastData.altitude, Input.location.lastData.horizontalAccuracy);
	//server.createMissionTest(newMissionName, newMissionDescriptions, newMissionTags,
	//						 Input.location.lastData.latitude, Input.location.lastData.longitude, 
	//						 Input.location.lastData.altitude, Input.location.lastData.horizontalAccuracy);
	
	yield server.updateMissions();
	currentPage = MissionsPage.viewMissions;
}



function deleteMission(n : String) {
	server.deleteMission(n);
	yield server.updateMissions();
}

function showSingleMission(id : String) {
	if(GUI.Button(new Rect(Screen.width*0.1,screen.rowHeight*(2) - screen.rowHeight/2, Screen.width*0.8, screen.rowHeight), id)){}
	print(id);
	
}

function checkMissionLocation() {

}