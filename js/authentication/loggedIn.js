window.onload = function() { checkUserDetails() };
function checkUserDetails()
{
    xHRObject = new XMLHttpRequest();
    xHRObject.open("GET", "server/checkUserDetails.php", true);
    xHRObject.onreadystatechange = function() {
       if (xHRObject.readyState == 4 && xHRObject.status == 200)
       {
          
        var resultSet = JSON.parse(xHRObject.response);
    
            if(resultSet=="No User Found" )
            {
                window.location.href ="login.html"; 
            }
            document.getElementById("demo").innerHTML = resultSet["fName"]
            if(resultSet["userType"]== "admin")
            {
                //alert("here")
                // document.getElementById("sidebar").children[8].style.display = "none"; 
                // document.getElementById("sidebar").children[10].style.display = "block";             
            }
       
        }
  }
  xHRObject.send(null);   
 
}