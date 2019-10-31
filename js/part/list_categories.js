

function populatePartDetails(partId)
{
  var defaultLink = "/xlr8-frc/images/default_part.png";
  var parent = document.getElementById('categoryPanel');
  while (parent.firstChild)
  {
    parent.removeChild(parent.firstChild);
  }

  var params = "id="+partId;
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "server/getCategoryDetails.php", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);

      if(response.length!=0 )
      {
        if(response!="No parts found")
        {
          rowLength = 4;
          var rowDiv = null;
          $.each( response, function( key, value ) {

            if(rowLength%4==0)
            {
              rowDiv = document.createElement('div');
              rowDiv.setAttribute("class", "row");
              parent.appendChild(rowDiv);
            }

            rowLength ++;

            var div = document.createElement("div");
            div.setAttribute("class", "col-md-3");
            div.style.width="100%";
            rowDiv.appendChild(div);

            var cardLink = document.createElement("a");
            cardLink.setAttribute("class", "custom-card");
            cardLink.setAttribute("id", key);
            cardLink.setAttribute("href", "#");
            div.appendChild(cardLink);

            document.getElementById(key).addEventListener("click", function() {
              var type = key.split("_");
              if(type[0]=='PRT')
              {
                localStorage.setItem('partId', key);
                window.location.href = "singlePartPage.html";
              }
              else
              {
                addBreadcrumb(key, document.getElementById(key));
                populatePartDetails(key);
              }

            });

            var cardDiv = document.createElement("div");
            cardDiv.setAttribute("class", "card text-center card-img-fit");
            cardLink.appendChild(cardDiv);

            var imageLink = value['image'];
            if(imageLink==null)
            {
              imageLink = defaultLink;
            }

            var img = document.createElement("img");
            img.setAttribute("class","card-img-top card-img-bg ");
            img.setAttribute("src", imageLink);
            cardDiv.appendChild(img);

            var detailDiv = document.createElement("div");
            detailDiv.setAttribute("class","card-body");
            cardDiv.appendChild(detailDiv);

            var detail = document.createElement("p");
            detail.setAttribute("class","card-text");
            detail.innerHTML = value['name'].toUpperCase();
            detailDiv.appendChild(detail);

            // document.getElementById(value['name'].toUpperCase()).addEventListener("click", function() {
            //   var main = document.getElementById('breadcrumb');
            //   var cardName = value['name'].toUpperCase();
            //   var deleted = false;
            //   var currentNode = main.childNodes;
            //    for(var i=1; i<main.childNodes.length; i+=2)
            //    {
            //      console.log(currentNode[i].id+" == "+cardName);
            //       if(currentNode[i].id == cardName)
            //       {
            //         deleted = true;
            //       }
            //
            //     if(deleted == true)
            //     {
            //       main.removeChild(currentNode[i]);
            //     }
            //   }
            // });

          });
        }
        else
        {
           alert("Oops!", 'error', response);
        }
      }
      else
      {
        alert("Oops!", 'error', "No Products found");
      }

    }
  };
  xhttp.send(params);
}

function addBreadcrumb(key, keyElement)
{
  var main = document.getElementById('breadcrumb');
  var card = document.getElementById(key).childNodes;
  var cardName = (card[0].childNodes)[1].firstChild.innerHTML;
  var newStep = document.createElement('li');
  newStep.setAttribute('class','breadcrumb-item');
  newStep.setAttribute('id', cardName);
  main.appendChild(newStep);

  var link = document.createElement('a');
  link.href = '#';
  link.addEventListener("click", function() {
    // var deleted = false;
    // var currentNode = main.childNodes;
    // console.log("len= "+main.childNodes.length);
    // for(var i=1; i<main.childNodes.length; i+=2)
    // {
    //    console.log(currentNode[i].id+" == "+cardName);
    //    if(deleted == true)
    //    {
    //      console.log("in"+i);
    //      main.removeChild(currentNode[i]);
    //      i =i-2;
    //    }
    //
    //     if(currentNode[i].id == cardName)
    //     {
    //       deleted = true;
    //     }
    // }

    populatePartDetails(key);
  });
  link.innerHTML = cardName;
  newStep.appendChild(link);
}

function getIdFromURL()
{
	var url_string = window.location.href
	var url = new URL(url_string);
	var id = url.searchParams.get("id");

	return id;
}

var id = getIdFromURL();
if(id==null)
{
  populatePartDetails("0");
}
else
{
  populatePartDetails(id);
}
