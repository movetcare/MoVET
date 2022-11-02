<?php
/**
 * This file contains example source data that can be used with the API client
 */


$example_client_data = array(
    "title" => "Mr",
    "firstname" => "Alex", //*Required field*
    "lastname" => "Example", //*Required field*
    "organization_name" => "",
    "vat_number" => "",
    "register_number" => "",
    "street_address" => "Testroad 15", //*Required field*
    "street_address_2" => "",
    "zip_code" => "11112"." ", //*Required field*
    "city" => "Testcity", //*Required field*
    "email" => "alex.example@provetcloud.com", //Has to be a valid email format
    "alt_emails" => "",
    "id_number" => "", //May not be empty or null. If no data available, drop this from array before sending
    "old_client_id" => 123, //ID of the client information in source system, used to reference when updating
    "critical_notes" => "",
    "remarks" => "Example case",
    "archived" => 0, //0 = active, 1 = archived
    "country" => "US",
    "no_sms" => 0, //Client will not receive SMS communication from Provet Cloud
    "no_email" => 0,//Client will not receive Email communication from Provet Cloud
    "external" => 0,
    "referring_vet" => 0,
    "home_department" => "", //Clients homedepartment if Cloud has multiple departments setup, add full department URL
    "patients" => $patients_array, //Patients array can be empty at this point as patients are automatically linked to client when importing them
    "imported" => 1,
    "date_imported" => unixtime2xmltime(time()), //Date and time in XML format YYYY-MM-DDTHH:MM:SS
);


$example_patient_data = array(
    "client" => "https://provetcloud.com/123/api/0.1/client/1/", //Client URL in Cloud which acts as the clients ID. This whill automaticvally map the patient to the client
    "name" => "Example dog", //Patient name *Required field*
    "species" => '123' . '001', //Species ID in Cloud. Needs to have a ending number of 001 for own species list or 002 for Venom species list. *Required field*
    "breed" => '456' . '001',//Breed ID in Cloud. Needs to have a ending number of 001 for own breed list or 002 for Venom breed list. Has to be a valid value in Cloud. If no valid data available, drop this from array before sending
    "gender" => 1, //Gender's ID in Cloud 0=unknown, 1=male, 2=female, 3=castrated male, 4=sterilized female
    "date_of_birth" => "2016-01-01", //Date in XML format YYYY-MM-DD
    "color" => "Grey",
    "critical_notes" => "Critical!",
    "remarks" => "Example dog for example",
    "old_patient_id" => 1, //ID of the patient information in source system, used to reference when updating
    "microchip" => "123456789101112", //Microchip number. Only valid at exactly 15 characters long. If no valid data available, drop this from array before sending
    "archived" => 0, //0 = active, 1 = archived
    "deceased" => "", //Date in XML format YYYY-MM-DD
    "reason_of_death" => "",
    "insurance" => "", //Insurance number in Cloud, May not be empty or null. If no data available, drop this from array before sending
    "passport_number" => "", //May not be empty or null. If no data available, drop this from array before sending
    "official_name" => "The Example dog", //May not be empty or null. If no data available, drop this from array before sending
    "current_location" => "", //Current location Cloud if big hisital for example. Can be left empty
    "last_consultation" => null, //Last consultation date in Cloud, leeave as null
    "notes" => array(), //Referances to already sent notes. This array can be left as empty array
    "blood_group" => 1,
    "home_department" => "", //Clients homedepartment if Cloud has multiple departments setup, add full department URL
    "insurance_company" => "", //Insurance company ID in Cloud, May not be empty or null. If no data available, drop this from array before sending
);

$patients_array = array("https://provetcloud.com/123/api/0.1/patient/1/");
$example_appointment_data = array(
    "start" => "2017-02-22T07:30:00Z", // Starting date and time in XML format. Cloud times are always in UTC timezone *Required field*
    "end" => "2017-02-22T07:45:00Z", // Ending date and time in XML format. Cloud times are always in UTC timezone *Required field*
    "title" => "Vaccination", //Title of the appointment *Required field*
    "complaint" => "Rabies vaccination", //Description of the appointment, this is the text visible in calendar *Required field*
    "instructions" => "", //Instructions
    "user" => "https://provetcloud.com/123/api/0.1/user/2/", // URL as the ID of the user in Cloud, tho whom the appointments is to. *Required field*
    "additional_users" => "", //Link to additional user if any, drop from data if not used
    "client" => "https://provetcloud.com/123/api/0.1/client/1/", //Client url, drop from data if not not used
    "consultation" => "", //URL of the consultation. Usually not used. Drop from data if not used
    "related_appointments" => "", //URL to other appoitnemnts. Usually not used. Drop from data if not used
    "duration" => 15, //Duration of the appaointment in minutes *Required field*
    "notes" => "", //Notes of the appointments
    "active" => 1, //Is the booking active
    "department" => "https://provetcloud.com/123/api/0.1/department/1/", //URL to whhich department the booking goes to
    "ward" => null, //URL of wards. Drop from data if not used
    "type" => 3, //Type of the appointment. 1=consultation (this requires client and patient urls) or 3=other
    "patients" => $patients_array //Array of patient urls, Drop from data if not used
);