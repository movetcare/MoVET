<?php
/**
 * Helper functions to handle data
 */

/**
 * Read multilevel php array into JSON format
 * @param $array
 * @return string
 */
function array2json($array) {

    $array = encodeRecursive($array);
    $json = json_encode($array);
    return $json;

}

/*
 * Recursive UTF-8 encoding for a multilevel array
 */
function encodeRecursive($array, $depth=0) {

    if($depth > 800) {
        // Crash if too long an array in depth
        error_log(__FUNCTION__ . ": recursion depth is over 800 " . $_SERVER['REQUEST_URI']);
    }
    if (!is_array($array)) {
        return;
    }
    $helper = array();

    foreach ($array as $key => $value) {
        if(is_object($value)) {
            $value = (array)$value;
        }
        $helper[utf8_encode($key)] = is_array($value) ? encodeRecursive($value, $depth + 1) : (mb_detect_encoding($value, 'UTF-8', true) != 'UTF-8' ? utf8_encode($value) : $value);
    }

    return $helper;

}

/**
* Transfer unixtimestamp into XML time
*/
function unixtime2xmltime( $time = false ) {
    if(!empty($time)) {
        return date("Y-m-d", $time) . 'T' . date("H:i:s", $time);
    }
    else {
        return false;
    }
}