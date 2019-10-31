var xHRObject = false;

if (window.XMLHttpRequest)
    xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
    xHRObject = new ActiveXObject("Microsoft.XMLHTTP");

function retrieveInformation() 
{
	checkUserDetails();
      xHRObject.open("GET", "server/partDeletionRequests.php?id=" + Number(new Date), true);
      xHRObject.onreadystatechange = function() {
           if (xHRObject.readyState == 4 && xHRObject.status == 200)
               document.getElementById('information').innerHTML = xHRObject.responseText;
      }
      xHRObject.send(null); 
}

function acceptDeletionRequest(part_id) 
{	
	xHRObject.open("GET", "server/acceptPartDeletionRequest.php?id=" + Number(new Date) +"&value=" + part_id, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}

function rejectDeletionRequest(part_id) 
{	
	xHRObject.open("GET", "server/rejectPartDeletionRequest.php?id=" + Number(new Date) +"&value=" + part_id, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}
