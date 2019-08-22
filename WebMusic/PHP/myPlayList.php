<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/3
 * Time: 20:23
 */
header('Content-type:text/json;charset=UTF-8');
$userId = $_GET['userId'];
// 创建连接
$conn = new mysqli('localhost', 'root', '', 'cxal');
mysqli_set_charset( $conn , "utf8" );
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql = "SELECT * FROM userplaylist WHERE userId ='{$userId}'";
$result = $conn->query($sql);
if(! $result) {
  die('无法读取数据: ' . mysqli_error($conn));
}
$data = json_encode(mysqli_fetch_all($result,MYSQLI_ASSOC),320);
// 输出数据
echo $data;
$conn->close();