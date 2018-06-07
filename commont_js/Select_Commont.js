(function(window, $) {
    /* 内部局部变量声明 */
    let input, filter, ul, li, a, i,tempDataSource;
    ul = document.getElementById("myul");

    /* DOM模拟Select模板 */
    let HTMLS = {
        ovl:'<div id="mySelect">'+ '<div class="select">'+
            '<input type="text" id="text_left"/>'+
            '<span id="arrow_right"></span>'+
            '</div>'+
            '<ul class="list" id="myul">'+
            '</ul>'+
            '</div>'
    }

    let MySelect = function(selectData,selectId,dataUrl){
         this.dataSource = selectData;
         this.selectId   = selectId;
         this.dataUrl    = dataUrl;

         console.log(selectData);
         console.log(selectId);
         this.init();
         this.selectLoad();
        }

    /* 定义属性和方法--后期可以扩展 */
    MySelect.prototype = {
        init: function() {
            console.log(1)
            this.createDom();
        },

        createDom: function() {
            let selectAre = $("#"+this.selectId);
                ovl  = $("#mySelect");

            if (ovl.length === 0) {
                selectAre.append(HTMLS.ovl);
            }
        },

/*        X-XSS-Protection: 0*/
        /* 异步动态添加数据 */
        loadAsycData:function(dataUrl){
            ul = document.getElementById("myul");
            $.ajax({
                timeout: 3000,
                async: true,
                type: "post",
                url: dataUrl,
                dataType : "jsonp",//jsonp数据类型 
                success: function (data) {
                let tempArr = data[0];
                for (i = 0; i < tempArr.length; i++) {
                        let li = document.createElement("li");
                        li.innerHTML = tempArr[i];
                        ul.appendChild(li);
                    }
                },

                error:function(){  
                    console.log('loadAsycData failed');  
                }  
            });

        },

        /* 功能性加载 */
        selectLoad:function(){
            //this.loadAsycData(this.dataUrl);
            /* 手动构造模拟数据测试加载 */
            tempDataSource = this.dataSource;
            console.log(tempDataSource);
            ul = document.getElementById("myul");
            for (i = 0; i < tempDataSource.length; i++) {
                        let li = document.createElement("li");
                        li.innerHTML = tempDataSource[i];
                        ul.appendChild(li);
                    }

        /* 绑定点击事件 */
        $('#arrow_right').click(function(e){
            $('.list').toggle();
            e.stopPropagation();

         $('body').click(function(){
          $('.list').hide();
          })
        })

       $('.list li').click(function(){
        $('#text_left').val(($(this).text())); 
        })

       /* 匹配前缀text 并红色显示 */
        $('#text_left').bind('input propertychange', function() {  
            ul     = document.getElementById("myul");
            li     = document.getElementsByTagName('li');
            input  = document.getElementById('text_left');
            filter = input.value;
            
            for (i = 0; i < li.length; i++) {
                a = li[i];
                if (a.innerText.indexOf(filter) == 0 && filter != '') {
                    $(".list").css("display","block"); 
                    li[i].style.display = "";

                    /* DOM 结构替换达到字符颜色 */
                    let reg     = new RegExp("(^" + input.value + ")", "g"); 
                    a.innerHTML = a.innerText.replace(reg, "<font color='red'>"+input.value+"</font>");
                } else {
                    li[i].style.display = "none";
                    a.innerHTML         = a.innerHTML.replace(/<[^>]*>/gi, "");  
                }
            }

            /* 清空还原格式 */
            if (filter == ''){
                $(".list").css("display","none");
                $('.list li').css("display","");
            }
        })
        },

        myAlert:function(){
        alert(1);
    }
    }
    
    window.newSelect = MySelect;
})(window, $);