#pragma strict
var screen : ScreenController;
function Start () {

}

function Update () {

}

function draw () {
	GUI.Box(new Rect(0,screen.rowHeight, Screen.width, screen.rowHeight*9),"");
	GUI.Label(new Rect(Screen.width*.1,screen.rowHeight + Screen.height*.1,Screen.width,screen.rowHeight*9),"Rank | Name | Points");
}