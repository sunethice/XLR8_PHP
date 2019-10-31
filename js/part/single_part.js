function getPartDetails()
{
  var partId = localStorage.getItem('partId');
  console.log(partId);
  var params = "id="+partId;
  var cat1, cat2, cat3 = null;
  var xhttp = new XMLHttpRequest();

  xhttp.open("POST", "server/retrievePartDetails.php", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);

      if(response.length!=0)
      {
        document.getElementById("edit_part_id").innerHTML = partId;
        document.getElementById("title").innerHTML = response[partId]['name'];
        document.getElementById("part_name_ref").value = response[partId]['name'];
        document.getElementById("part_name_ref_2").value = response[partId]['name'];
        document.getElementById("edit_part_name").value = response[partId]['name'];
        document.getElementById("desc").innerHTML = response[partId]['description'];
        document.getElementById("edit_description").innerHTML = response[partId]['description'];
        document.getElementById("weight").innerHTML = response[partId]['weight'];
        document.getElementById("edit_weight").value = parseInt(response[partId]['weight']);
        document.getElementById("cost").innerHTML = response[partId]['cost'];
        document.getElementById("edit_cost").value = parseInt(response[partId]['cost']);
        document.getElementById("vendor").innerHTML = response[partId]['vendor_Reference'];
        document.getElementById("vendor_ref").value = response[partId]['vendor_Reference'];
        document.getElementById("edit_vendor").value = response[partId]['vendor_Reference'];
        document.getElementById("other").innerHTML = response[partId]['other'];
        document.getElementById("edit_other").innerHTML = response[partId]['other'];
        document.getElementById("qty").innerHTML = response[partId]['available_Quantity'];
        document.getElementById("edit_qty").value = parseInt(response[partId]['available_Quantity']);
        document.getElementById("availability").innerHTML = checkPartAvailability(response[partId]['total_Quantity'], response[partId]['available_Quantity']);
        var image = document.getElementById("image");
        image.setAttribute("src", response[partId]['image']);

        var resources = response[partId]['resources'];
        if(resources.length>0)
        {
          var res_div = document.getElementById('resources');
          for(var i=0; i<resources.length;i++)
          {
            var a = document.createElement('a');
            res_div.appendChild(a);
            a.setAttribute("download","download");
            a.setAttribute("href",resources[i]);
            var tempA = (resources[i].split("/"));
            if(tempA.length > 0)
            {
              a.innerHTML = tempA[2];
            }
            else
            {
              a.innerHTML = tempA[0];
            }
            // if(i==(resources.length-1))
            // {
            //   a.innerHTML = tempA[(tempA.length)-1];
            // }
            // else
            // {
            //   a.innerHTML = tempA[(tempA.length)-1]+ " , ";
            // }
            // a.setAttribute("href","resources/"+tempA[(tempA.length)-2]+"/"+tempA[(tempA.length)-1]);
          }
        }
        else {
          var res_div = document.getElementById('resources');
          res_div.innerHTML = "N/A";
        }

        var notesList = response[partId]['notes'];
        console.log("notes"+notesList.length);
        // if(notesList.length>0)
        // {
          console.log("hyeyy");
          createConditionTable(notesList);
        //}

      //  setBreadcrumbs(response[partId]['cat1'], response[partId]['cat2'], response[partId]['cat3']);

      cat1 = response[partId]['cat1'];
      cat2 = response[partId]['cat2'];
      cat3 = response[partId]['cat3'];
      setBreadcrumbs(cat1, cat2, cat3, document.getElementById('cat1'), document.getElementById('cat2'), document.getElementById('cat3'));

      var catResponse = response.cats;

      if(catResponse.length!=0)
      {
        var select = document.getElementById('mainCat');

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
        document.getElementById('mainCat').selectedIndex = document.getElementById(response[partId]['cat1']).index;
        //console.log("cat1: ".response[partId]['cat1']);
        populateCategoryFields(catResponse, "mainCat", "subCat");
        document.getElementById('subCat').selectedIndex = document.getElementById(response[partId]['cat2']).index;
        console.log("categ 1: "+response[partId]['cat2']);
        populateCategoryFields(catResponse, "subCat", "category");
        document.getElementById('category').selectedIndex = document.getElementById(response[partId]['cat3']).index;


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
    }

  };
  xhttp.send(params);

}

function populateCategoryFields(catResponse, catType, responseCatType)
{
  var catTypeElement = document.getElementById(catType);

  var catTypeId = catTypeElement[catTypeElement.selectedIndex].id;

  var select = document.getElementById(responseCatType);

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

function getCategoryName(catId, catElement)
{
  var params = "id="+catId;
  var xhttp = new XMLHttpRequest();
  var returnVal = null;
  xhttp.open("POST", "server/getCategoryName.php", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      returnVal = response['name'];
      console.log("in "+returnVal);
      catElement.innerHTML = returnVal;

    }

  };
  xhttp.send(params);
}


function setBreadcrumbs(cat1, cat2, cat3, catElement1, catElement2, catElement3)
{
  console.log(cat1+" "+cat2+" "+cat3);
  var catName_1 = getCategoryName(cat1, catElement1);
  var catName_2 = getCategoryName(cat2, catElement2);
  var catName_3 = getCategoryName(cat3, catElement3);

  catElement1.href = 'inventoryStore.html?id='+cat1;

  catElement2.href = 'inventoryStore.html?id='+cat2;

  catElement3.href = 'inventoryStore.html?id='+cat3;
}


