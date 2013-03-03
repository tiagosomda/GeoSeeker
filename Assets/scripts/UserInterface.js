//Controller GameObject
var ServerController : GameObject;
private var client : HSController;

//GUI Variables
var skin : GUISkin;
var phoneWidth : int;
var phoneHeight : int;

// DB data variables
var missionName : String;
var latitude  : double;
var longitude : double;
var altitude  : double;
var hAccuracy : double;
var landmarkInfo : String; //BAD NAME
var hs_get : WWW;
var hs_post: WWW;

//permission control variables (boolean)
var numOfCompletedMission: int;
var getUserCtMission : boolean = false;
var createMission : boolean = false;
var unlock1 : boolean = false;
var unlock2 : boolean = false;

enum Page { Missions, Profile, Leaderboard }
var currentPage : Page;

enum MissionPage { NCSU, UserCreated, CreateMission, None }
var currentMissionPage : MissionPage;
//Scrollable view
var scrollViewVector : Vector2 = Vector2.zero;

//Custom GUIStyle Names
var btnActiveStyleName = "pButtonActive";
var btnInactiveStyleName = "pButtonInactive";

var topBarMenuBtnsState = [btnActiveStyleName, btnInactiveStyleName, btnInactiveStyleName];
var topBarMenuBtnsName  = ["Profile","Missions","Leaderboard"];
var topBarSubMenuBtnsName  = ["NCSU","User Created","Create Mission"];
var maxButtonWidth;


//START OF TEMPORARY TEST HELP STUFF
//TESTING VARIABLES
	var missionText : String;

	//Temp Var
	var testingData : String; 
//TESTING FUNCTIONS
	//Helper function to create fake data
	function createTestData() {
	
		testingData = "";
		for (var i = 1; i < 50; i++) {
			testingData += "MissionName,"+i+"\n";
		}
		
		testingData += "MissionName,50";
	
	}
//END OF TEMPORARY TEST HELP STUFF	

//This function gets called when the scene (game starts)
function Start() {
	//Sets variable that can call HS Controller
	this.client = ServerController.GetComponent("HSController") as HSController;
	maxButtonWidth = Screen.width/topBarMenuBtnsName.Length;

	//Sets Current Page
	switchCurrentPage(Page.Profile);
	
	//Creates fake data
	createTestData();
}

//This function gets called every frame
function OnGUI () {
	//Sets GUISkin (skin is a variable dragged into the inspector)
    if (skin != null){GUI.skin = skin;}
    
    //Creates white background
	GUI.Box(Rect(0, 0, Screen.width, Screen.height),"","pBackground");
	
	//Creates area in which we can we BeginVertical and beginHorizontal
    GUILayout.BeginArea(Rect(0, 0, Screen.width, Screen.height));
    	GUILayout.BeginVertical(); // stacks GUI elements veritcally
    		//Displayes Menu Buttons
   			ShowTopBarMenu();
   			//Calls the function to draw the correct info on screen  		
    		switch(currentPage) {
    			case Page.Missions:		ShowTopBarSubMenu();break;
    			case Page.Profile:		ShowProfile();		break;
    			case Page.Leaderboard:	ShowLeaderboard();	break;
    		}
    	GUILayout.EndVertical();
    GUILayout.EndArea();
}

//This function sets the currentPage variable to 
//whatever the user clicked on the TopBarMenu buttons
function switchCurrentPage(page : Page) {
	//Sets styles for the top bar menu
	//basically makes them active/inactive
	switch(page) {
		case Page.Profile: 
			currentPage = Page.Profile;
			topBarMenuBtnsState[0] = btnActiveStyleName; 
			topBarMenuBtnsState[1] = btnInactiveStyleName;
			topBarMenuBtnsState[2] = btnInactiveStyleName;
			break;
		case Page.Missions:
			currentPage = Page.Missions;
			topBarMenuBtnsState[0] = btnInactiveStyleName; 
			topBarMenuBtnsState[1] = btnActiveStyleName;
			topBarMenuBtnsState[2] = btnInactiveStyleName;
			break; 
		case Page.Leaderboard:
			currentPage = Page.Leaderboard;
			topBarMenuBtnsState[0]	= btnInactiveStyleName; 
			topBarMenuBtnsState[1]	= btnInactiveStyleName;
			topBarMenuBtnsState[2]	= btnActiveStyleName;
			break; 
	}
}

//This function shows the top bar menu
function ShowTopBarMenu(){
	GUILayout.BeginHorizontal(); // stacks GUI elements horizontally
			//--------------|Button Name|----------|Button State----------| Buttons Max width |-----------| Buttons Max Height |----|what it does when button is clicked|
		if (GUILayout.Button(topBarMenuBtnsName[0], topBarMenuBtnsState[0],GUILayout.Width(maxButtonWidth),GUILayout.Height(50)))	{switchCurrentPage(Page.Profile);}
		if (GUILayout.Button(topBarMenuBtnsName[1], topBarMenuBtnsState[1],GUILayout.Width(maxButtonWidth),GUILayout.Height(50)))	{switchCurrentPage(Page.Missions);}
		if (GUILayout.Button(topBarMenuBtnsName[2], topBarMenuBtnsState[2],GUILayout.Width(maxButtonWidth),GUILayout.Height(50)))	{switchCurrentPage(Page.Leaderboard);}
	GUILayout.EndHorizontal();
}

