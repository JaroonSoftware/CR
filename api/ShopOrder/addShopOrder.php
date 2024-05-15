<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;

//Total Price
$err=0;
$err_message = "";
$total = 0;
foreach ($_POST['Item'] as $index => $object) {
    $total += $object['amount'] * $object['price'];
}
//End Total Price

//SO No
$sql_so_no = "SELECT CONCAT('SO',DATE_FORMAT(NOW(), '%y'),'/',DATE_FORMAT(NOW(), '%m'),LPAD(COUNT(id) + 1, 4, '0')) AS so_no FROM so where so_no LIKE CONCAT('SO',DATE_FORMAT(NOW(), '%y'),'/',DATE_FORMAT(NOW(), '%m%')) ";
$stmt_so_no = $conn->prepare($sql_so_no);
$stmt_so_no->execute();
$row_so = $stmt_so_no->fetch(PDO::FETCH_ASSOC);
$so_no = $row_so['so_no'];
//end SO No
$conn->beginTransaction();
//Insert SO 
$strSQL = "INSERT INTO so (`so_no`, `cus_name`, `address`, `subdistrict`, `district`, `province`, `zipcode`, `tel`, `totalprice`, `status`, `c_by`) ";
$strSQL .= " VALUES ('" . $so_no . "','" . $_POST["cus_name"] . "','" . $_POST["address"] . "','" . $_POST["subdistrict"] . "','" . $_POST["district"] . "','" . $_POST["province"] . "','" . $_POST["zipcode"] . "','" . $_POST["tel"] . "','" . $total . "','รอชำระ','" . $action_by . "' ";
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
            $strSqlDetail .= " VALUES ('" . $so_no . "','" . $prod_code . "','" . $size_id . "','" . $amount . "','" . $price . "','". $totalprice . "' ";
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
        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => '1', 'message' => $so_no));
    }else{
        $conn->rollback();
        echo json_encode(array('status' => '0', 'message' => 'Error insert Order Detail!'));
    }
} else {
    $conn->rollback();
    echo json_encode(array('status' => '0', 'message' => 'Error insert Order!'));
}
