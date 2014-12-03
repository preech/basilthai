SelectQueue = {
    callback: null,
    show: function(queueno, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        me.form = Ext.create('Ext.Window', SelectQueueUi);
        me.bindEvent(queueno);
        me.form.show();
        me.afterShow(queueno);
    },
    bindEvent: function(queueno) {
    },
    afterShow: function(queueno) {
        var me = this;
        var panelqueue = me.getCmp('panelqueue');
        console.log(panelqueue);
        var divqueue = $(panelqueue.el.dom).find("div[id='panelqueue-innerCt']");
        var tag = '';
        for (i=1; i<=50; i++) {
            tag += "<div class='queueno";
            if (i == queueno) {
                tag += " currentqueue";
            }
            tag += "'><table cellpadding=0 cellspacing=0 width=100% height=100%><tr><td>" + i + "</td></tr></table></div>";
        }
        divqueue.append(tag);
        divqueue.find("div[class=queueno]").bind('click', function(event) {
            var comp = $(event.target).parents("div[class=queueno]:first");
            var result = comp.find("td").html();
            me.form.close();
            if (me.callback) {
                me.callback(result);
            }
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