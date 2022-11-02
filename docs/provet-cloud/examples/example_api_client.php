<?php
/**
 * Example Client for Provet Cloud Rest API
 * Contains
 * - Clients library (get, send & update clients)
 * - Patients library (get, send & update patients)
 * - Appointments library (get, send & update patients)
 */

// Include sending functions as well as tools
require_once('example_connection.php');
require_once('example_tools.php');

//Basic setup, these are used globally in this example client
$cloud_id = 123; //Provet Cloud ID
$token = 'Example token string'; //Provet Cloud Rest API token, setup in Cloud
$base_url = 'https://provetcloud.com/'.$cloud_id.'/api/0.1/'; //Base URL to the API for requests

//Include different libraries
include_once('example_clients.php');
include_once('example_patients.php');
include_once('example_appointments.php');

//Include example data package
include_once('example_source_data.php');


//First let's get all clients from Cloud
$cloud_clients_array = getClientsFromCloud();

//Now that we now what clients are in the system we can send our own using the source data
sendClientToCloud($example_client_data, $cloud_clients_array);

//Since we've updated the clients in Provet Cloud we should get a fresh list of clients
$cloud_clients_array = getClientsFromCloud();

// Now that we have a client in the system, we can send the patient next
// First let's again get a list of patients so that we don't create duplicates by accident
$cloud_patients_array = getPatientsFromCloud();

/*
 * And now we can send the patient data we have to Provet Cloud,
 * also remember to send the clients array as each patients needs to have a client attached to them
 */
sendPatientToCloud($example_patient_data, $cloud_patients_array);

//Since we've updated the patients in Provet Cloud we should get a fresh list of patients
$cloud_patients_array = getPatientsFromCloud();


/*
 * Now that clients and patients are in the system, we can add appointments
 */





?>