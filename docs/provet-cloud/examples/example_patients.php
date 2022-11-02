<?php
/**
 * Example Client for Provet Cloud Rest API
 * Contains:
 * - An example how to get patient list from Provet Cloud
 * - An example how to send new and existing patients to Provet Cloud
 */

/*
 * Retrieve all patients from Provet Cloud
 */
function getPatientsFromCloud() {
    global $base_url;
    global $token;

    // Get owners from Cloud
    $patient_url = $base_url . 'patient/?page_size=1000'; //Define URL for the request. patients can have attribute page_size to get more than 50 results per page. Maximum 1000
    $cloud_patients_list = json_decode(sendRequestToCloud($token, $patient_url, array2json(array()), 'GET')); //Send GET request to Cloud and immediately decode the json into array
    $cloud_patients_array = array();

    $list_finished = false;
    while ($list_finished != true) { //Continue until all pages are retrieved
        $cloud_patients = $cloud_patients_list->results; //Put results array into variable for easier handling

        foreach ($cloud_patients as $cloud_patient) { //Loop through retrieved patients
            // Store old patient ID and url (=patient ID in Cloud) to array
            $cloud_patients_array[$cloud_patient->old_patient_id]['old_patient_id'] = $cloud_patient->old_patient_id;
            $cloud_patients_array[$cloud_patient->old_patient_id]['url'] = $cloud_patient->url;
        }

        // Get next set of records if next page exists
        if ($cloud_patients_list->next == NULL) {
            $list_finished = true; //No more pages, mark this as final page
        }
        $cloud_patients_list = json_decode(sendRequestToCloud($token, $cloud_patients_list->next, array2json(array()), 'GET')); //Get next page from Cloud
    }


    return $cloud_patients_array; //Return the finished patient list
}

/*
 * Send patient information to Provet Cloud
 * @source_data = Source data in a Cloud structure
 * @cloud_clients_array = Array of already existing clients in Provet Cloud
 * @cloud_patients_array = Array of already existing patients in Provet Cloud
 */
function sendPatientToCloud($source_data, $cloud_patients_array) {
    global $base_url;
    global $token;

    $old_patient_id = 1; //This value should come from the source system, it is used if we want to update information in Cloud instead of adding new

    //Array of the client data to be sent to Cloud
    $patient_data = array(
        "client" => $source_data["client"],
        "name" => $source_data["name"],
        "species" => $source_data["species"],
        "breed" => $source_data["breed"],
        "gender" => $source_data["gender"],
        "date_of_birth" => $source_data["date_of_birth"],
        "color" => $source_data["color"],
        "critical_notes" => $source_data["critical_notes"],
        "remarks" => $source_data["remarks"],
        "old_patient_id" => $source_data["old_patient_id"],
        "microchip" => $source_data["microchip"],
        "archived" => $source_data["archived"],
        "deceased" => $source_data["deceased"],
        "reason_of_death" => $source_data["reason_of_death"],
        "insurance" => $source_data["insurance"],
        "passport_number" => $source_data["passport_number"],
        "official_name" => $source_data["official_name"],
        "current_location" => $source_data["current_location"],
        "last_consultation" => $source_data["last_consultation"],
        "notes" => $source_data["notes"],
        "blood_group" => $source_data["blood_group"],
        "home_department" => $source_data["home_department"],
        "insurance_company" => $source_data["insurance_company"],
    );

    if(!empty($patient_data["breed"])) {
        // Drop breed if empty
        unset($patient_data["breed"]);
    }
    
    if(!empty($patient_data["microchip"]) OR strlen($patient_data["microchip"]) != 15) {
        // Drop microchip if empty or not at 15 characters in length
        unset($patient_data["microchip"]);
    }

    if(!empty($patient_data["insurance"])) {
        // Drop insurance if empty
        unset($patient_data["insurance"]);
    }

    if(!empty($patient_data["insurance_company"])) {
        // Drop insurance_company if empty
        unset($patient_data["insurance_company"]);
    }

    if(!empty($cloud_patients_array[$old_patient_id]['url'])) {
        //A previous patient exists in the system with this same old_patient_id so let's update information instead of adding new
        $patient_url = $cloud_patients_array[$old_patient_id]['url']; //Set the URL from the array
        $method = 'PUT'; //Set method to PUT = updating existing info in Cloud
    }
    else {
        //Adding new info
        $patient_url = $new_owner_url = $base_url . 'patient/'; //Set the URL as a new patient URL
        $method = 'POST'; //Set method to POST = adding new data to Cloud
    }

    // Call the request to send data to Cloud
    $new_cloud_patient = json_decode(sendRequestToCloud($token, $patient_url, array2json($patient_data), $method));
    if ($new_cloud_patient->url != '') {
        //Response will contain a URL if save was successful, add your success handling here
        print_r($new_cloud_patient);
    }
    else {
        //Error occured, add your error handling here
        print_r($new_cloud_patient); //Contains error message
    }


}


?>