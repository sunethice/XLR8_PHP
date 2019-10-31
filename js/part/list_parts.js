function init()
{

}
//3.5 hrs
function populatePartDetails()
{
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);

      if(response.length!=0)
      {
        var select = document.getElementById('mainCat');
      catResponse = response['categories'];
        $.each(catResponse, function( key, value ) {

          if(catResponse[key]['level']=='1')
          {
            var option = document.createElement("option");
            option.setAttribute("id", catResponse[key]['id'] );
            option.text = catResponse[key]['name'];
            select.add(option);
          }

        //  console.log("NAME: "+response[key]['name']);
        });

        populateCategoryFields(response, "mainCat", "subCat");
        populateCategoryFields(response, "subCat", "category");
        if(response['parts']=="0 part results")
        {

        }
        else {
            createPartTable(response['parts']);
        }

      }

        mainCat.addEventListener("change", function() {
          var mainCat = document.getElementById('mainCat');
          var subCat = document.getElementById('subCat');
          var subSubCat = document.getElementById('category');
          while (subCat.firstChild)
          {
            subCat.removeChild(subCat.firstChild);
          }

          while (category.firstChild)
          {
            category.removeChild(category.firstChild);
          }

          if(mainCat.options.length==0)
          {
            alert('Oops!', 'error', "Sorry! No categories found!");
          }
          else
          {
            populateCategoryFields(response, "mainCat", "subCat");
          }

        });

        subCat.addEventListener("click", function() {
          var subCat = document.getElementById('subCat');
          if(subCat.options.length==0)
          {
            if( mainCat.options.length==0)
            {
              alert('Oops!', 'error', "Please select a main category first");
            }
            else if(mainCat.options.length>0)
            {
              alert('Oops!', 'error', "There are no sub categories listed under the selected level 1 category. (You can add a new category)");
            }
          }
        });

        subCat.addEventListener("change", function() {
          var subCat = document.getElementById('subCat');

          while (category.firstChild)
          {
            category.removeChild(category.firstChild);
          }

          if(subCat.options.length==0)
          {
            if( mainCat.options.length==0)
            {
              alert('Oops!', 'error', "Please select a main category first");
            }
            else if(mainCat.options.length>0)
            {
              alert('Oops!', 'error', "There are no sub categories listed under the selected level 1 category. (You can add a new category)");
            }
          }
          else
          {
            populateCategoryFields(response, "subCat", "category");
          }
        });

        category.addEventListener("click", function() {
          var category = document.getElementById('category');
          if(category.options.length==0)
          {
            if( subCat.options.length==0)
            {
              alert('Oops!', 'error', "Please select a sub category first");
            }
            else if(subCat.options.length>0)
            {
              alert('Oops!', 'error', "There are no sub categories listed under the selected level 2 category. (You can add a new category)");
            }
          }

        });

    }
  };
  xhttp.open("POST", "server/getPartDetails.php", true);
  xhttp.send();
}

