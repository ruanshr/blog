# 滚动

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }
    .container{
      background-color: #EFEFEF;
      padding: 30px 0;
      /** overflow: hidden; */
    }
    .container::after {
      content: "";
      display: block;
      clear: both;
    }
    .title {
      float: left;
      font-size: 16px;
      font-weight: normal;
      margin-left: 20px;
      height: 30px;
      line-height: 30px;
      padding-right: 30px;
      border-right: 1px solid #ccc;
    }
    .list {
      float: left;
      list-style: none;
      padding: 0;
      margin: 0 30px;
      border: 1px solid #EFEFEF;
      height: 30px;
      overflow: hidden;
    }
    .list li {
      height: 30px;
      line-height: 30px;
    }
  </style>
</head>
<body>

  <div class="container"">
    <h1 class="title">最新公告</h1>
    <ul class="list">
      <li class="item">测试11测试数据</li>
      <li class="item">测试12测试数据</li>
      <li class="item">测试13测试数据</li>
    </ul>
  </div>
  <script>
    (function () {
      const list = document.querySelector(".list");
      function cloneFirstItem() {
        var firstItem = list.children[0];
        var newItem = firstItem.cloneNode(true);
        list.appendChild(newItem);
      }
      var duration = 2000;
      var listItemHeight = 30;

      function startScroll(duration, height, total) {
        var curIndex = 0;
        setInterval(function run () {
          var from = curIndex * height;
          curIndex++ ;
          var to = curIndex * height;
          var totalDuration = 500;
          var dur = 10;
          var times = totalDuration / dur;
          var dis = (to - from) / times;
          var timer = setInterval(() => {
            from += dis;
            if (from >= to) {
              clearInterval(timer);
              if (curIndex == total - 1) {
                curIndex = 0;
                from = 0;
              }
            }
            list.scrollTop = from;
          })

        }, duration);
      }
      cloneFirstItem();
      startScroll(duration, listItemHeight, list.children.length);

    })()
  </script>
</body>
</html>

```
