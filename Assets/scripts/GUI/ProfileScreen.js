#pragma strict

var screen : ScreenController;
var server : ServerController;
var username = "";
var password = "";
var email = "";

var usernameRect : Rect;
var usernameFieldRect : Rect;
var passRect : Rect;
var passFieldRect : Rect;

var loginImage : Texture;
var logoImage : Texture;
var rankImage : Texture;	

enum profilePage {Login, Register, Profile}
var currentPage = profilePage.Login;

function Start() {
	usernameRect.Set(Screen.width*.1,screen.rowHeight*6, Screen.width,screen.rowHeight);
	usernameFieldRect.Set(Screen.width*.1,screen.rowHeight*6.5, Screen.width*.8,screen.rowHeight*0.7);
	passRect.Set(Screen.width*.1,screen.rowHeight*7.5, Screen.width,screen.rowHeight);
	passFieldRect.Set(Screen.width*.1,screen.rowHeight*8, Screen.width*.8,screen.rowHeight*0.7);
}

function draw () {
		
	if (PlayerPrefs.GetString("PlayerID").Equals("")) {
		//Background Image
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),loginImage, ScaleMode.StretchToFill,true,1);
		GUI.DrawTexture(Rect(0,0,logoImage.width,logoImage.height),logoImage,ScaleMode.ScaleToFit,true,1);
		
		if (currentPage == profilePage.Login){
			showLogin();		
		} else {
			showRegistration();
		}

	} else if(PlayerPrefs.GetString("PlayerID").Contains("Error")){
		showLogin();
		GUI.Label(Rect(Screen.width*.1,Screen.height*.6, Screen.width,screen.rowHeight),"Wrong Username/Password");
	} else {
		GUI.Box(new Rect(0,0, Screen.width, Screen.height),"");
		showProfile();
	}
}

function showLogin() {
	//Username
	GUI.Label(usernameRect,"Username: ");
	username = GUI.TextField(usernameFieldRect, username);
	//Password
	GUI.Label(passRect,"Password: ");
	password = GUI.PasswordField(passFieldRect, password, "*"[0]);
	
	//Login	
	GUI.Box(Rect(0,Screen.height*.9, Screen.width*.5,screen.rowHeight),"");
	if(GUI.Button(Rect(0+1,Screen.height*.9+1, Screen.width*.5-2,screen.rowHeight-2),"Login")){screen.toolbarInt = 1; server.login(username,password);}
	
	//Register
	GUI.Box(Rect(Screen.width*.5,Screen.height*.9, Screen.width*.5,screen.rowHeight),"");
	if(GUI.Button(Rect(Screen.width*.5+1,Screen.height*.9+1, Screen.width*.5-2,screen.rowHeight-2),"Register")){currentPage = profilePage.Register;}
}

function showProfile() {

	//Background Image
	GUI.Box(Rect(0,Screen.height*0.1, Screen.width, Screen.height*0.8),"","lightRed");
	
	//Player Name
	GUI.skin.customStyles[9].fontSize = Screen.width/6;
	GUI.skin.customStyles[10].fontSize = Screen.width/12;
	
	
	GUI.Label(Rect(0,Screen.height*0.15, Screen.width, Screen.height*0.1), PlayerPrefs.GetString("PlayerName"), "title");
	
	//Points
	GUI.Label(Rect(0,Screen.height*0.3, Screen.width, Screen.height*0.1),"Points: " + PlayerPrefs.GetString("PlayerPoints"), "text");
	
	//Ranks
	GUI.Label(Rect(0,Screen.height*0.4, Screen.width, Screen.height*0.1),"Rank: " + "Freshamn", "text");
	
	//Rank Image
	GUI.DrawTexture(Rect(Screen.width*0.8,Screen.height*0.38, Screen.width*.15, Screen.width*.15),rankImage);
	
	//Landmarks
	GUI.Label(Rect(0,Screen.height*0.5, Screen.width, Screen.height*0.1),"Landmarks", "title");
	
	//Visited vs Total
	//GUI.Label(Rect(0,Screen.height*0.3, Screen.width, Screen.height*0.1),"Points: " + PlayerPrefs.GetString("PlayerPoints"), "text");
	GUI.Label(Rect(0,Screen.height*0.65, Screen.width, Screen.height*0.1),"Visited: " + PlayerPrefs.GetString("PlayerCompleted"), "text");
	
	//Owned Landmark
	//print(PlayerPrefs.GetString("PlayerDominatedName"));
	if (PlayerPrefs.GetString("PlayerDominatedName") != "") {
		GUI.Label(Rect(0,Screen.height*0.75, Screen.width, Screen.height*0.1),"Dominates " + PlayerPrefs.GetString("PlayerDominatedName"), "text");
	} else {
		GUI.Label(Rect(0,Screen.height*0.75, Screen.width, Screen.height*0.1),"Dominates " + "Nothing!", "text");
	}
	//Logout Button		
	GUI.Box(Rect(0,Screen.height*.9, Screen.width,screen.rowHeight),"");
	if(GUI.Button(Rect(0+1,Screen.height*.9+1, Screen.width-2,screen.rowHeight-2),"Log out")){logout();}
}

function showRegistration() {
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*2, Screen.width,screen.rowHeight),"Username: ");
	username = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*2.5, Screen.width*.8,screen.rowHeight), username);
	GUI.Label(Rect(Screen.width*.1,screen.rowHeight*4, Screen.width,screen.rowHeight),"Password: ");
	password = GUI.TextField(Rect(Screen.width*.1,screen.rowHeight*4.5, Screen.width*.8,screen.rowHeight), password, "*"[0]);	
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