document.getElementById("part_submit").addEventListener("click", function()
{
  var formData = new FormData();
  var partName = document.getElementById('part_name').value;
  var weight = document.getElementById('weight').value;
  var cost = document.getElementById('cost').value;
  var description = document.getElementById('description').value;
  var vendor = document.getElementById('vendor').value;
  var qty = document.getElementById('qty').value;
  var other = document.getElementById('other').value;
  var image = document.getElementById('image');
  var resources = document.getElementById('resources');

  var mainCat = document.getElementById('mainCat');
  var mainCatIndex = mainCat.selectedIndex;
   console.log("main cat"+mainCatIndex);
  var subCat = document.getElementById('subCat');
  var subCatIndex = subCat.selectedIndex;
   console.log("sub cat"+subCatIndex);
  var category = document.getElementById('category');
  var categoryIndex = category.selectedIndex;
 console.log("cat"+categoryIndex);
  //var decimal=  /^[-+]?[0-9]+\.[0-9]+$/;
  if(partName!="")
  {
    if(weight!="")
    {
      // if(weight.match(decimal))
      // {
        if(cost!="")
        {
          // if(cost.match(decimal))
          // {
            if(vendor!="")
            {
              if(qty!="")
              {
                if(mainCatIndex>= 0 && subCatIndex>= 0 && categoryIndex>= 0)
                {
                  var mainCatId = mainCat[mainCat.selectedIndex].id;
                  var subCatId = subCat[subCat.selectedIndex].id;
                  var catId = category[category.selectedIndex].id;
                  var params = "name="+partName+"&weight="+weight+"&cost="+cost+"&vendor="+vendor+
                  "&qty="+qty+"&mainCatId="+mainCatId+"&subCatId="+subCatId+"&catId="+catId;
                  formData.append('partName',partName);
                  formData.append('weight',weight);
                  formData.append('cost',cost);
                  formData.append('vendor',vendor);
                  formData.append('qty',qty);
                  formData.append('mainCatId',mainCatId);
                  formData.append('subCatId',subCatId);
                  formData.append('catId',catId);
                  if(description!="")
                  {
                    params+="&description="+description;
                    formData.append("description",description);
                  }
                  if(other!="")
                  {
                    params+="&other="+other;
                    formData.append("other",other);
                  }
                  if(image!="")
                  {
                      params+="&image="+image.files[0];
                      formData.append("image",image.files[0]);
                  }
                  if(resources!="")
                  {
                    var resourceFiles = resources.files;
                    for(var i=0; i<resourceFiles.length;i++)
                    {
                      formData.append("resources[]", resourceFiles[i]);
                    }
                  }
                  var xhttp = new XMLHttpRequest();
                  xhttp.open("POST", "server/createPart.php", true);
                  //xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                  xhttp.onreadystatechange = function() {

                    if (this.readyState == 4 && this.status == 200) {
                      var response = JSON.parse(this.responseText);

                      if(response=="true")
                      {
                        alert('Yay!', 'success', "Successfully added the part!");
                      }
                      else
                      {
                        alert('Oops!', 'error', "Something went wrong"+response);
                      }

                    }
                  };

                  hideModal('partsModal');
                  xhttp.send(formData);
                }
                else
                {
                  alert('Oops!', 'error', "Please fill in the category fields");
                }
              }
              else
              {
                alert('Oops!', 'error', "Please enter the quantity of the specific part you would like to add");
              }
            }
            else
            {
              alert('Oops!', 'error', "Please enter the vendor reference of the part");
            }
          // }
          // else
          // {
          //   alert('Oops!', 'error', "Please enter a valid value for the cost");
          // }
        }
        else
        {
          alert('Oops!', 'error', "Please enter the total cost of the part");
        }
      // }
      // else
      // {
      //   alert("Please enter a valid value for the weight");
      // }
    }
    else
    {
      alert('Oops!', 'error', "Please enter the total weight of the part");
    }
  }
  else
  {
    alert('Oops!', 'error', "Please enter the name of the part");
  }
});

function populateCategoryFields(response, catType, responseCatType)
{
  var catTypeElement = document.getElementById(catType);

  var catTypeId = catTypeElement[catTypeElement.selectedIndex].id;
    console.log("\nid:"+catTypeId);
  var select = document.getElementById(responseCatType);
  console.log("\nid:"+responseCatType);
  catResponse = response['categories'];
  $.each(catResponse, function( key, value ) {
    if(catResponse[key]['parent']==catTypeId)
    {
      var option = document.createElement("option");
      option.setAttribute("id", catResponse[key]['id'] );
      option.text = catResponse[key]['name'];
      console.log("\nnames:"+catResponse[key]['name']);
      select.add(option);
    }
  });
}

function createPartTable(partResponse)
{
  partTable = document.getElementById('part_table');
  var tHead = document.createElement('THead');
  partTable.appendChild(tHead);

  var thRow = document.createElement('tr');
  tHead.appendChild(thRow);

  th = document.createElement('th');
  th.innerHTML = "ID";
  thRow.appendChild(th);

  headerBit = true;
  $.each(partResponse, function( key, value )
  {
    row = document.createElement('tr');
    partTable.appendChild(row);
    eachPart = partResponse[key];

    var rowArray= {};
    rowArray[0]= key;
    var count= 1;
    $.each(eachPart, function( key, value )
    {
      if(headerBit)
      {
        th = document.createElement('th');
        thTitle = key.split('_').join(' ');
        th.innerHTML = thTitle.toUpperCase();
        thRow.appendChild(th);

      }
      rowArray[count]= value;
      count++;

    });

    if(headerBit)
    {
      var dpartTable = $('#part_table').DataTable({autoWidth:false});
    }
    else
    {
      var dpartTable = $('#part_table').DataTable();
    }
    dpartTable.row.add( rowArray ).draw(false);
    headerBit=false;
    $('#part_table tbody').on('click', 'tr', function () {
        var data = dpartTable.row( this ).data();
        //alert( 'You clicked on '+data[0]+'\'s row' );
        localStorage.setItem('partId', data[0]);
        window.location.href = "singlePartPage.html";
    } );
  });

}

function hideModal(modal) {
	var modal = document.getElementById(modal);
	modal.setAttribute("class", "modal");

}
function exportParts()
{
    xHRObject = new XMLHttpRequest();
  
    xHRObject.open("GET", "server/exportParts.php", true);
    xHRObject.onreadystatechange = function() {
      if (xHRObject.readyState == 4 && xHRObject.status == 200)
      {
      }
    }
    xHRObject.send(null);

}

populatePartDetails();