//This function shows the top bar sub menu (under missions)
function ShowTopBarSubMenu() {
	GUILayout.BeginHorizontal();
		//--------------|Button Name|----------|Button State----------| Buttons Max width |-----------| Buttons Max Height |-------------|what it does when button is clicked|
		if (GUILayout.Button(topBarSubMenuBtnsName[0], btnInactiveStyleName,GUILayout.Width(maxButtonWidth),GUILayout.Height(25)))	{currentMissionPage = MissionPage.NCSU;}
		if (GUILayout.Button(topBarSubMenuBtnsName[1], btnInactiveStyleName,GUILayout.Width(maxButtonWidth),GUILayout.Height(25)))	{currentMissionPage = MissionPage.UserCreated;}
		if (GUILayout.Button(topBarSubMenuBtnsName[2], btnInactiveStyleName,GUILayout.Width(maxButtonWidth),GUILayout.Height(25)))  {currentMissionPage = MissionPage.CreateMission;}
	GUILayout.EndHorizontal();
	
	//Shows the actual information on the missions bar
	switch(currentMissionPage) {
		case MissionPage.NCSU:
			ShowNCSUMissions();
			break;
		case MissionPage.UserCreated:
			ShowUserMissions();
			break;
		case MissionPage.CreateMission:
			ShowCreateMission();
			break;
	}
}

//Shows Profile information
function ShowProfile() {
	GUILayout.Button("Profile information", "pLandmark");
}

//This functions gets called when the top bar sub menu
//button "NCSU" is clicked on
function ShowNCSUMissions() {

	//TODO: CREATE A FUNCTION THAT
	//GOES AND GRABS THIS INFORMATION ONCE
	//AND SAVES TO MEMORY 
		//To talk to the HSCrollter use this:
		//client.test();
		//and save the information to memory
		//ps: test() is whatever function you want in HSController
	
	//Gets information from memory
	missionText = testingData;
		
    //Creates "box" in which the missions will be put in
    //this box (ScrollView) allows you to scroll up and down
    // might not work with touch... but I am not sure
	scrollViewVector = GUILayout.BeginScrollView(scrollViewVector);
	var records = missionText.Split('\n'[0]);
	for (var record in records) {
		var recordData = record.Split(','[0]);	
    	GUILayout.Button(recordData[0]+" Number:"+recordData[1], "pLandmark");
    }
	// End the ScrollView
	GUILayout.EndScrollView();
}

//This functions gets called when the top bar sub menu
//button "User Created" is clicked on
function ShowUserMissions() {

	//TODO: CREATE A FUNCTION THAT
	//GOES AND GRABS THIS INFORMATION ONCE
	//AND SAVES TO MEMORY 
		//To talk to the HSCrollter use this:
		//client.test();
		//and save the information to memory
		//ps: test() is whatever function you want in HSController

	//Gets information from memory
	missionText = testingData;
	
    //Creates "box" in which the missions will be put in
    //this box (ScrollView) allows you to scroll up and down
    // might not work with touch... but I am not sure
	scrollViewVector = GUILayout.BeginScrollView(scrollViewVector);
	var records = missionText.Split('\n'[0]);
	for (var record in records) {
		var recordData = record.Split(','[0]);	
    	GUILayout.Button("Student : "+recordData[0]+" Number:"+recordData[1], "pLandmark");
    }
	// End the ScrollView
	GUILayout.EndScrollView();

}

//Shows page to create a mission
//Gets called when the top bar sub menu
//button "User Created" is clicked on
function ShowCreateMission() {

	GUILayout.BeginHorizontal();
	GUILayout.BeginVertical();
		GUILayout.Label("Name","subTitle");
		GUILayout.Label("latitude","subTitle");
		GUILayout.Label("longitude","subTitle");
		GUILayout.Label("altitude","subTitle");
		GUILayout.Label("hAccuracy","subTitle");
		
		if (GUILayout.Button("Create", btnInactiveStyleName,GUILayout.Width(Screen.width/2),GUILayout.Height(20))) {/*client.test();*/}
	GUILayout.EndVertical();
	
	GUILayout.BeginVertical();
		missionName = GUILayout.TextArea (missionName);
		latitude 	 = double.Parse(GUILayout.TextArea (latitude.ToString()));
		longitude 	 = double.Parse(GUILayout.TextArea (longitude.ToString()));
		altitude 	 = double.Parse(GUILayout.TextArea (altitude.ToString()));
		hAccuracy 	 = double.Parse(GUILayout.TextArea (hAccuracy.ToString()));
		
		if (GUILayout.Button("Get Position", btnInactiveStyleName,GUILayout.Width(Screen.width/2),GUILayout.Height(20))) {GetLocation();}
	GUILayout.EndVertical();
	GUILayout.EndHorizontal();
}

//Shows Leaderboard information
function ShowLeaderboard() {
	GUILayout.Button("Leaderboard", "pLandmark");
}


//Generates random coordinate values
function GetLocation() {
	latitude  = Random.Range(-100,100);
	longitude = Random.Range(-100,100);
	altitude  = Random.Range(-100,100);
	hAccuracy = Random.Range(-100,100);
}

//Count the number of completed missions of a player
function CountMissionNum(){
	this.numOfCompletedMission = 4;
}

//Set permission
function SetPermission(){
	if (this.numOfCompletedMission > 2){getUserCtMission = true;unlock1 = true;}
	if (this.numOfCompletedMission > 4){createMission = true;unlock2 = true;}
}
