
window.onload = function() { loadPartsTable() };
function saveToWishList()
{
    var partName = document.getElementById("partName").value;
    var weight = document.getElementById("weight").value;
    var cost = document.getElementById("cost").value;
    var quantity = document.getElementById("quantity").value;
    var justification = document.getElementById("justification").value;
    var vendor = document.getElementById("vendor").value;
    var vendorReference = document.getElementById("vendorReference").value;

    if(partName=="" || weight == "" || cost == "" || quantity =="" || justification == ""
    || vendor=="" || vendorReference=="")
    {
        alert("please fill all fields");
    }
    else{
    var params = "partName="+partName+"&weight="+weight+"&cost="+cost+"&vendor="+vendor+
"&quantity="+quantity+"&justification="+justification+"&vendorReference="+vendorReference;

    if (window.XMLHttpRequest)
        xHRObject2 = new XMLHttpRequest();
    else if (window.ActiveXObject)
        xHRObject2 = new ActiveXObject("Microsoft.XMLHTTP");

    xHRObject2.open("POST", "server/addToWishlist.php", true);
    xHRObject2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xHRObject2.onreadystatechange = function()
    {

        if (xHRObject2.readyState == 4 && xHRObject2.status == 200)
        {

            var resultSet = JSON.parse(xHRObject2.responseText);
            console.log(resultSet);

            if(resultSet=="success")
            {
                alert('Successfully added to the wishlist!');
            }
            else
            {
                alert('Something went wrong!');
            }
        }
    }
    xHRObject2.send(params);
}
}

function loadPartsTable(){
   // Delete();
    if (window.XMLHttpRequest)
    xHRObject3 = new XMLHttpRequest();
    else if (window.ActiveXObject)
    xHRObject3 = new ActiveXObject("Microsoft.XMLHTTP");
  xHRObject3.open("GET", "server/loadWishList.php", true);
    xHRObject3.onreadystatechange = function() {
        //alert("here1");
    if (xHRObject3.readyState == 4 && xHRObject3.status == 200)
    {
        //alert("here")
        var resultSet = JSON.parse(xHRObject3.responseText);

        if(resultSet=="No record found")
        {

        }
        else
        {
        // var table = document.getElementById("dataTable");
        var table = $('#wishListTable').DataTable( );

        var rowValue=0, colValue;
        //alert(resultSet.length);
        while(rowValue< resultSet.length)
        {
            var button = document.createElement('BUTTON');

            // creating text to be
            //displayed on button
            var text = document.createTextNode("Delete");

            // appending text to button
            button.appendChild(text);
            button.setAttribute("id",rowValue)
         var id=resultSet[rowValue][5];

        // alert(resultSet[rowValue][5])
        var status = "";
        switch(resultSet[rowValue][4])
        {
            case 'Approved': status = '<span class="badge badge-pill badge-success">Approved</span>';
                              break;

            case 'Pending' : status = '<span class="badge badge-pill badge-warning">Pending</span>';
                              break;

            case 'Rejected' : status = '<span class="badge badge-pill badge-danger">Rejected</span>';
                              break;
        }

        table.row.add([resultSet[rowValue][0],resultSet[rowValue][1],resultSet[rowValue][2],resultSet[rowValue][3],status,'<button class="btn btn-danger" id='+id+'>Delete</button>']).draw(false);

        document.getElementById(id).addEventListener('click', function(){

        }
        );
        rowValue=rowValue+1;
        }
        for (var i = 0; i < resultSet.length; i ++) {
            (function () {

            var entry_id = resultSet[i][5];
         document.getElementById(resultSet[i][5]).addEventListener("click", function() {
            // alert(entry_id);
             xHRObject3.open("GET", "server/deleteWishListItem.php?id="+entry_id, true);
             xHRObject3.onreadystatechange = function() {
                 //alert("here1");
             if (xHRObject3.readyState == 4 && xHRObject3.status == 200)
             {
                 //alert("here")
                 var resultSet = JSON.parse(xHRObject3.responseText);
                 if(resultSet == "success")
                 {

                    $('#wishListTable').dataTable().fnClearTable();
                   loadPartsTable()
                 }
                 else{
                     alert("Error occured while deleting");
                 }
             }
            }
            xHRObject3.send(null);
         }, false);


            }()); // immediate invocation
        }





        }
    }
}
 xHRObject3.send(null);

}
