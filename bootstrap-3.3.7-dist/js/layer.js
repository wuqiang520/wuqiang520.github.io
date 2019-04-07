!(function(){
    window.layer = {
        open:open,
        close:close
    };

    var defaultConfig = {
        title:'信息',
        offset:'auto',
        area:['300px','100px'],
        shade:['#000000','0.6'],
        shadeClose:false,
        btns:false,
        content:'',
        type:1,
        success:false,
        end:false,
        move:false
    };
    var index = 0,zIndex = 19891020,ends={},wWidth=$(window).width(),wHeight = $(window).height(), btns_event = {},entity_objs = {};

    function open(config){
        index++;
        //合并配置项
        btns_event[index] = {};
        var currentConfig = $.extend(true,{},defaultConfig,config);
        var space = $('<div class="zhiliaotang-layer" style="width: '+currentConfig.area[0]+';z-index: '+(zIndex+index)+';" data-index="'+index+'"></div>');
        var shade = null;
        var btns_space = null;
        var moveClass = currentConfig.move ? "zhiliaotang-move" : "";
        if(currentConfig.title !== false){
            space.append('<div class="zhiliaotang-title'+moveClass+'">'+currentConfig.title+'</div>');
        }
        var content = $('<div class="zhiliaotang-content" style="height: '+currentConfig.area[1]+';"></div>');
        content.append(currentConfig.content);
        space.append(content);
        //判断按钮
        if(currentConfig.btns instanceof Array){
            btns_space = $('<div class="zhiliaotang-btns-space"></div>');
            for(var i = 0;i < currentConfig.btns.length;i++){
                btns_space.append('<button class="zhiliaotang-btn" data-index="'+(i+1)+'">'+currentConfig.btns[i]+'</button>');
                if(i === 0){
                    if(typeof currentConfig.yes === "function"){
                        btns_event[index][(i+1)] = currentConfig.yes;
                    }
                }
                else if(i === 1){
                    if(typeof currentConfig.cancel === "function"){
                        btns_event[index][(i+1)] = currentConfig.cancel;
                    }
                }
                else{
                    if(typeof currentConfig["btn"+(i+1)] === "function"){
                        btns_event[index][(i+1)] = currentConfig["btn"+(i+1)];
                    }
                }
            }
            space.append(btns_space);
        }

        //遮罩层
        if(currentConfig.shade !== false){
            shade = $('<div class="zhiliaotang-shade" data-index="'+index+'" data-shadeclose="0"></div>');
            shade.css({
                backgroundColor:currentConfig.shade[0],
                opacity:currentConfig.shade[1],
                zIndex:(zIndex+index-1)
            });
            if(currentConfig.shadeClose === true){
                shade.attr("data-shadeclose","1");
            }
        }

        if(typeof currentConfig.end === "function"){
            ends[index] = currentConfig.end;
        }

        $("body").append(shade);
        $("body").append(space);
        entity_objs[index] = space;
        if(currentConfig.offset instanceof Array){
            space.css({
                top:currentConfig.offset[0],
                left:currentConfig.offset[1]
            });
        }
        else if(currentConfig.offset === "auto"){
            space.css({
                top:(wHeight-space.height())/2,
                left:(wWidth-parseFloat(currentConfig.area[0]))/2
            });
        }
        else{
            space.css({
                top:currentConfig.offset,
                left:(wWidth-parseFloat(currentConfig.area[0]))/2,
                right:0
            });
        }
        if(typeof currentConfig.success === "function"){
            currentConfig.success(space);
        }
    }

    function close(index){
        $(".zhiliaotang-shade[data-index='"+index+"']").remove();
        $(".zhiliaotang-layer[data-index='"+index+"']").remove();
        if(typeof ends[index] === "function"){
            ends[index]();
            delete ends[index];
        }
        delete btns_event[index];
        delete entity_objs[index];
    }

    $(document).on('click','.zhiliaotang-shade',function(){
        var index = $(this).data("index");
        var shadeClose = $(this).data("shadeclose");
        if(shadeClose == "1"){
            close(index);
        }
    });
    $(document).on('click','.zhiliaotang-btn',function(){
        var that = $(this);
        var btn_index = that.data("index");
        var layer_index = that.parents(".zhiliaotang-layer").data("index");
        btns_event[layer_index][btn_index](entity_objs[layer_index]);
    });

    //拖动层代码
    $(document).on('mousedown','.zhiliaotang-move',function(e){
        var startX = e.pageX;
        var startY = e.pageY;
        var obj = $(this).parents(".zhiliaotang-layer");
        var startTop = obj.offset().top;
        var startLeft = obj.offset().left;
        $(window).on('mousemove',function(e){
            var endX = e.pageX;
            var endY = e.pageY;
            obj.css({
                top:startTop+endY-startY,
                left:startLeft+endX-startX
            });
        });
        $(document).one('mouseup','.zhiliaotang-move',function(){
            $(window).off("mousemove");
        });
    });

})();