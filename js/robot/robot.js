localStorage.clear();
populateRobots();

document.getElementById("robot_submit").addEventListener("click", function()
{
    var formData = new FormData();
    var name = document.getElementById('robot_name').value;
    var season = document.getElementById('robot_season').value;
    var maxWeight = document.getElementById('max_weight').value;
    var totalCost = document.getElementById('total_cost').value;
    var compEndDate = document.getElementById('comp_end_date').value;
    var image = document.getElementById('image');
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
                        if(image.length == 0) {
                            alert("Please upload valid image");
                        } else {

                            formData.append('name',name);
                            formData.append('season',season);
                            formData.append('maxWeight',maxWeight);
                            formData.append('totalCost',totalCost);
                            formData.append('compEnteredDate',compEndDate);
                            formData.append("image",image.files[0]);

                            var xhttp = new XMLHttpRequest();
                            xhttp.open("POST", "server/addRobot.php", true);
                            xhttp.onreadystatechange = function() {

                                if (this.readyState == 4 && this.status == 200) {
                                    //alert(this.responseText);
                                    var response = JSON.parse(this.responseText);
                                    
                                    if(response=="true")
                                    {
                                        alert("Robot added successfully!");  
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
                    }
                }
            }
        }
    }
});

function populateRobots()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            var response = JSON.parse(this.responseText);
  
            if(response.length!=0)
            {   
                if(response['robots']=="No Robots")
                {

                }
                else {
                    createRobotsCards(response['robots']);
                }
                
            }
        }
    };
  xhttp.open("POST", "server/getRobots.php", true);
  xhttp.send();
}

function createRobotsCards(robotResponse)
{
    var cardHolder = document.getElementById("robotCardsHolder");

    $.each(robotResponse, function( key, value )
    {
        detail = robotResponse[key];

        var divCard1 = document.createElement('div');
        divCard1.className = 'card';
        divCard1.style = 'width: 18rem;';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let title = document.createElement('h5');
        title.innerText = detail["name"];
        title.className = 'card-title';

        let button = document.createElement('a');
        button.href = '#';
        button.id = key;
        button.innerHTML = 'View Details';
        button.className = 'btn btn-primary';
        button.addEventListener("click", function() {
            //alert("You clicked " + key);
            localStorage.setItem('robotId', key);
            window.location.href = "robotDetailPage.html";
          });

        let image = document.createElement('img');
        let imagePath = 'http://localhost:8888/xlr8-frc/'+ detail["image"];
        image.src = imagePath;
        image.alt = 'Card image cap';
        image.style = 'height: 18rem;';
        image.className = 'card-img-top';

        let cDate = document.createElement('p');
        cDate.innerHTML = "Created Date: "+detail["CreatedDate"];
        cDate.className = 'card-text';

        cardBody.appendChild(title);
        cardBody.appendChild(cDate);
        cardBody.appendChild(button);

        divCard1.appendChild(image);
        divCard1.appendChild(cardBody);

        cardHolder.appendChild(divCard1);
    });
}



