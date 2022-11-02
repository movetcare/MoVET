<?php
/**
 * Connection functions to handle the request to Provet Cloud Rest API
 */

/*
 * This function sends data to Provet Cloud using the Cloud Rest API
 * $token = Rest Api token in Cloud
 * $url = Api url to be used, use full url
 * $data = The data in a JSON array
 * $method = String, either GET, POST, PUT or FILE. Use GET when you want data from Cloud, POST when sending new a record, PUT when updating existing, FILE if uploading a file
 */
function sendRequestToCloud($token,$url,$data,$method)
{
    $ch = curl_init();

    $headers = array(
        'Authorization: Token '.$token
    );

    if($method == 'POST') {
        curl_setopt($ch, CURLOPT_POST, TRUE);
        $headers[] = 'Content-Type: application/json';
    }
    else if($method == 'PUT'){
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HTTP-Method-Override: PUT'));
        $headers[] = 'Content-Type: application/json';
    }
    else if($method == 'GET'){
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HTTP-Method-Override: GET'));
        $headers[] = 'Content-Type: application/json';
    }
    else if($method == 'FILE'){
        if (!isset($data['FILE_KEY'])) {
            throw new Exception('Parameter FILE_KEY not provided');
        }
        if (!isset($data[$data['FILE_KEY']])) {
            throw new Exception('File path not provided');
        }
        $path = realpath($data[$data['FILE_KEY']]);
        $data[$data['FILE_KEY']] = '@' . $path;
        unset($data['FILE_KEY']);
        if (version_compare(PHP_VERSION, '5.4.0') >= 0) {
            // Leave this out if PHP version is under 5.4 since this wasn't implemented yet
            curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
        }
        curl_setopt($ch, CURLOPT_POST, TRUE);
        $headers[] = 'Content-Type: multipart/form-data';
    }

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($ch, CURLINFO_HEADER_OUT, true);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    //https workarouds
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_PORT, $port);

    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_TIMEOUT_MS, 300000);
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}