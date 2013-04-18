#pragma strict

public var webcamTexture : WebCamTexture;
var Mission : LandmarksPage;

function Start () {
	webcamTexture  = WebCamTexture();
    webcamTexture.Play();      
}

function OnGUI() {
	if (Mission.pictureTaken == false) {
	 	webcamTexture.Play();   
	}
	
	GUI.depth = -9;
	//Draw Camera Feed
	GUIUtility.RotateAroundPivot(90.0, Vector2(0,0));
	GUI.DrawTexture(Rect(0,-Screen.width,Screen.height,Screen.width), webcamTexture);
	
	//Draw Take Picture and Cancel Buttons
	GUIUtility.RotateAroundPivot(-90.0, Vector2(0,0));
	
	if(GUI.Button(Rect(0,Screen.height*0.9,Screen.width*0.5, Screen.height*0.1),"Take Picture")) {
		webcamTexture.Stop();
		Mission.landmarkPicture_post = webcamTexture;
		Mission.pictureTaken = true;
		gameObject.SetActive(false);
	}
	if(GUI.Button(Rect(Screen.width*0.5,Screen.height*0.9,Screen.width*0.5, Screen.height*0.1),"Cancel")) {
		gameObject.SetActive(false);
	}
}