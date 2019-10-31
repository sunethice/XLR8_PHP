var xHRObject = false;

if (window.XMLHttpRequest)
    xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
    xHRObject = new ActiveXObject("Microsoft.XMLHTTP");

function retrieveInformation() 
{
	
      xHRObject.open("GET", "server/robotDeletionRequests.php?id=" + Number(new Date), true);
      xHRObject.onreadystatechange = function() {
           if (xHRObject.readyState == 4 && xHRObject.status == 200)
               document.getElementById('information').innerHTML = xHRObject.responseText;
      }
      xHRObject.send(null); 
}

function acceptDeletionRequest(robot_id) 
{	
	xHRObject.open("GET", "server/acceptRobotDeletionRequest.php?id=" + Number(new Date) +"&value=" + robot_id, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}

function rejectDeletionRequest(robot_id) 
{	
	xHRObject.open("GET", "server/rejectRobotDeletionRequest.php?id=" + Number(new Date) +"&value=" + robot_id, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}
