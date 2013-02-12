using UnityEngine; 
using System.Collections; 
 
public class MainMenu : MonoBehaviour 
{ 
    // define and create our GUI delegate
    private delegate void GUIMethod(); 
    private GUIMethod currentGUIMethod; 
 
    void Start () 
    { 
        // start with the main menu GUI
        this.currentGUIMethod = menu; 
    } 
 
    public void menu() 
    { 
        if (GUI.Button (new Rect (10,25,Screen.width - 220,40), "Options")) 
        {
            // options button clicked, switch to new menu
            this.currentGUIMethod = OptionsMenu;
        } 
    } 
 
    private void OptionsMenu()
    {
        if (GUI.Button (new Rect (10,25,Screen.width - 220,40), "Main Menu")) 
        {
            // go back to the main menu
            this.currentGUIMethod = menu;
        } 
    }    
 
    // Update is called once per frame 
    public void OnGUI () 
    { 
        this.currentGUIMethod(); 
    } 
}