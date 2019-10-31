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
            if(resultSet["userType"]== "member")
            {
                //alert("here")
                window.location.href ="index.html";            
            }
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