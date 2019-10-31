if (window.XMLHttpRequest)
xHRObject = new XMLHttpRequest();
else if (window.ActiveXObject)
xHRObject = new ActiveXObject("Microsoft.XMLHTTP");


$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});


window.onload = function() { checkUserDetails() };
$(document).ready(function() {

    $('#robotTable').DataTable();
  });
function checkUserDetails()
{

    xHRObject.open("GET", "server/checkUserDetails.php", true);
    xHRObject.onreadystatechange = function() {
       if (xHRObject.readyState == 4 && xHRObject.status == 200)
       {
          // alert("here1")
        var resultSet = JSON.parse(xHRObject.response);

            if(resultSet=="No User Found" )
            {
                window.location.href ="login.html";
            }
            document.getElementById("demo").innerHTML = resultSet["fName"]
            if(resultSet["userType"]== "admin")
            {

                document.getElementById("sidebar").children[8].style.display = "none";
                document.getElementById("sidebar").children[10].style.display = "block";
            }
        loadValues();
        loadRobotTable();
        loadPartsTable();
        getDetailsForChart();
        }
  }
  xHRObject.send(null);

}


function logout()
{
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

function loadValues()
{
    if (window.XMLHttpRequest)
    xHRObject_loadUserData = new XMLHttpRequest();
    else if (window.ActiveXObject)
    xHRObject_loadUserData = new ActiveXObject("Microsoft.XMLHTTP");

    xHRObject_loadUserData.open("GET", "server/getUserForUpdate.php", true);
    xHRObject_loadUserData.onreadystatechange = function() {
    if (xHRObject_loadUserData.readyState == 4 && xHRObject_loadUserData.status == 200)
    {
      var details = JSON.parse(xHRObject_loadUserData.responseText);

      if(details=="No User Found")
      {

      }
      else
      {
          document.getElementById("fName").value=details["fName"];
          document.getElementById("demo").innerHTML=details["fName"];
          document.getElementById("lName").value=details["lName"];
          document.getElementById("username").value=details["username"];
          document.getElementById("team").value=details["team"];
          document.getElementById("dob").value=details["dob"];
          document.getElementById("address").value=details["address"];
          document.getElementById("contactNo").value=details["contactNo"];
          document.getElementById("institute").value=details["institute"];
      }

    }
  }
  xHRObject_loadUserData.send(null);
}


function validateUserUpdate()
{
    var reg=/^\+[0-9]+$|^[0-9]+$/;
    var reg2 =/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    var validation = true;
    var contact = document.getElementById("contactNo").value;
    var dob = document.getElementById("dob").value;
    if(contact != "")
    {
        if(contact.length<10 || contact.length>12||!contact.match(reg))
        {
         alert("Mobile phone number is invalid");
         document.getElementById("contactNo").style.borderColor = "#E34234";
         validation = false;
        }

    }
    if(dob != "")
    {
        if(!dob.match(reg2))
        {
         alert("invalid birth day format");
         document.getElementById("dob").style.borderColor = "#E34234";
         validation = false;
        }

    }
  return validation;
}


  function createList() {

    xHRObject.open("GET", "server/loadWishList.php", true);
    xHRObject.onreadystatechange = function() {
        if (xHRObject.readyState == 4 && xHRObject.status == 200)
        {
        var resultSet = JSON.parse(xHRObject.responseText);

        if(resultSet=="No record found")
        {

        }
        else
        {

            var table = document.getElementById("wishlist");
            table.style.textAlign = "center";
            table.style.cursor = "pointer";
            table.setAttribute("border", 1, 0);

            /*Empty previous content of table*/
            while(table.firstChild)
            {
            table.removeChild(table.firstChild);
            }


            /**
            Adding the headers
            **/
            var header = table.createElement("th");
            var hRow = header.insertRow(0);
            (hRow.insertCell(0)).innerHTML="<b>Id</b>";
            (hRow.insertCell(1)).innerHTML="<b>Name</b>";
            (hRow.insertCell(2)).innerHTML="<b>Description</b>";
            (hRow.insertCell(3)).innerHTML="<b>Status</b>";

            var rowValue=0, colValue;
            while(rowValue< resultSet.length)
            {

            colValue=0
            var row=  table.insertRow(rowValue+1);
            row.setAttribute("id", resultSet[rowValue][0], 0);

                while(colValue < (resultSet[rowValue]).length)
                {
                var cell= row.insertCell(colValue);
                cell.innerHTML = resultSet[rowValue][colValue];
                //alert (resultSet[rowValue][colValue]);
                colValue=colValue+1;
                }
            rowValue=rowValue+1;
            }

            $('#wishlist').on('click', 'tr', function () {
            var rows = document.getElementById(this.id);
            var cells = rows.getElementsByTagName("td");
            var data = (cells[1].innerText);




            } );



        }

        }
    }
    xHRObject.send(null);


  }
  //alert("here")

function loadPartsTable(){
    if (window.XMLHttpRequest)
    xHRObject2 = new XMLHttpRequest();
    else if (window.ActiveXObject)
    xHRObject2 = new ActiveXObject("Microsoft.XMLHTTP");
  xHRObject2.open("GET", "server/loadPartHistory.php", true);
    xHRObject2.onreadystatechange = function() {
        //alert("here1");
    if (xHRObject2.readyState == 4 && xHRObject2.status == 200)
    {
        //alert("here")
        var resultSet = JSON.parse(xHRObject2.responseText);

        if(resultSet=="No record found")
        {

        }
        else
        {
        // var table = document.getElementById("dataTable");
        var table = $('#dataTable').DataTable( );
        //var row = table.insertRow(table.rows.length);
        // table.row.add(["1","2","3","4","5","pawan"]).draw(false);

        // var cell1 = row.insertCell(0);
        // var cell2 = row.insertCell(1);
        // var cell3 = row.insertCell(2);
        // var cell4 = row.insertCell(3);
        // var cell5 = row.insertCell(4);
        // var cell6 = row.insertCell(5);

        // cell1.innerHTML = "NEW CELL1";
        // cell2.innerHTML = "NEW CELL2";
        // cell3.innerHTML = "NEW CELL1";
        // cell4.innerHTML = "NEW CELL2";
        // cell5.innerHTML = "NEW CELL1";
        // cell6.innerHTML = "NEW CELL2";
        // alert(resultSet)
        var rowValue=0, colValue;
        //alert(resultSet.length);
        while(rowValue< resultSet.length)
        {

        table.row.add([resultSet[rowValue][0],resultSet[rowValue][1],resultSet[rowValue][2],resultSet[rowValue][3],resultSet[rowValue][4],resultSet[rowValue][5]]).draw(false);

        rowValue=rowValue+1;
        }
        }
    }
}
 xHRObject2.send(null);

}


function loadRobotTable()
{
    xHRObject.open("GET", "server/loadRobotHistory.php", true);
      xHRObject.onreadystatechange = function() {
          //alert("here1");
      if (xHRObject.readyState == 4 && xHRObject.status == 200)
      {
         // alert("here")
          var resultSet = JSON.parse(xHRObject.responseText);

          if(resultSet=="No record found")
          {

          }
          else
          {

          var table = $('#robotTable').DataTable( );

          var rowValue=0, colValue;
          //alert(resultSet.length);
          while(rowValue< resultSet.length)
          {

          table.row.add([resultSet[rowValue][0],resultSet[rowValue][1],resultSet[rowValue][2],resultSet[rowValue][3],resultSet[rowValue][4],resultSet[rowValue][5]]).draw(false);

          rowValue=rowValue+1;
          }
          }
      }
  }
   xHRObject.send(null);

}

function setCharts(newVal, usedVal, unavailableVal)
{
  // Set new default font family and font color to mimic Bootstrap's default styling
  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  // Pie Chart Example
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["New", "Used", "Unavailable"],
      datasets: [{
        data: [newVal, usedVal, unavailableVal],
        backgroundColor: ['#4e73df', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#2e59d9', '#efb217', '#ef2c1a'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });
}

function getDetailsForChart()
{
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "server/getChartDetails.php", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      document.getElementById('totParts').innerHTML = response.partCount;
      document.getElementById('totComponents').innerHTML = response.componentCount;
      document.getElementById('totRobots').innerHTML = response.robotCount;
      console.log(response.partCount+" "+response.componentCount+" "+response.robotCount);

      if(response.pieChart != "")
      {
        var tot = response.pieChart['new'] + response.pieChart['used'] + response.pieChart['na'];
        var newVal = (response.pieChart['new']/tot)*100;
        var usedVal = (response.pieChart['used']/tot)*100;
        var naVal = (response.pieChart['na']/tot)*100;
        setCharts(newVal, usedVal, naVal);
      }

      if(response.robotTimeLine != null && response.robotTimeLine != "")
      {
      //  document.getElementById('timeline').innerHTML = response.robotTimeLin
        document.getElementById('totWeight').innerHTML = response.robotTimeLine.weight+' kg   of   '+response.robotTimeLine.MaxWeight+" kg ";
        document.getElementById('totCost').innerHTML = '$'+response.robotTimeLine.cost+"   of   $"+response.robotTimeLine.MaxCost;
        document.getElementById('projectTitle').innerHTML = response.robotTimeLine.robotName;


        if(response.robotTimeLine.weight > response.robotTimeLine.MaxWeight)
        {
          document.getElementById("alertedW").innerHTML = "  -  EXCEEDED";
          document.getElementById("alertedW").style.color = "red";
        }

        if(response.robotTimeLine.cost > response.robotTimeLine.MaxCost)
        {
          document.getElementById("alertedC").innerHTML = "  -  EXCEEDED";
          document.getElementById("alertedC").style.color = "red";
        }

        var endDate = new Date(response.robotTimeLine.endDate);
        var startDate = new Date(response.robotTimeLine.createdDate);
        var today = new Date();

        console.log(startDate);
        console.log(today);
        console.log(endDate);

        var diff1 = endDate.getTime() - startDate.getTime();
        var diff2 = today.getTime() - startDate.getTime();

        console.log(diff1);
        console.log(diff2);
        if(today>endDate)
        {
            var presentageTag ="DEADLINE EXCEEDED" ;
            document.getElementById("timelineTag").innerHTML = presentageTag;
            document.getElementById("timelineTag").style.color = "red";
            document.getElementById("timeline").style.width = "100%";
        }
        else
        {
            var presentageTag = Math.round((diff2/diff1)*100);
            var presentage = Math.round((diff2/diff1)*100);
            document.getElementById("timelineTag").innerHTML = presentageTag+"%";
            document.getElementById("timeline").style.width = presentage+"%";
            console.log(presentage);
        }


      //  alert(endDate)
       // alert(today)
        //alert(diff1);
        //alert(diff2);
        // alert(end)
        // alert(presentage)


        // if(diff<=0)
        // {
        //   document.getElementById('timeline').innerHTML =
        // }
      }
      else
      {
        document.getElementById('totWeight').innerHTML = '-';
        document.getElementById('totCost').innerHTML = '-';
      }

    }
  };
  xhttp.send();
}
