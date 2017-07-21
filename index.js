$(document).ready(() => {
    $('#xApiKey').change( function(){
	console.log(checkParams());
    });
});

const xApiKeyRegex = /\w{40}/;
function checkParams() {
    const xApiKey = $('#xApiKey').val();
    if (!xApiKeyRegex.test(xApiKey)) {
	console.log('Invalid api key');
	return false;
    }
    const endpoint = 'https://p2fub7qrhh.execute-api.us-east-1.amazonaws.com/Prod/getallbeacons';
    $.ajax({
	url: endpoint,
	type: 'GET',
	beforeSend: (xhr) => {xhr.setRequestHeader('x-api-key', xApiKey);},
	success: (response) => {
	    if (!response.ErrorMessage) {
		updateTable(response);
	    } else {
		console.log(response);
	    }
	}
    });
    
    return true;
}

function updateTable(data) {
    $('#tableHeading').html('');
    $('#tableBody').html('');
    
    let headingString = '';
    let appendString = '';
    data.forEach((beacon) => {
	headingString = '<tr>';
	appendString += '<tr>';
	for (let key in beacon) {
	    headingString += '<th>' + key + '</th>';
	    appendString += '<td>' + beacon[key]  + '</td>';
	}
	headingString += '</tr>';
	appendString += '</tr>';
    });
    
    
    $('#tableHeading').append(headingString);
    $('#tableBody').append(appendString);
}
