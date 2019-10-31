pageLoad()

function pageLoad() {

    loadComponents();
    //alert(localStorage.getItem("robotId"));
    var robotId = localStorage.getItem("robotId");

    var formData = new FormData();
    formData.append('robotId', robotId);

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "server/getRobotDetails.php", true);
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            var response = JSON.parse(this.responseText);
            //alert(this.responseText);
            if (response.length != 0) {
                if (response['robot'] == "No Robots") {


                }
                else {
                    /**
                     * details robot page
                     */
                    document.getElementById("title").innerHTML = response['robot']['name'];
                    document.getElementById("createdDate").innerHTML = "Created on " + response['robot']['CreatedDate'];
                    let imagePath = 'http://localhost:8888/xlr8-frc' + response['robot']["image"];
                    var image = document.getElementById("image");
                    image.setAttribute("src", imagePath);
                    document.getElementById("season").innerHTML = response['robot']['season'];
                    document.getElementById("compEndDate").innerHTML = response['robot']['comEndDate'];
                    document.getElementById("maxWeight").innerHTML = response['robot']['max_weight'];
                    document.getElementById("maxCost").innerHTML = response['robot']['max_cost'];

                    var cp = document.getElementById("breadCrumbCurrentPage");
                    cp.innerHTML = response['robot']['name'];
                    //document.getElementById("maxCost").innerHTML = response['robot']['max_cost'];


                    /**
                     * Edit robot details
                     */
                    document.getElementById("edit_robot_name").value = response['robot']['name'];
                    document.getElementById("edit_robot_season").value = response['robot']['season'];
                    document.getElementById("edit_max_weight").value = response['robot']['max_weight'];
                    document.getElementById("edit_total_cost").value = response['robot']['max_cost'];
                    document.getElementById("edit_comp_end_date").value = response['robot']['comEndDate'];

                    loadComponentData(robotId);
                    //alert(response['robot']);

                }

            }

        }
    };
    xhttp.send(formData);
}

function loadComponentData(robotId) {
    var xhttp = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('robotId', robotId);

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            var response = JSON.parse(this.responseText);

            if (response.length != 0) {
                if (response['components'] == "No Components") {

                }
                else {
                    createDataTable(response['components']);
                }

            }
        }
    };
    xhttp.open("POST", "server/getRobotComponents.php", true);
    xhttp.send(formData);

}

function loadComponents() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            var response = JSON.parse(this.responseText);

            if (response.length != 0) {
                if (response['components'] == "No Components") {

                }
                else {
                    createComponentList(response['components']);
                }

            }
        }
    };
    xhttp.open("POST", "server/getComponents.php", true);
    xhttp.send();

}



function createDataTable(robotComponents) {

    var table = document.getElementById("component_table");

    var headerRow = document.createElement('tr');
    table.appendChild(headerRow);

    let thComponentId = document.createElement('th');
    thComponentId.innerHTML = "Component Id";
    headerRow.appendChild(thComponentId);

    let thTypeName = document.createElement('th');
    thTypeName.innerHTML = "Type Name";
    headerRow.appendChild(thTypeName);

    let thDesc = document.createElement('th');
    thDesc.innerHTML = "Description";
    headerRow.appendChild(thDesc);

    let thWeight = document.createElement('th');
    thWeight.innerHTML = "Weight";
    headerRow.appendChild(thWeight);

    let thCost = document.createElement('th');
    thCost.innerHTML = "Cost";
    headerRow.appendChild(thCost);

    let thCompStatus = document.createElement('th');
    thCompStatus.innerHTML = "Completion Status";
    headerRow.appendChild(thCompStatus);

    let thButton = document.createElement('th');
    thButton.innerHTML = "      ";
    headerRow.appendChild(thButton);

    // let deleteButton = document.createElement('th');
    // deleteButton.innerHTML = "      ";
    // headerRow.appendChild(deleteButton);

    var currentWeight = 0;
    var currentCost = 0;

    $.each(robotComponents, function (key, value) {

        var row = document.createElement('tr');
        table.appendChild(row);

        detail = robotComponents[key];

        //alert(detail["component_id"]);

        let tdComponentId = document.createElement('td');
        tdComponentId.innerHTML = detail["component_id"];
        row.appendChild(tdComponentId);

        let tdTypeName = document.createElement('td');
        tdTypeName.innerHTML = detail["type_name"];
        row.appendChild(tdTypeName);

        let tdDesc = document.createElement('td');
        tdDesc.innerHTML = detail["description"];
        row.appendChild(tdDesc);

        let tdWeight = document.createElement('td');
        tdWeight.innerHTML = detail["weight"];
        row.appendChild(tdWeight);

        let tdCost = document.createElement('td');
        tdCost.innerHTML = detail["cost"];
        row.appendChild(tdCost);

        let tdCompStatus = document.createElement('td');

        var compStatus;
        if(detail["completion_status"] == '1'){
            compStatus = "True";
        } else if(detail["completion_status"] == '0'){
            compStatus = "False";
        } else {
            compStatus = "Unknown";
        }

        tdCompStatus.innerHTML = compStatus;
        row.appendChild(tdCompStatus);

        let button = document.createElement('a');
        button.href = '#';
        button.id = 'More Details'+key;
        button.innerHTML = 'More Details';
        button.className = 'btn btn-primary';
        button.addEventListener("click", function() {
            alert("You clicked " + key);
        });

        thButton = document.createElement('td');
        thButton.appendChild(button);
        //row.appendChild(thButton);

        let theSpan = document.createElement('span');
        theSpan.innerHTML = " "
        thButton.appendChild(theSpan);

        let deleteButton = document.createElement('a');
        deleteButton.href = '#';
        deleteButton.id = 'Delete'+ key;
        deleteButton.innerHTML = 'Delete';
        deleteButton.className = 'btn btn-danger';
        deleteButton.addEventListener("click", function() {
            deleteRobotComponent(key);
            //alert("You clicked " + key);
        });

        //thButton = document.createElement('td');
        thButton.appendChild(deleteButton);
        row.appendChild(thButton);

        currentWeight = currentWeight + parseFloat(detail["weight"]);
        currentCost = currentCost + parseFloat(detail["cost"])

    });

    document.getElementById("currentWeight").innerHTML = currentWeight+"Kg";
    document.getElementById("currentCost").innerHTML = "$"+currentCost;
    var max_weight = Number(document.getElementById("maxWeight").innerHTML);
    var max_cost = Number(document.getElementById("maxCost").innerHTML);

    if(currentCost>max_cost) {
        document.getElementById("currentCost").style = "color:red;";
    }

    if(currentWeight>max_weight) {
        document.getElementById("currentWeight").style = "color:red";
    }

}

