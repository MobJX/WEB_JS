{
    const form = document.getElementById("id_createItemForm");
    form.addEventListener("submit", (e)=>{
        e.preventDefault();

        const xhr = new XMLHttpRequest();

        xhr.open("POST","CreateNewItem" );
        const formData = new FormData(form);
        
        xhr.addEventListener("load", ()=>{
            if (xhr.status === 200){
                var response = xhr.responseText;
                // 处理返回的响应数据
                console.log(response);
            } else {
                // 请求失败处理逻辑
                console.error("请求失败: " + xhr.status);
            }
        });
        
        xhr.addEventListener("error", ()=>{
            
        });
        xhr.send(formData);
    });
}