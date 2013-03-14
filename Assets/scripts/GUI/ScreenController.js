#pragma strict
var skin : GUISkin;

var server : ServerController;

var Profile     : GameObject;
var Mission     : GameObject;
var Leaderboard : GameObject;

var numbRows  : float;
var numbCols  : float;
var rowHeight : float;
var rowWidth  : float;

var currentOrientation : DeviceOrientation;
var btnFontSize : float;

//Custom GUIStyle Names
var btnActiveStyleName = "pButtonActive";
var btnInactiveStyleName = "pButtonInactive";
var topTabBtnsState = [btnActiveStyleName, btnInactiveStyleName, btnInactiveStyleName];

function Start () {
	updateRowAndColSize();
	currentOrientation = Input.deviceOrientation;
			
	Profile.SetActive(false);
	Mission.SetActive(true);
	Leaderboard.SetActive(false);
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
	
	//Draws TopTab
	drawTopBar();
	
	//Draws the active Screen
	if(Profile.activeSelf) {Profile.GetComponent(ProfileScreen).draw();}
	else if(Mission.activeSelf) {Mission.GetComponent(MissionScreen).draw();}
	else if(Leaderboard.activeSelf) {Leaderboard.GetComponent(LeaderBoardScreen).draw();}
}

function drawTopBar() {		
	if(GUI.Button(new Rect(0,0, rowWidth,rowHeight),"Profile")){ switchScreen(Profile);}
	if(GUI.Button(new Rect(rowWidth,0,rowWidth,rowHeight),"Mission")){switchScreen(Mission);}
	if(GUI.Button(new Rect(rowWidth*2,0,rowWidth,rowHeight),"Leaderboard")){switchScreen(Leaderboard);}
}

function switchScreen(clicked : GameObject) {
	switch(clicked) {
		case Profile:
			server.getUserInfo(); 
			Profile.SetActive(true); 	 topTabBtnsState[0] = btnActiveStyleName; 
			Mission.SetActive(false); 	 topTabBtnsState[1] = btnInactiveStyleName;
			Leaderboard.SetActive(false);topTabBtnsState[2] = btnInactiveStyleName;
			break;
		case Mission:
			Profile.SetActive(false); 	 topTabBtnsState[0] = btnInactiveStyleName;
			Mission.SetActive(true);	 topTabBtnsState[1] = btnActiveStyleName; 
			Leaderboard.SetActive(false);topTabBtnsState[2] = btnInactiveStyleName;
			break;
		case Leaderboard: 
			Profile.SetActive(false);	topTabBtnsState[0] = btnInactiveStyleName;
			Mission.SetActive(false);	topTabBtnsState[1] = btnInactiveStyleName;
			Leaderboard.SetActive(true);topTabBtnsState[2] = btnActiveStyleName; 
			break;
	}
}