function createComponentList(components) {

    /**     
        <a href="#" class="list-group-item">
                <h6 class="list-group-item-heading">First List Group Item Heading</h6>
                <p class="list-group-item-text">List Group Item Text</p>
        </a>
        <a href="#" class="list-group-item active">
                <h6 class="list-group-item-heading">First List Group Item Heading</h6>
                <p class="list-group-item-text">List Group Item Text</p>
        </a>
     */

    var listGroup = document.getElementById("componentList");

    $.each(components, function (key, value) {

        let listItem = document.createElement('a');
        listItem.href = '#';
        listItem.id = key;
        listItem.className = 'list-group-item';

        detail = components[key];

        let listHeader = document.createElement('h6');
        listHeader.className = 'list-group-item-heading';
        listHeader.innerHTML = detail["component_id"] + "(" + detail["type_name"] + ")";
        listItem.appendChild(listHeader);

        let listDetails = document.createElement('p');
        listDetails.className = 'list-group-item-text';
        listDetails.innerHTML = detail["description"] + "( Weight:" + detail["weight"] + ", Cost:" + detail["cost"] + ")";
        listItem.appendChild(listDetails);

        listItem.addEventListener("click", function() {

            $('.list-group-item').on('click', function() {
                var $this = $(this);
            
                $('.active').removeClass('active');
                $this.toggleClass('active')

            })
         });

        listGroup.appendChild(listItem);

    });

}

document.getElementById("component_submit").addEventListener("click", function()
{
    var formData = new FormData();
    var items = document.getElementsByClassName("list-group-item active");
    //var item = document.getElementByClassName("list-group-item active");
    if(items[0].id == '') {
        alert("Please select a component");
    } else {
        //alert(items[0].id +" "+ localStorage.getItem("robotId"));

        checkTotalWeight(items[0].id);

        formData.append('componentId',items[0].id);
        formData.append("robotId",localStorage.getItem("robotId"));

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "server/addRobotComponent.php", true);
        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                //alert(this.responseText);
                var response = JSON.parse(this.responseText);
                
                if(response=="true")
                {
                    alert("Component added successfully!");  
                    location.reload();
                }
                else
                {
                    alert("Something went wrong"+response);
                }

            }
        };
        $("#addComponent").modal("hide");
        loadComponents();
        xhttp.send(formData);
    }
});

