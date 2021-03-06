using UnityEngine;
using System.Collections;

public class RectGoogleMap : MonoBehaviour {
	public GUISkin skin;
	public enum MapType
	{
		RoadMap,
		Satellite,
		Terrain,
		Hybrid
	}
	public bool loadOnStart = true;
	public bool autoLocateCenter = true;
	public GoogleMapLocation centerLocation;
	public int zoom = 13;
	public MapType mapType;
	public int size = 512;
	public bool doubleResolution = false;
	public GoogleMapMarker[] markers;
	public GoogleMapPath[] paths;
	private Texture2D googleMapTexture;

	
	void Start() {
		if(loadOnStart) Refresh();	
	}
	
	void OnEnable() {
		centerLocation.latitude = PlayerPrefs.GetFloat("GMAPLAT");
		centerLocation.longitude = PlayerPrefs.GetFloat("GMAPLOG");
		Refresh();
	}
	void OnGUI() {
		if (skin != null){GUI.skin = skin;}
		GUI.depth = -9;
		if (googleMapTexture !=  null) {
			GUI.DrawTexture(new Rect(0,0,Screen.width,Screen.height), googleMapTexture);	
		}
		
		if(GUI.Button(new Rect(0,Screen.height*0.9f,Screen.width,Screen.height*0.1f), "Back")) {
			gameObject.SetActive(false);	
		}
	}
	public void Refresh() {
		if(autoLocateCenter && (markers.Length == 0 && paths.Length == 0)) {
			Debug.LogError("Auto Center will only work if paths or markers are used.");	
		}
		StartCoroutine(_Refresh());
	}
	
	IEnumerator _Refresh ()
	{
		var url = "http://maps.googleapis.com/maps/api/staticmap";
		var qs = "";
		if (!autoLocateCenter) {
			if (centerLocation.address != "")
				qs += "center=" + HTTP.URL.Encode (centerLocation.address);
			else {
				qs += "center=" + HTTP.URL.Encode (string.Format ("{0},{1}", centerLocation.latitude, centerLocation.longitude));
			}
		
			qs += "&zoom=" + zoom.ToString ();
		}
		qs += "&size=" + HTTP.URL.Encode (string.Format ("{0}x{0}", size));
		qs += "&scale=" + (doubleResolution ? "2" : "1");
		qs += "&maptype=" + mapType.ToString ().ToLower ();
		var usingSensor = false;
#if UNITY_IPHONE
		usingSensor = Input.location.isEnabledByUser && Input.location.status == LocationServiceStatus.Running;
#endif
		qs += "&sensor=" + (usingSensor ? "true" : "false");
		
		foreach (var i in markers) {
			qs += "&markers=" + string.Format ("size:{0}|color:{1}|label:{2}", i.size.ToString ().ToLower (), i.color, i.label);
			foreach (var loc in i.locations) {
				if (loc.address != "")
					qs += "|" + HTTP.URL.Encode (loc.address);
				else
					qs += "|" + HTTP.URL.Encode (string.Format ("{0},{1}", loc.latitude, loc.longitude));
			}
		}
		
		foreach (var i in paths) {
			qs += "&path=" + string.Format ("weight:{0}|color:{1}", i.weight, i.color);
			if(i.fill) qs += "|fillcolor:" + i.fillColor;
			foreach (var loc in i.locations) {
				if (loc.address != "")
					qs += "|" + HTTP.URL.Encode (loc.address);
				else
					qs += "|" + HTTP.URL.Encode (string.Format ("{0},{1}", loc.latitude, loc.longitude));
			}
		}
		
		
		var req = new HTTP.Request ("GET", url + "?" + qs, true);
		req.Send ();
		while (!req.isDone)
			yield return null;
		if (req.exception == null) {
			var tex = new Texture2D (size, size);
			tex.LoadImage (req.response.Bytes);
			//renderer.material.mainTexture = tex;
			guiTexture.texture = tex;
			googleMapTexture = tex;
		}
	}
	
}