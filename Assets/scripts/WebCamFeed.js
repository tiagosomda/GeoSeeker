#pragma strict

public var webcamTexture : WebCamTexture;
var Mission : LandmarksPage;
var skin : GUISkin;

function Start () {
	webcamTexture  = WebCamTexture();
    webcamTexture.Play();      
}

function OnGUI() {
	if (skin != null){GUI.skin = skin;}
	if (Mission.pictureTaken == false) {
	 	webcamTexture.Play();   
	}
	
	GUI.depth = -9;
	//Draw Camera Feed
	GUIUtility.RotateAroundPivot(90.0, Vector2(0,0));
	GUI.DrawTexture(Rect(0,-Screen.width,Screen.height,Screen.width), webcamTexture);
	
	//Draw Take Picture and Cancel Buttons
	GUIUtility.RotateAroundPivot(-90.0, Vector2(0,0));
	
	//Take Picture Button
	GUI.Box(Rect(0,Screen.height*.9, Screen.width*.5,Screen.height*0.1),"");	
	if(GUI.Button(Rect(1,Screen.height*.9+1, Screen.width*.5-2,Screen.height*0.1-2),"Take Picture")) {
		webcamTexture.Stop();
		Mission.landmarkPicture_post = webcamTexture;
		Mission.pictureTaken = true;
		gameObject.SetActive(false);
	}
	
	//Cancel Button
	
	GUI.Box(Rect(Screen.width*.5,Screen.height*.9, Screen.width*.5,Screen.height*0.1),"");	
	if(GUI.Button(Rect(Screen.width*.5+1,Screen.height*.9+1, Screen.width*.5-2,Screen.height*0.1-2),"Cancel")) {
		gameObject.SetActive(false);
	}
}