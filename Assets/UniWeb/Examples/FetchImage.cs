using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class FetchImage : MonoBehaviour
{
	List<string> msgs = new List<string> ();

	IEnumerator Start ()
	{
		var urls = new string[] {
		"http://www.differentmethods.com/wp-content/uploads/2011/05/uniweb.jpg",
		"http://www.differentmethods.com/wp-content/uploads/2011/05/react.jpg",
		"http://entitycrisis.blogspot.com/"
		};
		
		//Only needed in WebPlayer
		//Security.PrefetchSocketPolicy("www.differentmethods.com", 843);
		
		Application.RegisterLogCallback (Logger);
		for (var i=0; i< 5; i++) {
			var requests = new List<HTTP.Request> ();
		
			foreach (var url in urls) {
				var r = new HTTP.Request ("GET", url);
				r.Send ();
				requests.Add (r);
			}
		
			while (true) {
				yield return null;
				var done = true;
				foreach (var r in requests) {
					done = done & r.isDone;
				}
				if (done)
					break;
			}
		
			foreach (var r in requests) {
				if (r.exception != null) {
					Debug.LogError (r.exception);
				} else {
					var tex = new Texture2D (512, 512);
					tex.LoadImage (r.response.Bytes);
					renderer.material.SetTexture ("_MainTex", tex);
					yield return new WaitForSeconds(1);
				}
			}
			yield return new WaitForSeconds(30);
		}
		
	}
	
	void Logger (string condition, string msg, LogType type)
	{
		msgs.Add (condition);
	}
	
	void OnGUI ()
	{
		GUILayout.BeginVertical ();
		foreach (var i in msgs) 
			GUILayout.Label (i);
		GUILayout.EndVertical ();
	}
}
