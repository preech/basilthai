//= require_tree .

Ext.onReady(function () {
    var screensize;
    var timer;
    var lastrefreshtime;
    var allOrders = {};
    var dirty = false;
    
	// $(window).on('beforeunload', function() {
        // if (Ext.getCmp('btnSave').disabled) {
            // return ;
        // }
        // else {
            // return 'Data is changed. Are you sure you want to leave?';
        // }
    // });
    Util.initial(this);
    // createStore();
    var main = Ext.create('Ta.control.Application', {
        loadConfig: function() {
            screensize = Util.getScreenSize();
            var config = {
                width: screensize.width,
                height: screensize.height,
                items: [{
                    layout: 'fit',
                    items: [{
                        id: 'pnlOrderMain',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        bodyCls: 'mainpanel',
                    }],
                }],
                // buttons: [{
                    // id: 'btnSave',
                    // text: 'save',
                    // disabled: true,
                // }, {
                    // id: 'btnNewCategory',
                    // text: 'new category',
                // }, {
                    // id: 'btnNewItem',
                    // text: 'new item',
                // }, {
                    // id: 'btnDeleteItem',
                    // text: 'delete item',
                    // hidden: true,
                // }],
            }
            return config;
        },
        afterRefresh: function() {
            if (timer) {
                clearInterval(timer);
            }
            refresh_order();
            timer = setInterval(refresh_order, 10000);
        },
    });
    
    function refresh_order(syncflag) {
        dirty = false;
        var params = {
            OrderDate: Util.dateToStr(new Date()),
            LastRefreshTime: lastrefreshtime,
        }
        Util.requestCallback('GET', null, null, params, null, function(returnData) {
            if (dirty) {
                refresh_order(true);
            }
            else {
                lastrefreshtime = returnData.RefreshTime;
                Util.each(returnData.Orders, function(order) {
                    render_order(order);
                });
            }
            refresh_duplicate();
        }, syncflag);
    }
    
    function render_order(order) {
        var ordertype = order.OrderType == 'TOGO' ? 'To Go' : 'For Here';
        if (order.Status == 'FINISH') {
            var tag = "<table cellspacing=0 cellpadding=0 border=0 width=100% style='background-color:#F1F8FE'><tr><td><span class=finishorder>";
            tag += "Queue #" + order.QueueNo + " at " + order.OrderTime.substr(0,5) + ", " + ordertype + ", " + order.OrderItems.length + " items";
            tag += "</span></td></tr></table>";
        }
        else {
            var tag = "<table border=1 width=100%><tr><td width=10% style='text-align:center'><div class=queueno>" 
                + order.QueueNo + "</div><div class=ordertype>" + ordertype + "</div><div class=ordertime>" 
                + order.OrderTime.substr(0,5) + "</div></td><td>";
            if (order.OrderItems.length > 0) {
                tag += "<table width=100%>";
                var alternateflag = true;
                Util.each(order.OrderItems, function(item) {
                    var optionstr = '';
                    if (item.PriceType == 'CHOICE') {
                        optionstr = item.ChoiceName;
                    }
                    Util.each(item.OrderOptions, function(option) {
                        if (option.DefaultFlag == 'F') {
                            if (optionstr != '') {
                                optionstr += ', ';
                            }
                            optionstr += option.OptionName;
                        }
                    });
                    if (alternateflag) {
                        tag += "<tr class=alternate>";
                    }
                    else {
                        tag += "<tr>";
                    }
                    var tagid = " orderid=" + order.Id + "/" + item.SeqNo;
                    if (item.Status == 'FINISH') {
                        tag += "<td colspan=3 width=100%><span class=finishitem>" + item.Quantity + " " + item.ItemName
                        if (optionstr) {
                            tag += " (" + optionstr + ")";
                        }
                        tag += "</span>";
                    }
                    else {
                        var fullname = item.ItemName + "|" + optionstr + "|" + (order.Remark||'');
                        tag += "<td width=40%><div class=itemname fullname='" + fullname + "'>" + item.ItemName + "</div><div class=option>" + optionstr + "</div><div class=option>" + (order.Remark||'') + "</div></td>";
                        tag += "<td width=10% style='text-align:center'><span class=quantity>" + item.Quantity + "</span></td><td width=40%>";
                        tag += "<table padding=0 spaceing=0 class='button" + (item.Status=='UNCOOK'?" current":"") + "'><tr><td" + tagid + ">Uncook</td></tr></table>";
                        tag += "<table padding=0 spaceing=0 class='button" + (item.Status=='COOKING1'?" current":"") + "'><tr><td" + tagid + ">Cook#1</td></tr></table>";
                        tag += "<table padding=0 spaceing=0 class='button" + (item.Status=='COOKING2'?" current":"") + "'><tr><td" + tagid + ">Cook#2</td></tr></table>";
                        tag += "<table padding=0 spaceing=0 class=button><tr><td" + tagid + ">Finish</td></tr></table>";
                        if (item.Quantity > 1) {
                            tag += "<table padding=0 spaceing=0 class=button><tr><td" + tagid + ">Split</td></tr></table>";
                        }
                    }
                    tag += "</td></tr>";
                    alternateflag = !alternateflag;
                });
                tag += "</table>";
            }
            tag += "</td></tr></table>";
        }
        var pnlmain = $("[id='pnlOrderMain-innerCt']").eq(0);
        var orderdom = pnlmain.find("div[orderid='" + order.Id + "']");
        if (orderdom.length == 0) {
            pnlmain.append("<div orderid=" + order.Id + " style='margin:5px;background-color:white'>" + tag + "</div>");
            orderdom = pnlmain.find("div[orderid='" + order.Id + "']");
        }
        else {
            orderdom.html(tag);
        }
        orderdom.find("td[orderid]").bind('click', function(event) {
            var button = $(event.target);
            var pair = button.attr('orderid').split('/');
            var orderid = pair[0];
            var itemseqno = pair[1];
            var command = button.text();
            switch(command) {
                case 'Uncook':
                    allOrders[orderid].OrderItems[itemseqno-1].Status = 'UNCOOK';
                    render_order(allOrders[orderid]);
                    post_order(orderid);
                    break;
                case 'Cook#1':
                    allOrders[orderid].OrderItems[itemseqno-1].Status = 'COOKING1';
                    render_order(allOrders[orderid]);
                    post_order(orderid);
                    break;
                case 'Cook#2':
                    allOrders[orderid].OrderItems[itemseqno-1].Status = 'COOKING2';
                    render_order(allOrders[orderid]);
                    post_order(orderid);
                    break;
                case 'Finish':
                    allOrders[orderid].OrderItems[itemseqno-1].Status = 'FINISH';
                    var allfinish = true;
                    Util.each(allOrders[orderid].OrderItems, function(item) {
                        if (item.Status != 'FINISH') {
                            allfinish = false;
                        }
                    });
                    if (allfinish) {
                        allOrders[orderid].Status = 'FINISH';
                    }
                    render_order(allOrders[orderid]);
                    post_order(orderid);
                    refresh_duplicate();
                    break;
                case 'Split':
                    var orderitems = allOrders[orderid].OrderItems;
                    var quantity = orderitems[itemseqno-1].Quantity;
                    var firstquantity = Math.floor(quantity / 2);
                    var secondquantity = quantity - firstquantity;
                    orderitems[itemseqno-1].Quantity = firstquantity;
                    var newitem = $.extend(null, orderitems[itemseqno-1]);
                    newitem.Id = null;
                    newitem.Quantity = secondquantity;
                    orderitems.splice(itemseqno, 0, newitem);
                    Util.each(orderitems, function(item, index) {
                        item.SeqNo = index+1;
                    });
                    render_order(allOrders[orderid]);
                    post_order(orderid);
                    refresh_duplicate();
                    break;
            }
        });
        allOrders[order.Id] = order;
    }
    
    function post_order(orderid) {
        dirty = true;
        Util.requestCallback('PUT', null, orderid, null, allOrders[orderid], null, true);
    }
    
    function refresh_duplicate() {
        var pnlmain = $("[id='pnlOrderMain-innerCt']").eq(0);
        var items = pnlmain.find("div[class='itemname']");
        for (var index = 0; index < items.length; index++) {
            var item = items.eq(index);
            var fullname = item.attr('fullname');
            item.parent().removeClass('duplicate');
            for (var aindex = 0; aindex < items.length; aindex++) {
                var aitem = items.eq(aindex);
                if (aitem.attr('fullname') == fullname && index != aindex) {
                    item.parent().addClass('duplicate');
                    break;
                }
            }
        }
    }
});
