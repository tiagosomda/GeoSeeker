#pragma strict

var screen : ScreenController;

function Start () {

}

function Update () {

}

function draw () {
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