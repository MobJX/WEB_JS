{
// 获取搜索按钮和关键字输入框的引用
    let searchButton = document.querySelector('input[name="searchButton"]');
    let keywordInput = document.getElementById('id_keyword');

// 为搜索按钮添加点击事件监听器
    searchButton.addEventListener('click', function () {
        // 获取用户输入的关键字
        let keyword = keywordInput.value;
        

        // 创建XMLHttpRequest对象
        let xhr = new XMLHttpRequest();

        // 配置AJAX请求
        xhr.open('GET', 'GetKeyAuctionList?keyword=' + keyword, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // 定义AJAX请求完成后的回调函数
        xhr.onload = function () {
            if (xhr.status === 200) {
                // 从响应中获取拍卖JSON字符串
                let auctionJsonString = xhr.responseText;

                // 解析JSON字符串为JavaScript对象
                let auctionData = JSON.parse(auctionJsonString);

                // 调用更新页面内容的函数，将拍卖数据传递给它
                updatePage(auctionData);
            } else {
                // 处理请求失败的情况
                console.error('Request failed. Status:', xhr.status);
            }
        };

        // 发送AJAX请求
        xhr.send();
    });


    // 更新页面内容的函数
    function updatePage(auctionData) {
        // 获取表格主体的引用
        var tableBody = document.getElementById('id_keyAuclistcontainerbody');

        // 清空表格内容
        tableBody.innerHTML = '';

        // 遍历拍卖数据，逐个创建表格行并插入数据
        for (var i = 0; i < auctionData.length; i++) {
            var auction = auctionData[i];

            // 创建新的表格行
            var row = document.createElement('tr');

            // 创建并插入拍卖ID列
            var auctionIdCell = document.createElement('td');
            auctionIdCell.textContent = auction.aucID;
            row.appendChild(auctionIdCell);

            // 创建并插入价格列
            var priceCell = document.createElement('td');
            priceCell.textContent = auction.aucPrice;
            row.appendChild(priceCell);

            // 创建并插入剩余时间列
            var timeRemainingCell = document.createElement('td');
            timeRemainingCell.textContent = auction.expiryDateTime;
            row.appendChild(timeRemainingCell);

            // 创建并插入详情列
            var detailsCell = document.createElement('td');
            detailsCell.textContent = auction.details;
            row.appendChild(detailsCell);

            // 将新的表格行插入到表格主体中
            tableBody.appendChild(row);
        }
    }

}