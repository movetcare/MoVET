<?php
/**
 *
 * Contains:
 * - An example how to get appointments list from Provet Cloud
 * - An example how to send new appointments to Provet Cloud
 */


/*
 * Retrieve all appointments from Provet Cloud
 */
function getAppointmentsFromCloud() {
    global $base_url;
    global $token;

    // Get owners from Cloud
    $appointment_url = $base_url . 'appointment/?page_size=1000'; //Define URL for the request. appointments can have attribute page_size to get more than 50 results per page. Maximum 1000
    $cloud_appointments_list = json_decode(sendRequestToCloud($token, $appointment_url, array2json(array()), 'GET')); //Send GET request to Cloud and immediately decode the json into array
    $cloud_appointments_array = array();

    $list_finished = false;
    while ($list_finished != true) { //Continue until all pages are retrieved
        $cloud_appointments = $cloud_appointments_list->results; //Put results array into variable for easier handling

        foreach ($cloud_appointments as $cloud_appointment) { //Loop through retrieved appointments
            // Store what information is needed
            $cloud_appointments_array[$cloud_appointment->url]['start'] = $cloud_appointment->start;
            $cloud_appointments_array[$cloud_appointment->url]['end'] = $cloud_appointment->end;
        }

        // Get next set of records if next page exists
        if ($cloud_appointments_list->next == NULL) {
            $list_finished = true; //No more pages, mark this as final page
        }
        $cloud_appointments_list = json_decode(sendRequestToCloud($token, $cloud_appointments_list->next, array2json(array()), 'GET')); //Get next page from Cloud
    }


    return $cloud_appointments_array; //Return the finished appointment list
}

/*
 * Send appointment information to Provet Cloud
 * @source_data = Source data in a Cloud structure
 */
function sendAppointmentToCloud($source_data) {
    global $base_url;
    global $token;

    //Array of the appointment data to be sent to Cloud
    $appointment_data = array(
        "start" => $source_data["start"], // Starting date and time in XML format. Cloud times are always in UTC timezone
        "end" => $source_data["end"], // Ending date and time in XML format. Cloud times are always in UTC timezone
        "title" => $source_data["title"], //Title of the appointment *Required field*
        "complaint" => $source_data["complaint"], //Description of the appointment, this is the text visible in calendar *Required field*
        "instructions" => $source_data["instructions"], //Instructions
        "user" => $source_data["user"], // URL as the ID of the user in Cloud, tho whom the appointments is to.
        "additional_users" => $source_data["additional_users"], //Link to additional user if any, drop from data if not used
        "client" => $source_data["client"], //Client url, drop from data if not not used
        "consultation" => $source_data["consultation"], //URL of the consultation. Usually not used. Drop from data if not used
        "related_appointments" => $source_data["related_appointments"], //URL to other appoitnemnts. Usually not used. Drop from data if not used
        "duration" => $source_data["duration"], //Duration of the appaointment in minutes *Required field*
        "notes" => $source_data["notes"], //Notes of the appointments
        "active" => $source_data["active"], //Is the booking active
        "department" => $source_data["department"], //URL to whhich department the booking goes to
        "ward" => $source_data["ward"], //URL of wards. Drop from data if not used
        "type" => $source_data["type"], //Type of the appointment. 1=consultation (this requires client and patient urls) or 3=other
        "patients" => $source_data["patients"] //Array of patient urls, Drop from data if not used
    );

    if(empty($appointment_data["additional_users"])) {
        //If no data available, drop this from array before sending
        unset($appointment_data["additional_users"]);
    }

    //More validation and data handling as needed

    if(empty($appointment_data["consultation"])) {
        //If no data available, drop this from array before sending
        unset($appointment_data["consultation"]);
    }


    //Adding a new appointment
    $appointment_url = $new_owner_url = $base_url . 'appointment/'; //Set the URL as a new appointment URL
    $method = 'POST'; //Set method to POST = adding new data to Cloud


    // Call the request to send data to Cloud
    $new_cloud_appointment = json_decode(sendRequestToCloud($token, $appointment_url, array2json($appointment_data), $method));
    if ($new_cloud_appointment->url != '') {
        //Response will contain a URL if save was successful, add your success handling here
        print_r($new_cloud_appointment);
    }
    else {
        //Error occured, add your error handling here
        print_r($new_cloud_appointment); //Contains error message
    }
}


?>