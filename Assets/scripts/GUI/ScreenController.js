#pragma strict
var skin : GUISkin;

var server : ServerController;

var Profile     : ProfileScreen;
var Mission     : LandmarksPage;
var Leaderboard : LeaderBoardScreen;

var numbRows  : float;
var numbCols  : float;
var rowHeight : float;
var rowWidth  : float;

public static var toolbarInt : int = 0;
static var toolbarStrings : String[] = ["Profile","Landmarks","Leaderboard"];
static var previousToolbarInt = 0;

var currentOrientation : DeviceOrientation;
var btnFontSize : float;

function Start () {
	server.getCompletedMissions();
	
	updateRowAndColSize();
	currentOrientation = Input.deviceOrientation;		
}

function updateRowAndColSize() {
	numbRows  = 10;
	numbCols  = 3;
	rowHeight = Screen.height/numbRows;
	rowWidth  = Screen.width/numbCols;
}

function Update () {
	rowHeight = Screen.height/numbRows;
	rowWidth  = Screen.width/numbCols;
	btnFontSize = rowWidth/6;
}

function OnGUI() {
	if (skin != null){GUI.skin = skin;}
	//GUI.Box(Rect(0, 0, Screen.width, Screen.height),"","pBackground");
	//Setting Font Sizes
	GUI.skin.button.fontSize = btnFontSize;
	GUI.skin.label.fontSize = btnFontSize;
	GUI.skin.textField.fontSize = btnFontSize;
	
	
	if (PlayerPrefs.GetString("PlayerID").Equals("") || PlayerPrefs.GetString("PlayerID").Contains("Error") ) {
		//Logo
		//GUI.Box(Rect(0,0,Screen.width, Screen.height*0.1+2),"");
		//GUI.Button(Rect(1, 1, Screen.width-2, Screen.height*0.1),"GeoSeeker");
		
		Profile.draw();
	} else {	
		//Draws the active Screen
		if(toolbarInt == 0) {Profile.draw(); switchBackToViewAllLandmarks();}
		else if(toolbarInt == 1) {Mission.draw();}
		else if(toolbarInt == 2) {Leaderboard.draw(); switchBackToViewAllLandmarks();}
		
		//Top toolbar
		GUI.Box(Rect(0,0,Screen.width, Screen.height*0.1+2),"");
		previousToolbarInt = GUI.Toolbar (Rect(1, 1, Screen.width-2, Screen.height*0.1), toolbarInt, toolbarStrings);
		
		if(previousToolbarInt != toolbarInt) {
			toolbarInt = previousToolbarInt;
			switchScreen(previousToolbarInt);
		}
		
	}
	

}

function switchScreen(selection : int) {
	if(selection == 0) {
		server.getUserInfo();
	} else if(selection == 1) {
		server.updateMissions();
	} else if (selection == 2) { 
		server.getLeaderboardInfo();
	}
}

function switchBackToViewAllLandmarks() {
	if(Mission.currentPage != lndmrksPage.viewLandmarks) {
		Mission.currentPage = lndmrksPage.viewLandmarks;
	}
}

