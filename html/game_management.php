<?php

/*
CSV conf : 
Column 0 : Player 1 name
Column 1 : Player 1 lore
Column 2 : Player 2 name
Column 3 : Player 2 lore
*/

$response = [];

if(isset($_POST)) {

    $action = isset($_POST['action']) ? preg_replace("/[^A-Za-z0-9]/",'', strip_tags($_POST['action'])) : '';
    $token = isset($_POST['token']) ? preg_replace("/[^A-Za-z0-9]/",'', strip_tags($_POST['token'])) : '';
    $nameP1 = isset($_POST['nameP1']) ? preg_replace("/[^A-Za-z0-9]/",'', strip_tags($_POST['nameP1'])) : '';
    $nameP2 = isset($_POST['nameP2']) ? preg_replace("/[^A-Za-z0-9]/",'', strip_tags($_POST['nameP2'])) : '';
    $loreP1 = isset($_POST['loreP1']) ? (int)preg_replace("/[^0-9]/",'', strip_tags($_POST['loreP1'])) : 0;
    $loreP2 = isset($_POST['loreP2']) ? (int)preg_replace("/[^0-9]/",'', strip_tags($_POST['loreP2'])) : 0;
        
    switch($action) {
        case 'createGame': 
            if($token != '') {
                // Create the CSV file
                $csvHandler = fopen('tmp_games/'.$token.'.csv', 'w');
                fwrite($csvHandler, $nameP1.';'.$loreP1.';'.$nameP2.';'.$loreP2);
                fclose($csvHandler);
                
                $response = array('urlOBS' => 'https://llt.ritooon.xyz/?token='.$token);  
            }
            break;
        case 'loadGame':
            // Open the CSV file
            if(is_file('tmp_games/'.$token.'.csv')) {
                $row = 1;
                if (($handle = fopen('tmp_games/'.$token.'.csv', 'r')) !== FALSE) {
                    while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                        $nameP1 = $data[0];
                        $loreP1 = (int)$data[1];
                        $nameP2 = $data[2];
                        $loreP2 = (int)$data[3];
                    }
                    fclose($handle);

                    $response = array('nameP1' => $nameP1, 'loreP1' => $loreP1, 'nameP2' => $nameP2, 'loreP2' => $loreP2);
                } 
            } else {
                $response = array('nameP1' => 'Error - Create a new Game', 'loreP1' => 0, 'nameP2' => 'Error - Create a new Game', 'loreP2' => 0);
            }

            break;
        case 'updateGame':

            $updated = false;

            if($token != '') {
                // Update the data
                if(is_file('tmp_games/'.$token.'.csv')) {
                    $csvHandler = fopen('tmp_games/'.$token.'.csv', 'w');
                    fwrite($csvHandler, $nameP1.';'.$loreP1.';'.$nameP2.';'.$loreP2);
                    fclose($csvHandler);
    
                    $updated = true;
                }
            }

            $response = array('updated' => $updated);

            break;
    }
}

echo json_encode($response);