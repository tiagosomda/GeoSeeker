using UnityEngine;
using System.Collections;

public class CloudMovement : MonoBehaviour {
 //Sets the GUI.skin
     public GUISkin skin;
     //Set the speed the credits scroll at
     public float scrollSpeed;
 
     //Holds the Position Rect for the GUI.Label
     private Rect positionRect = new Rect();
 
    // Use this for initialization
    void Start () 
    {
 
    }
 
    // Update is called once per frame
    void Update () 
    {
 
    }
 
    void OnGUI()
    {
        GUI.skin = skin;
        //Builds the GUI.Labels 
        GUI.Label(positionRect, "", "ScrollingTexture");
 
        //Changes the position of GUI.Label        
        positionRect.x = positionRect.x - (scrollSpeed * Time.deltaTime);  
    }
}
