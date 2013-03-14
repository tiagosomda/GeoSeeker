#pragma strict
var b1 : GameObject;
var b2 : GameObject;
var b3 : GameObject;

function Start () {

	b1.gameObject.transform.localScale.Set(Screen.height*0.1,Screen.width*0.3,1);
	b1.gameObject.transform.position.Set(0,0,0);
	b2.gameObject.transform.localScale.Set(Screen.height*0.1,Screen.width*0.3,1);
	b2.gameObject.transform.position.Set(Screen.width*0.3,0,0);
	b3.gameObject.transform.localScale.Set(Screen.height*0.1,Screen.width*0.3,1);
	b3.gameObject.transform.position.Set(Screen.width*0.3*2,0,0);
}

function Update () {

}