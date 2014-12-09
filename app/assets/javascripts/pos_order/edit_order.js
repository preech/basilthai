EditOrder = {
    callback: null,
    show: function(callbackfn) {
        var me = this;
        me.callback = callbackfn;
        me.form = Ext.create('Ext.Window', EditOrderUi);
        me.beforeShow();
        me.form.show();
        me.afterShow();
    },
    beforeShow: function() {
        var me = this;
    },
    afterShow: function() {
        var me = this;
        Util.requestCallback('GET', 'index', null, { OrderDate: Util.dateToStr(new Date()) }, null, function(returnData) {
            var tag = "";
            Util.each(returnData, function(order) {
                tag += "<div class='oldorder' orderid=" + order.Id + "><span style='font-size:150%'>" + order.QueueNo + "</span><br>";
                tag += order.OrderType == 'FORHERE' ? 'For Here' : 'To Go';
                tag += "<br>" + order.OrderTime.substring(0,5);
                tag += "<div class='ruler'></div>";
                tag += "<div class='olditem'>";
                Util.each(order.OrderItems, function(item) {
                    tag += item.Quantity + " " + item.ItemName + "<br>";
                });
                tag += "</div>";
                tag += "</div>";
            });
            var panelorderlist = me.getCmp('panelorderlist');
            var panel = $(panelorderlist.el.dom).find("div[id='panelorderlist-innerCt']");
            panel.append(tag);
            panel.find("div[class='oldorder']").bind('click', function(event) {
                var panelorder = $(event.target);
                if (panelorder.attr('class') != 'oldorder') {
                    panelorder = panelorder.parents("div[class='oldorder']:first");
                }
                var orderid = panelorder.attr('orderid');
                me.form.close();
                if (me.callback) {
                    me.callback(orderid);
                }
            });
            panelorderlist.setWidth(returnData.length*130);
        });
    },
    getCmp: function(id) {
        var me = this;
        var query = me.form.query('#' + id);
        if (query) {
            return query[0];
        }
    },
}