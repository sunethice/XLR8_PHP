//Swal alerts
// function main()
// {
//  var type, title;
//  var success = { "Yay! It works" };
//  var error = array();
//
//  if(error.length == 0)
//  {
//   type='success';
//   title = 'Success!';
//  }
//  else
//  {
//   type = 'error';
//   title = 'Oops!';
//  }
// ​
//  var body = createSwalAlertBody(success, error);
//  createSwalAlert(title, type, body);
// ​
//  Swal.getConfirmButton().addEventListener("click", function() { location.reload() });
// }

/*
* Creates the alert of given type
* type can be success, error, info
*/
function alert(title, type, body)
{
	Swal.fire({
		title: title,
		html: body,
		type: type,
		confirmButtonText: 'OK'
	});
	//	Swal.showLoading();
  Swal.getConfirmButton().addEventListener("click", function() { location.reload() });

}


/*
* Creates the body of an alert message to include the success and error statuses of each step altered
* @param successArr - array of success messages
* @param successArr - array of error messages
*/
function createAlertBody(successArr, errorArr)
{
	var body = "<div> ";
	if(successArr.length>0)
	{
		body+= "<ul class='list-marks list-checkmarks'>";

		for(var i=0;i<successArr.length;i++)
		{
			body += "<li>"+successArr[i]+"</li>";
		}
	}

	if(errorArr.length>0)
	{
		body+="</ul> <ul class='list-marks list-crossmarks'> ";
		for(var i=0;i<errorArr.length;i++)
		{
			body += "<li>"+errorArr[i]+"</li>";
		}
	}

	body+= "</ul></div>";
	return body;
}

function confirmAlert()
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
				console.log("true");
		  	return true;
		  }
			else
			{
				console.log("false");
				return false;
			}
	})

}
