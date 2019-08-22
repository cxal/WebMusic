<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/4
 * Time: 16:30
 */
header('Content-type:text/json;charset=UTF-8');
$userId = $_POST['userId'];
$playlist = $_POST['playlist'];
// 创建连接
$conn = new mysqli('localhost', 'root', '', 'cxal');
mysqli_set_charset( $conn , "utf8" );
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql = "SELECT songId FROM userplaylist WHERE userId ='{$userId}' and playListName = '{$playlist}'";
$result = $conn->query($sql);
if(! $result) {
  die('无法读取数据: ' . mysqli_error($conn));
}
while($data = mysqli_fetch_all($result)) {
  echo json_encode($data,320);
}
$conn->close();