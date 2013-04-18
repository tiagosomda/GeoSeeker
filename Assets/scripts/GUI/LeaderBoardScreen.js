#pragma strict
var screen : ScreenController;
var server : ServerController;


// Internal variables for managing touches and drags
private var selected :int = -1;
private var scrollVelocity :float = 0f;
private var timeTouchPhaseEnded = 0f;
private var previousDelta :float = 0f;
private var inertiaDuration :float = 0.5f;

private var scrollPosition = Vector2.zero; ;

// size of the window and scrollable list
private var numRows : int;
private var rowSize : Vector2;
private var windowMargin : Vector2;
private var listMargin : Vector2;
private var windowRect :Rect ;

function Start() {
	server.getLeaderboardInfo();
}


function draw () {
	showLeaderboard();
}

function showLeaderboard() {
	if (server.leaderboardList.Length == 0) {}
	
	GUI.Box(new Rect(0,screen.rowHeight+1, Screen.width, screen.rowHeight*9),"");
	
	
	//Rank
	GUI.Label(Rect(Screen.width*0.1,screen.rowHeight,Screen.width*0.3,Screen.height*0.1),"Rank");
	//Name
	GUI.Label(Rect(Screen.width*0.6,screen.rowHeight,Screen.width*0.3,Screen.height*0.1),"Player");
	
	//Points
	GUI.Label(Rect(Screen.width*0.3,screen.rowHeight,Screen.width*0.3,Screen.height*0.1),"Points");
	
	//Draws Leaderboard
	numRows = server.leaderboardList.Length;
	if (numRows != 0) {
		var i = 0;
		scrollPosition = GUI.BeginScrollView(Rect(0, screen.rowHeight*2, Screen.width, Screen.height*0.9), scrollPosition, Rect(0, 0, Screen.width, (Screen.height*0.1)*(numRows-1)));
			for (i = 0; i < server.leaderboardList.Length-1; i++) {
				GUI.Box(Rect(0,screen.rowHeight*i, Screen.width,screen.rowHeight),"");
				GUI.Label(Rect(Screen.width*0.1 , screen.rowHeight*i+1, screen.rowWidth, screen.rowHeight-2),(i+1).ToString());	
				GUI.Label(Rect(screen.rowWidth,screen.rowHeight*i+1, screen.rowWidth, screen.rowHeight-2),PlayerPrefs.GetString("RankName"+i));	
				GUI.Label(Rect(screen.rowWidth*2,screen.rowHeight*i+1,screen.rowWidth, screen.rowHeight-2), PlayerPrefs.GetString("RankPoints"+i));
			}
		GUI.EndScrollView ();
	} else {
		GUI.Button(new Rect(0,screen.rowHeight*2 - screen.rowHeight/2, Screen.width, screen.rowHeight), "No Missions");	
	}
	
	GUI.Box(Rect(0,Screen.height*0.9, Screen.width, screen.rowHeight),"");
	if (GUI.Button(Rect(1,Screen.height*0.9+1, Screen.width-2, screen.rowHeight -2), "Update Leaderboard")){server.getLeaderboardInfo();}
}

function Update() {
	checkForTouch();
}

function checkForTouch() {
	if (Input.touchCount != 1) //if this is a short touch
	{
		selected = -1;
		
		if ( scrollVelocity != 0.0f )
		{
			// slow down over time
			var t : float;
			t = Time.time;
			t = t - timeTouchPhaseEnded;
			t = t / inertiaDuration;
			var frameVelocity : float = Mathf.Lerp(scrollVelocity, 0, t);
			scrollPosition.y += frameVelocity * Time.deltaTime;
			
			// after N seconds, we’ve stopped
			if (t >= inertiaDuration) scrollVelocity = 0.0f;
		}
		return;
	}

	var touch : Touch = Input.touches[0];
	if (touch.phase == TouchPhase.Began)
	{
		selected = TouchToRowIndex(touch.position);
		previousDelta = 0.0f;
		scrollVelocity = 0.0f;
	}
	else if (touch.phase == TouchPhase.Canceled)
	{
		selected = -1;
		previousDelta = 0f;
	}
	else if (touch.phase == TouchPhase.Moved)
	{
		// dragging
		selected = -1;
		previousDelta = touch.deltaPosition.y;
		scrollPosition.y += touch.deltaPosition.y;
	}
	else if (touch.phase == TouchPhase.Ended)
	{
		// Was it a tap, or a drag-release?
		if ( selected > -1 )
		{
			Debug.Log("Player selected row " + selected);
		}
		else
		{
			// impart momentum, using last delta as the starting velocity
			// ignore delta = 10)
			scrollVelocity = touch.deltaPosition.y / touch.deltaTime;
			timeTouchPhaseEnded = Time.time;
		}
	}

}

function TouchToRowIndex(touchPos : Vector2) : int //this checks which row was touched
{
	//
	var yy :float = Screen.height - touchPos.y; // invert coordinates
	yy += scrollPosition.y; // adjust for scroll position
	yy -= windowMargin.y; // adjust for window y offset
	yy -= listMargin.y; // adjust for scrolling list offset within the window
	var irow: int = yy / rowSize.y;
	
	irow = Mathf.Min(irow, numRows); // they might have touched beyond last row
	return irow;
}

