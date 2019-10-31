var xHRObject = false;

if (window.XMLHttpRequest)
    xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
    xHRObject = new ActiveXObject("Microsoft.XMLHTTP");

function retrieveInformation() 
{
	checkUserDetails();
      xHRObject.open("GET", "server/userRequests.php?id=" + Number(new Date), true);
      xHRObject.onreadystatechange = function() {
           if (xHRObject.readyState == 4 && xHRObject.status == 200)
               document.getElementById('information').innerHTML = xHRObject.responseText;
      }
      xHRObject.send(null); 
}

function acceptUser(username) 
{	
	xHRObject.open("GET", "server/acceptUserRequest.php?id=" + Number(new Date) +"&value=" + username, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}

function rejectUser(username) 
{	
	xHRObject.open("GET", "server/rejectUserRequest.php?id=" + Number(new Date) +"&value=" + username, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}











