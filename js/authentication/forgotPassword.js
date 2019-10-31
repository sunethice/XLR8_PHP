if (window.XMLHttpRequest)
xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
xHRObject = new ActiveXObject("Microsoft.XMLHTTP");

function sendLink()
{
    var email = document.getElementById("inputEmail").value;

    alert(email);
    if(email == "")
    {
        alert("Please enter your email");  
    }
    else
    {
        alert("sending");
        var params = "email="+email;
        xHRObject.open("POST", "requestReset.php", true);
        xHRObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        xHRObject.onreadystatechange = function() {
           if (xHRObject.readyState == 4 && xHRObject.status == 200)
           {
              // alert("here1")
            var resultSet = JSON.parse(xHRObject.response);
        
                if(resultSet=="No User Found" )
                {
                    
                    alert("There is no users registered with given email"); 
                }
                else if(resultSet=="Success")
                {
                    //alert("here")
                    alert("Reset password link sent to your email"); 
                }
                else
                {
                    alert("Something went wrong !!!"); 
    
                }
            }
      }
      xHRObject.send(params); 
    }
  
 
}