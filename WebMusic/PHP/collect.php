<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/4
 * Time: 21:58
 */
header('Content-type:text/json;charset=UTF-8');
$userId = $_POST['userId'];
$listName = $_POST['playListName'];
$songId = $_POST['songId'];
$songName = $_POST['songName'];
$singer = $_POST['singer'];
$album = $_POST['songAlbum'];
$songTime = $_POST['songTime'];
// 创建连接
$conn = new mysqli('localhost', 'root', '', 'cxal');
mysqli_set_charset( $conn , "utf8" );
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql1 = "SELECT * FROM userplaylist WHERE userId ='{$userId}' and playListName = '{$listName}' and songId = '{$songId}'";
$sql2 = "INSERT INTO userplaylist (userId,playListName,songId) VALUES ('{$userId}','{$listName}','{$songId}')";
$sql3 = "INSERT INTO playlistmusic (songId,songName,singer,album,songTime) VALUES ('{$songId}','{$songName}','{$singer}','{$album}','{$songTime}')";
$result = $conn->query($sql1);
if ($result->num_rows) {
  echo json_encode('歌单中已有此歌',320);
} else {
  $re = $conn->query($sql2);
  $res = $conn->query($sql3);
  echo json_encode('加入歌单成功',320);
}
$conn->close();