function checkTotalWeight(componetId) {

    //alert(items[0].id +" "+ localStorage.getItem("robotId"));
    var formData = new FormData();

    formData.append('componentId',componetId);
    formData.append("robotId",localStorage.getItem("robotId"));

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "server/addComponentCheckWeightAndCost.php", true);
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);

            /**
             * msg = 1  -> weight exceeded
             * msg = 2  -> cost exceeded
             * msg = 3  -> weight and cost both exceeded
             * msg = 4  -> successful
            */

            var result = Number(this.responseText);

            if(result==1) {
                alert("Robot weight exceeded!");
            } else if(result==2) {
                alert("Robot cost exceeded!");
            } else if(result==3) {
                alert("Robot weight and cost both exceeded!");
            } else {
                //alert("Successful")
            }

            // var response = JSON.parse(this.responseText);
            
            // if(response=="true")
            // {
            //     alert("Component added successfully!");  
            //     location.reload();
            // }
            // else
            // {
            //     alert("Something went wrong"+response);
            // }

        }
    };

    xhttp.send(formData);
}


document.getElementById("robot_edit_submit").addEventListener("click", function()
{
    var formData = new FormData();
    var name = document.getElementById('edit_robot_name').value;
    var season = document.getElementById('edit_robot_season').value;
    var maxWeight = document.getElementById('edit_max_weight').value;
    var totalCost = document.getElementById('edit_total_cost').value;
    var compEndDate = document.getElementById('edit_comp_end_date').value;
    var robotId = localStorage.getItem("robotId");

    //alert(compEndDate);
    if (name.length == 0) {
        alert("Please fill the name field");
    }
    else {
        if (season.length == 0) {
            alert("Please fill the season field");
        }
        else {
            if(maxWeight == '') {
                alert("Please enter valid value for Max Weight");
            }
            else {
                if(totalCost == '') {
                    alert("Please enter valid value for Total Cost");
                }
                else {
                    var CurrentDate = new Date();
                    var enteredDate = new Date(compEndDate)
                    if(!compEndDate) {
                        alert("Please enter valid date");
                    }
                    else if(enteredDate < CurrentDate){
                        alert("Please enter future date");
                    }
                    else {

                        formData.append('name',name);
                        formData.append('season',season);
                        formData.append('maxWeight',maxWeight);
                        formData.append('totalCost',totalCost);
                        formData.append('compEnteredDate',compEndDate);
                        formData.append("robotId",robotId);

                        var xhttp = new XMLHttpRequest();
                        xhttp.open("POST", "server/editRobot.php", true);
                        xhttp.onreadystatechange = function() {

                            if (this.readyState == 4 && this.status == 200) {
                                //alert(this.responseText);
                                var response = JSON.parse(this.responseText);
                                
                                if(response=="true")
                                {
                                    alert("Robot edited successfully!");  
                                    location.reload();
                                }
                                else
                                {
                                    alert("Something went wrong"+response);
                                }

                            }
                        };
                        $("#editRobotModal").modal("hide");
                        xhttp.send(formData);
                        //var modal = document.getElementById('robotModal');    
                        
                    }
                }
            }
        }
    }
});

document.getElementById("change_image_submit").addEventListener("click", function()
{
    var formData = new FormData();

    var image = document.getElementById('edit_image');
    var robotId = localStorage.getItem("robotId");
    //alert(compEndDate);

    if(image.length == 0) {
        alert("Please upload valid image");
    } else {

        formData.append("image",image.files[0]);
        formData.append("robotId",robotId);

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "server/changeRobotImage.php", true);
        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                //alert(this.responseText);
                var response = JSON.parse(this.responseText);
                
                if(response=="true")
                {
                    alert("Robot Image Changed successfully!");  
                    location.reload();
                }
                else
                {
                    alert("Something went wrong"+response);
                }

            }
        };
        $("#robotModal").modal("hide");
        xhttp.send(formData);
        //var modal = document.getElementById('robotModal');    
    }
                    
});

document.getElementById("robotDeleteRequest").addEventListener("click", function() 
{
    // $("#deleteModel").modal("hide");
    // alert("Robot deleted");
    var formData = new FormData();

    formData.append("robotId",localStorage.getItem("robotId"));

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "server/deleteRequestRobot.php", true);
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);

            /**
             * msg = 1  -> already requested
             * msg = 2  -> successfully requested
             * msg = 3  -> Error
            */

            var result = Number(this.responseText);

            if(result==1) {
                alert("Already requested!");
            } else if(result==2) {
                alert("Successfully requested");
            } else if(result==3) {
                alert("Error in request");
            } else {
                //alert("Successful")
            }



        }
    };

    $("#deleteModel").modal("hide");
    xhttp.send(formData);


});


function deleteRobotComponent(componentId) 
{
    var formData = new FormData();

    formData.append("robotId",localStorage.getItem("robotId"));
    formData.append("componentId",componentId);

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "server/deleteRobotComponent.php", true);
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);

            var response = JSON.parse(this.responseText);
                
            if(response=="true")
            {
                alert("Component successfully deleted!");  
                location.reload();
            }
            else
            {
                alert("Something went wrong"+response);
            }
        }
    };

    $("#deleteModel").modal("hide");
    xhttp.send(formData);

}