function checkPartAvailability(total, available)
{
  var result = "Available";
  if(total == "0")
  {
    result = "Not Available - Out of stock";
  }
  else if(available == "0")
  {
    result = "Not Available - All pieces used";
  }
  else if(available < total)
  {
    result = "Available";
  }
  return result;
}

function createConditionTable(notes)
{
  var colors = ["table-primary", "table-success", "table-danger", "table-warning"];
  var i=0;
  var notesTableBody = document.getElementById('notesTbl');
  if(notes != null && notes != "")
  {
    $.each(notes, function( key, value ) {
      var notesRow = document.createElement('tr');
      notesRow.setAttribute('id', key);
      console.log("id is "+key);
      notesRow.setAttribute('class',colors[i]);
      if(i<4)
      {
        i++;
      }
      else {
        i=0;
      }
      notesTableBody.appendChild(notesRow);

      $.each(value, function( key_row, value_row ) {
        var td = document.createElement('td');
        td.innerHTML = value_row;
        notesRow.appendChild(td);
        console.log("row is: "+value_row);
      });
    });
  }
  else
  {
    var notesRow = document.createElement('tr');
    notesTableBody.appendChild(notesRow);
    var td = document.createElement('td');
    td.innerHTML = "No records Found";
    notesRow.appendChild(td);
  }

}

document.getElementById("part_quantity_submit").addEventListener("click", function()
{
  var newQuantity = document.getElementById('newQuantity').value;
  if(newQuantity!=null)
  {
    var params = "id="+localStorage.getItem('partId')+"&qty="+newQuantity;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "server/addPartQuantity.php", true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        if(response=='true')
        {
          alert('Yay!', 'success', "Successfully updated the part quantity.");
        }
        else {
          alert('Oops!', 'error', response);
        }
        hideModal('quantityModal');

      }

    };
    xhttp.send(params);
  }
  else
  {
    alert('Oops!', 'error', "Please enter a valid quantity");
  }
});

document.getElementById("part_notes_submit").addEventListener("click", function()
{
  var newNote = document.getElementById('notes').value;
  var status = document.getElementById('status').options[document.getElementById('status').selectedIndex].value;
console.log(status);
  if(newNote!=null)
  {
    var params = "id="+localStorage.getItem('partId')+"&note="+newNote+"&status="+status;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "server/addPartNote.php", true);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        if(response=='true')
        {
          alert('Yay!', 'success', "Successfully added a note.");
        }
        else {
          alert('Oops!', 'error', response);
        }
        hideModal('notesModal');

      }

    };
    xhttp.send(params);
  }
  else
  {
    alert('Oops!', 'error', "Please enter a valid quantity");
  }
});

document.getElementById("edit_part_submit").addEventListener("click", function()
{
  var formData = new FormData();
  var partId = localStorage.getItem('partId');
  console.log("ppp:"+partId);
  var partName = document.getElementById('edit_part_name').value;
  var weight = document.getElementById('edit_weight').value;
  var cost = document.getElementById('edit_cost').value;
  var description = document.getElementById('edit_description').value;
  var vendor = document.getElementById('edit_vendor').value;
  var other = document.getElementById('edit_other').value;
  // var image = document.getElementById('image');
  // var resources = document.getElementById('resources').value;

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
                  var params = "id="+partId+"&name="+partName+"&weight="+weight+"&cost="+cost+"&vendor="+vendor+
                  "&qty="+qty+"&mainCatId="+mainCatId+"&subCatId="+subCatId+"&catId="+catId;

                  formData.append('partId',partId);
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
                  // if(image!="")
                  // {
                  //     params+="&image="+image.files[0];
                  //     formData.append("image",image.files[0]);
                  // }
                  // if(resources!="")
                  // {
                  //   params+="&resources="+resources;
                  //   formData.append("resources",resources);
                  // }
                  var xhttp = new XMLHttpRequest();
                  xhttp.open("POST", "server/editPart.php", true);
                  //xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                  xhttp.onreadystatechange = function() {

                    if (this.readyState == 4 && this.status == 200) {
                      var response = JSON.parse(this.responseText);

                      if(response=="true")
                      {
                        alert('Yay!', 'success', "Successfully updated the part!");
                      }
                      else
                      {
                        alert('Oops!', 'error', "Something went wrong"+response);
                      }

                    }
                  };

                  hideModal('editPartModal');
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


function hideModal(modal) {
	var modal = document.getElementById(modal);
	modal.setAttribute("class", "modal");

}

function deletePart()
{
  var params = "id="+localStorage.getItem('partId');
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "server/deletePart.php", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      if(response=='true')
      {
        alert('Yay!', 'success', "Successfully deleted the part.");
        window.location.replace("parts.html");
      }
      else {
        alert('Oops!', 'error', response);
      }

    }
  };
  xhttp.send(params);
}

document.getElementById("deletePart").addEventListener("click", function()
{
  Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
	}).then((result) =>
	{
		  if (result.value)
			{
				deletePart();
      }
	})

});

// $("#editPartModal").focusout(function(){
//   console.log("hello");
//     window.location.reload();
//   });

getPartDetails();
