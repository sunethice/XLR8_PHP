window.onload = function() { checkUserDetails() };
function checkUserDetails()
{
    xHRO = new XMLHttpRequest();
    xHRO.open("GET", "server/checkUserDetails.php", true);
    xHRO.onreadystatechange = function() {
       if (xHRO.readyState == 4 && xHRO.status == 200)
       {
          
        var resultSet = JSON.parse(xHRO.response);
    
            if(resultSet=="No User Found" )
            {
                window.location.href ="login.html"; 
            }
            document.getElementById("demo").innerHTML = resultSet["fName"]
            if(resultSet["userType"]== "admin")
            {
                //alert("here")
                document.getElementById("sidebar").children[8].style.display = "none"; 
                 document.getElementById("sidebar").children[10].style.display = "block";             
            }
       
        }
  }
  xHRO.send(null);   
 
}
function logout()
{
    xHRObject = new XMLHttpRequest();
    xHRObject.open("GET", "server/logout.php", true);
    xHRObject.onreadystatechange = function() {
       if (xHRObject.readyState == 4 && xHRObject.status == 200)
        var resultSet = JSON.parse(xHRObject.responseText);
        if(resultSet == "1")
        {
            window.location.href ="login.html";
        }
        else
        {
            window.location.href ="index.html";
        }

  }
  xHRObject.send(null);

}