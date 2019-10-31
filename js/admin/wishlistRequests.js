var xHRObject = false;

if (window.XMLHttpRequest)
    xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
    xHRObject = new ActiveXObject("Microsoft.XMLHTTP");

function retrieveInformation() 
{
	
	checkUserDetails();
	
      xHRObject.open("GET", "server/wishlistRequests.php?id=" + Number(new Date), true);
      xHRObject.onreadystatechange = function() {
           if (xHRObject.readyState == 4 && xHRObject.status == 200)
               document.getElementById('information').innerHTML = xHRObject.responseText;
      }
      xHRObject.send(null); 
}

function acceptRequest(wishlistEntryId) 
{	
	xHRObject.open("GET", "server/acceptWishlistRequest.php?id=" + Number(new Date) +"&value=" + wishlistEntryId, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}

function deleteRequest(wishlistEntryId) 
{	
	xHRObject.open("GET", "server/deleteWishlistRequest.php?id=" + Number(new Date) +"&value=" + wishlistEntryId, true);
	xHRObject.onreadystatechange = function() {
	if (xHRObject.readyState == 4 && xHRObject.status == 200)
			   document.getElementById('acceptRejectResult').innerHTML = xHRObject.responseText;
	}
	xHRObject.send(null); 	
		
	location.reload();	
}
