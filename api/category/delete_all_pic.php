<?php



// Read the raw input data

//echo $_POST['fileList'][0]['uid'];

if (isset($_POST['fileList'])) {
    // Specify the upload folder
    $uploadFolder = '../../upload_logo/';

    foreach ($_POST['fileList'] as $index => $object) {
        //echo $object['uid'];
        $filePath = $uploadFolder . $object['uid'].'_'.basename($object['name']);

        //Check if the file exists before deleting
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    // Send a response to indicate success
    echo json_encode(['success' => true, 'message' => 'Files deleted successfully']);
} else {
    // Send a response to indicate failure
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
}

?>
