#pragma strict

var screen : ScreenController;
var server : ServerController;

function Start () {
}

function Update () {

}

function draw () {
	GUI.Box(new Rect(0,screen.rowHeight*1.5 - screen.rowHeight/2, Screen.width, screen.rowHeight*9),"");
	var user = server.userInfo.Split(','[0]);
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight*1.5, Screen.width,	 screen.rowHeight), "Player Name: "+ user[1]);
	GUI.Label(new Rect(Screen.width*.15,screen.rowHeight*2, Screen.width,	 screen.rowHeight), "ID: " + user[0]);	
	GUI.Label(new Rect(Screen.width*.15,screen.rowHeight*2.5, Screen.width,	 screen.rowHeight), "Points: " + user[2]);	
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