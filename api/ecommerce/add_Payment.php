<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    date_default_timezone_set('Asia/Bangkok');
    include '../conn.php';

        //pic slip
        $uid= "";
        $name= "";
        $Filename= "";
        foreach ($_POST['slip'] as $index => $object) {
            if ($object['status'] == 'done') {
                $uid = $object['uid'];
                $name = $object['name'];
                $Filename = $object['uid'] . '_' . basename($object['name']);
            }
        }
        //
        $strSQL = "INSERT INTO payment (`so_no`, `contact_name`, `tel`, `price`, `date`, `time`, `bank`, `slip`, `status`)  ";
        $strSQL .= " VALUES ('".$_POST["so_no"]."','".$_POST["contact_name"]."','".$_POST["tel"]."','".$_POST["price"]."','" . date('Y-m-d', strtotime($_POST["date"])) . "','" . date('H:i:s', strtotime($_POST["time"])) . "','".$_POST["bank"]."','".$Filename."','รอตรวจสอบ' ";
        $strSQL .= ")";	
        $stmt = $conn->prepare($strSQL);  
        
            if ($stmt->execute()) {
                http_response_code(200);
                //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
                echo json_encode(array('status' => '1','message'=> 'ยืนยันการชำระเงินสำเร็จ '));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
            }
?>