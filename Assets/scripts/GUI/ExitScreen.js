#pragma strict
var skin : GUISkin;
var exitMessageRect : Rect;
var exitYesRect : Rect;
var exitNoRect : Rect;

function Start() {
	exitMessageRect.Set(Screen.width*.15,Screen.height*.4,Screen.width, Screen.height);
	exitYesRect.Set(Screen.width*.15, Screen.height*.5, Screen.width*.3, Screen.height*.1);
	exitNoRect.Set(Screen.width*.55, Screen.height*.5, Screen.width*.3, Screen.height*.1);
}

function OnGUI() {
	if (skin != null){GUI.skin = skin;}
	
	GUI.depth = -10;
	//Draws Black Screen
	GUI.Box(Rect(-5,-5,Screen.width+10,Screen.height+10),"","blackbox70");
	GUI.Label(exitMessageRect,"Do you want to exit?");
	
	//Yes Exit
	if (GUI.Button(exitYesRect,"Yes")) {
		Application.Quit();
	}
	//Don't Exit
	if (GUI.Button(exitNoRect,"No")) {
		gameObject.SetActive(false);
	}

}