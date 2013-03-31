#pragma strict

var screen : ScreenController;
var server : ServerController;
var username = "";
var password = "";
var email = "";

enum profilePage {Login, Register, Profile}
var currentPage = profilePage.Login;

function draw () {
	GUI.Box(new Rect(0,screen.rowHeight*1.5 - screen.rowHeight/2, Screen.width, screen.rowHeight*9),"");
	
	if (PlayerPrefs.GetString("PlayerID").Equals("")) {
		if (currentPage == profilePage.Login){
			showLogin();		
		} else {
			showRegistration();
		}

	} else if(PlayerPrefs.GetString("PlayerID").Contains("Error")){
		showLogin();
		GUI.Label(Rect(Screen.width*.1,Screen.height*.6, Screen.width,screen.rowHeight),"Wrong Username/Password");
	} else {
		showProfile();
	}
}

function showLogin() {
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width,screen.rowHeight),"Username: ");
	username = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*2.5, Screen.width*.8,screen.rowHeight), username);
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*4, Screen.width,screen.rowHeight),"Password: ");
	password = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*4.5, Screen.width*.8,screen.rowHeight), password);
		
	GUI.Box(Rect(0,Screen.height*.9, Screen.width*.5,screen.rowHeight),"");
	if(GUI.Button(Rect(0+1,Screen.height*.9+1, Screen.width*.5-2,screen.rowHeight-2),"Login")){server.login(username,password);}
	
	GUI.Box(Rect(Screen.width*.5,Screen.height*.9, Screen.width*.5,screen.rowHeight),"");
	if(GUI.Button(Rect(Screen.width*.5+1,Screen.height*.9+1, Screen.width*.5-2,screen.rowHeight-2),"Register")){currentPage = profilePage.Register;}
}

function showProfile() {
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width,screen.rowHeight), PlayerPrefs.GetString("PlayerName"));
	GUI.Label(Rect(Screen.width*.15,screen.rowHeight*3, Screen.width,screen.rowHeight), "ID: " + PlayerPrefs.GetString("PlayerID"));	
	GUI.Label(Rect(Screen.width*.15,screen.rowHeight*4, Screen.width,screen.rowHeight), "Points: " + PlayerPrefs.GetString("PlayerPoints"));
	GUI.Label(Rect(Screen.width*.15,screen.rowHeight*5, Screen.width,screen.rowHeight), "Landmarks Visited: " + PlayerPrefs.GetString("PlayerCompleted"));
		
	GUI.Box(Rect(0,Screen.height*.9, Screen.width,screen.rowHeight),"");
	if(GUI.Button(Rect(0+1,Screen.height*.9+1, Screen.width-2,screen.rowHeight-2),"Log out")){logout();}
}

function showRegistration() {
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width,screen.rowHeight),"Username: ");
	username = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*2.5, Screen.width*.8,screen.rowHeight), username);
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*4, Screen.width,screen.rowHeight),"Password: ");
	password = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*4.5, Screen.width*.8,screen.rowHeight), password);	
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*6, Screen.width,screen.rowHeight),"Email: ");
	email = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*6.5, Screen.width*.8,screen.rowHeight), email);
	
	GUI.Box(Rect(0,Screen.height*.9, Screen.width*.5,screen.rowHeight),"");
	if(GUI.Button(Rect(0+1,Screen.height*.9+1, Screen.width*.5-2,screen.rowHeight-2),"Create")){server.createUser(username,password,email); currentPage = profilePage.Login;}
	
	GUI.Box(Rect(Screen.width*.5,Screen.height*.9, Screen.width*.5,screen.rowHeight),"");
	if(GUI.Button(Rect(Screen.width*.5+1,Screen.height*.9+1, Screen.width*.5-2,screen.rowHeight-2),"Cancel")){currentPage = profilePage.Login;}
}

function logout() {
	PlayerPrefs.SetString("PlayerID", "");
    PlayerPrefs.SetString("PlayerName", "");
    PlayerPrefs.SetString("PlayerPoints","");
    username = password = "";
}


function ToDoBackUp() {

	GUI.Box(new Rect(0,screen.rowHeight, Screen.width, screen.rowHeight*9),"");
	GUI.Label(new Rect(Screen.width*.05,screen.rowHeight + Screen.height*.02,Screen.width,screen.rowHeight*9), "TO DO:"
																												+"\nServer Side:"
																												+"\n   Create user Script"
																												+"\n   Authenticate Script"
																												+"\n   Use JSON to send/retrieve data"
																												+"\n\nClient Side:"
																												+"\n   Use JSON to send/retrieve data"
																												+"\n   Store Missions on Device's Storage"
																												+"\n   Login Page"
																												+"\n   Create user Page"
																												+"\n   Show points/rank"
																												+"\n   Show pushed achievements page"
																												+"\n   Show achievements page"
																												+"\n   Make a good GUI"
																												+"\n      ~this one is crap"
																												+"\n      ~~but we can use it to test stuff");
}