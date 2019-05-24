<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/2
 * Time: 20:26
 */
header('Content-type:text/json;charset=UTF-8');
$userName = $_POST['userName'];
/*$password = $_POST['password'];*/
// 创建连接
$conn = new mysqli('localhost', 'root', '89259583cx', 'cxal');
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql = "SELECT userId,password FROM users WHERE userId ='{$userName}'";
$result = $conn->query($sql);
if(! $result) {
  die('无法读取数据: ' . mysqli_error($conn));
}
while($row = mysqli_fetch_assoc($result)) {
  echo json_encode($row,320);
}
$conn->close();