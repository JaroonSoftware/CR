<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../conn.php';

//Check Stock
$err=0;
$err_message = "";
$total = 0;
foreach ($_POST['Item'] as $index => $object) {
    $prod_code = $object['prod_code'];
    $prod_name = $object['prod_name'];
    $size = $object['size_id'];
    $size_name = $object['size_name'];
    $amount = $object['amount'];
    $total += $object['amount'] * $object['price'];
    $sql_check = "select amount from stock where prod_code = '".$prod_code."' and size_id= '".$size."' ";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->execute();
    $row_check = $stmt_check->fetch(PDO::FETCH_ASSOC);
    if($row_check['amount'] < $amount){
        if($err_message != ""){
            $err_message .= "<br> สินค้า : ".$prod_name." ขนาด : ".$size_name." ในคลังสินค้ามีไม่พอ.";
        }else{
            $err_message .= "สินค้า : ".$prod_name." ขนาด : ".$size_name." ในคลังสินค้ามีไม่พอ.";
        }
        $err++;
    }
}
//End Check Stock
if($err==0){
    //SO No
    $sql_sono = "SELECT CONCAT('SO',DATE_FORMAT(NOW(), '%y'),'/',DATE_FORMAT(NOW(), '%m'),LPAD(COUNT(id) + 1, 4, '0')) AS so_no FROM so where so_no LIKE  CONCAT('SO',DATE_FORMAT(NOW(), '%y'),'/',DATE_FORMAT(NOW(), '%m%')) ";
    $stmt_sono = $conn->prepare($sql_sono);
    $stmt_sono->execute();
    $row_so = $stmt_sono->fetch(PDO::FETCH_ASSOC);
    $sono = $row_so['so_no'];
    //end SO No
    //Insert SO
    $strSQL = "INSERT INTO so (`so_no`, `cus_name`, `address`, `subdistrict`, `district`, `province`, `zipcode`, `tel`, `embroider_prefix`, `embroider_name`, `embroider_surname`, `totalprice`, `status`, `delivery_channel`) ";
    $strSQL .= " VALUES ('" . $sono . "','" . $_POST["cus_name"] . "','" . $_POST["address"] . "','" . $_POST["subdistrict"] . "','" . $_POST["district"] . "','" . $_POST["province"] . "','" . $_POST["zipcode"] . "','" . $_POST["tel"] . "','" . $_POST["embroider_prefix"] . "','" . $_POST["embroider_name"] . "','" . $_POST["embroider_surname"] . "','" . $total . "','รอชำระ','" . $_POST["delivery_channel"] . "'";
    $strSQL .= ")";
    //echo $strSQL;
    $stmt = $conn->prepare($strSQL);
    //end Insert SO
    if ($stmt->execute()) {
        //Insert SO Detail
        $st = 1;
        foreach ($_POST['Item'] as $index => $object) {
                $prod_code = $object['prod_code'];
                $amount = $object['amount'];
                $size_id = $object['size_id'];
                $price = $object['price'];
                $totalprice = $object['price'] * $object['amount'];

                $strSqlDetail = "INSERT INTO so_detail ( `so_no`, `prod_code`, `size_id`, `amount`, `price`, `totalprice`) ";
                //  ,`s_date`,`s_time`, s_user) ";
                $strSqlDetail .= " VALUES ('" . $sono . "','" . $prod_code . "','" . $size_id . "','" . $amount . "','" . $price . "','". $totalprice . "' ";
                $strSqlDetail .= ")";
                //echo $strSqlDetail;
                $stmt_Detail = $conn->prepare($strSqlDetail);
                if($stmt_Detail->execute()){
                    $st =1;
                    //Update Stock
                    $strSQLUpdateStock = "UPDATE stock SET ";
                    $strSQLUpdateStock .= "amount= amount-'".$amount."' ,price= amtprice*amount ,amtprice= price/amount ";
                    $strSQLUpdateStock .= ",e_date='".date("Y-m-d H:i:s")."' ";
                    $strSQLUpdateStock .= "WHERE prod_code = '".$prod_code."' and size_id = '".$size_id."' ";
                    $stmtUpdateStock = $conn->prepare($strSQLUpdateStock);   
                    $stmtUpdateStock->execute();
                }else{
                    $st =0;
                    return;
                }
        }
        //end Insert SO Detail
        if ($st==1) {
            http_response_code(200);
            echo json_encode(array('status' => '1', 'message' => $sono));
        }else{
            echo json_encode(array('status' => '0', 'message' => 'Error insert Order Detail!'));
        }
    } else {
        echo json_encode(array('status' => '0', 'message' => 'Error insert Order!'));
    }
}else{
    echo json_encode(array('status' => '2', 'message' => $err_message ));
}

?>