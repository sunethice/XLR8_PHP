

var xHRObject = false;

if (window.XMLHttpRequest)
    xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
    xHRObject = new ActiveXObject("Microsoft.XMLHTTP");

function retrieveInformation() 
{
	
      xHRObject.open("GET", "server/userInformation.php?id=" + Number(new Date), true);
      xHRObject.onreadystatechange = function() {
           if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('information').innerHTML = xHRObject.responseText;
			 
      }
      xHRObject.send(null); 
}


function deleteUserFromSystem(username) 
{		
	var txt;
	if (confirm("This User will be deleted!")) {
		xHRObject.open("GET", "server/deleteUser.php?id=" + Number(new Date) +"&value=" + username, true);
		xHRObject.onreadystatechange = function() {
		if (xHRObject.readyState == 4 && xHRObject.status == 200)
				   document.getElementById('deleteUserResult').innerHTML = xHRObject.responseText;
		}
		xHRObject.send(null); 	
			
		location.reload();
	} 
		
}











