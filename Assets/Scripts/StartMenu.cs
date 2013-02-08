using UnityEngine;
using System.Collections;

public class StartMenu : MonoBehaviour {
	
	public GUIStyle customButton;
	
	void OnGUI () {
		// Make a group on the center of the screen
		GUI.BeginGroup (new Rect (Screen.width - 280, Screen.height - 120, 400, 300));
		// All rectangles are now adjusted to the group. (0,0) is the topleft corner of the group.
		GUILayout.BeginVertical();
			// We'll make a box so you can see where the group is on-screen.
			if(GUILayout.Button ("New Game", customButton)) {
				StartCoroutine(playSound());	
			}
			if(GUILayout.Button ("Load Game", customButton)){
				StartCoroutine(playSound());
			}	
		GUILayout.EndVertical();
		// End the group we started above. This is very important to remember!
		GUI.EndGroup ();
	}
	
	IEnumerator  playSound() {
		audio.Play();
		yield return new WaitForSeconds(audio.clip.length);
		Application.LoadLevel ("Level1");
	}
}
