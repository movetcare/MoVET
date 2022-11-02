<?php
/**
 *
 * Contains:
 * - An example how to get client list from Provet Cloud
 * - An example how to send new and existing clients to Provet Cloud
 */


/*
 * Retrieve all clients from Provet Cloud
 */
function getClientsFromCloud() {
    global $base_url;
    global $token;

    // Get owners from Cloud
    $client_url = $base_url . 'client/?page_size=1000'; //Define URL for the request. Clients can have attribute page_size to get more than 50 results per page. Maximum 1000
    $cloud_clients_list = json_decode(sendRequestToCloud($token, $client_url, array2json(array()), 'GET')); //Send GET request to Cloud and immediately decode the json into array
    $cloud_clients_array = array();

    $list_finished = false;
    while ($list_finished != true) { //Continue until all pages are retrieved
        $cloud_clients = $cloud_clients_list->results; //Put results array into variable for easier handling

        foreach ($cloud_clients as $cloud_client) { //Loop through retrieved clients
            // Store old client ID and url (=client ID in Cloud) to array
            $cloud_clients_array[$cloud_client->old_client_id]['old_client_id'] = $cloud_client->old_client_id;
            $cloud_clients_array[$cloud_client->old_client_id]['url'] = $cloud_client->url;
        }

        // Get next set of records if next page exists
        if ($cloud_clients_list->next == NULL) {
            $list_finished = true; //No more pages, mark this as final page
        }
        $cloud_clients_list = json_decode(sendRequestToCloud($token, $cloud_clients_list->next, array2json(array()), 'GET')); //Get next page from Cloud
    }


    return $cloud_clients_array; //Return the finished client list
}

/*
 * Send client information to Provet Cloud
 * @source_data = Source data in a Cloud structure
 * @cloud_clients_array = Array of already existing clients in Provet Cloud
 */
function sendClientToCloud($source_data, $cloud_clients_array) {
    global $base_url;
    global $token;

    $patients_array = array();

    $old_client_id = 1; //This value should come from the source system, it is used if we want to update information in Cloud instead of adding new

    //Array of the client data to be sent to Cloud
    $client_data = array(
        "title" => $source_data["title"],
        "firstname" => $source_data["firstname"], //Required field
        "lastname" => $source_data["lastname"], //Required field
        "organization_name" => $source_data["organization_name"],
        "vat_number" => $source_data["vat_number"],
        "register_number" => $source_data["register_number"],
        "street_address" => $source_data["street_address"], //Required field
        "street_address_2" => $source_data["street_address_2"],
        "zip_code" => $source_data["zip_code"]." ", //Required field
        "city" => $source_data["city"], //Required field
        "email" => $source_data["email"], //Has to be a valid email format
        "alt_emails" => $source_data["alt_emails"],
        "id_number" => $source_data["id_number"], //May not be empty or null. If no data available, drop this from array before sending
        "old_client_id" => $source_data["old_client_id"], //ID of the client information in source system, used to reference when updating
        "critical_notes" => $source_data["critical_notes"],
        "remarks" => $source_data["remarks"],
        "archived" => $source_data["archived"], //0 = active, 1 = archived
        "country" => $source_data["country"],
        "no_sms" => $source_data["no_sms"], //Client will not receive SMS communication from Provet Cloud
        "no_email" => $source_data["no_email"],//Client will not receive Email communication from Provet Cloud
        "external" => $source_data["external"],
        "referring_vet" => $source_data["referring_vet"],
        "home_department" => $source_data["home_department"], //Clients homedepartment if Cloud has multiple departments setup, add full department URL
        "patients" => $patients_array, //Patients array can be empty at this point as patients are automatically linked to client when importing them
        "imported" => $source_data["imported"],
        "date_imported" => $source_data["date_imported"], //Date and time in XML format YYYY-MM-DDTHH:MM:SS
    );

    if(empty($client_data["id_number"])) {
        //If no data available, drop this from array before sending
        unset($client_data["id_number"]);
    }

    if(!empty($cloud_clients_array[$old_client_id]['url'])) {
        //A previous client exists in the system with this same old_client_id so let's update information instead of adding new
        $client_url = $cloud_clients_array[$old_client_id]['url']; //Set the URL from the array
        $method = 'PUT'; //Set method to PUT = updating existing info in Cloud
    }
    else {
        //Adding new info
        $client_url = $new_owner_url = $base_url . 'client/'; //Set the URL as a new client URL
        $method = 'POST'; //Set method to POST = adding new data to Cloud
    }

    // Call the request to send data to Cloud
    $new_cloud_client = json_decode(sendRequestToCloud($token, $client_url, array2json($client_data), $method));
    if ($new_cloud_client->url != '') {
        //Response will contain a URL if save was successful, add your success handling here
        print_r($new_cloud_client);
    }
    else {
        //Error occured, add your error handling here
        print_r($new_cloud_client); //Contains error message
    }


}


?>