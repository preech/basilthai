Ext.ns('Ta');
Global = {
    message: function(obj) {
        var box = Ext.getCmp('_boxstatus');
        if (box) {
            if (obj === '[clear]') {
                var s = '';
            }
            else if (obj === undefined) {
                var s = 'undefined';
            }
            else if (obj === null) {
                var s = 'null';
            }
            else if (typeof obj === 'string') {
                var s = '"' + obj + '"';
            }
            else if (obj.id) {
                var s = obj.tagName + ':' + obj.id;
            }
            else {
                var s = obj.toString();
            }
            box.setText(s);
        }
    }
}
message = Global.message;
Ext.define('Ta.control.Application', {
    extend: 'Ext.container.Viewport',
    alias: ['widget.application'],
    constructor: function(config) {
        var screenSize = Util.getScreenSize();
        var newconfig = {
            layout: 'absolute',
            items: [{
                layout: 'border',
                id: '_viewportpanel',
                width: screenSize.width,
                height: screenSize.height,
                items: [{
                    id: '_buttonpanel',
                    region: 'north',
                    border: false,
                    margin: '0 0 5 0',
                    defaults: {
                        xtype: 'button',
                        margin: '3 0 2 10',
                    }
                }, {
                    region: 'west',
                    collapsible: true,
                    collapsed: true,
                    title: 'Navigation',
                    width: 150,
                    items: [{
                        xtype: 'menu',
                        floating: false,
                        items: [{
                            text: 'POS Order',
                            program: 'pos_order',
                            href: '../page/pos_order',
                        }, {
                            text: 'Food Menu',
                            program: 'food_menu',
                            href: '../page/food_menu',
                        }, {
                           text: 'Cook Ticket',
                            program: 'cook_ticket',
                            href: '../page/cook_ticket',
                        }],
                    }]
                }, {
                    region: 'south',
                    height: 20,
                    margin: '5 0 0 0',
                    items: [{
                        id: '_boxstatus',
                        xtype: 'label',
                    }]
                }, {
                    region: 'center',
                    layout: 'fit',
                    id: '_mainpanel',
                    items: [{
                        html: 'content here',
                    }],
                }],
            }],
        };
        programname = $(location).attr('href').split('/page/')[1].split('?')[0];
        var menus = newconfig.items[0].items[1].items[0].items;
        var currentindex = -1;
        Ext.each(menus, function(menu, index) {
            if (menu.program == programname) {
                currentindex = index;
            }
        });
        if (currentindex >= 0) {
            menus.splice(currentindex, 1);
        }
        Ext.applyIf(newconfig, config);
        this.callParent([newconfig]);
    },
    initComponent: function() {
        var me = this;
        if (PHONE) {
            $(window).resize(function (event) {
                me.refresh();
            });
        }
        else {
            var resizeTimerId;
            $(window).resize(function (event) {
                if (resizeTimerId) {
                    clearTimeout(resizeTimerId);
                    resizeTimerId = undefined;
                }
                resizeTimerId = setTimeout(function() {
                    me.refresh();
                }, 100);
            });
        }
        this.callParent(arguments);
        this.refresh();
    },
    refresh: function() {
        if (this.loadConfig) {
            var config = this.loadConfig();
            var viewportpanel = Ext.getCmp('_viewportpanel');
            if (config.width) {
                viewportpanel.setWidth(config.width);
            }
            if (config.height) {
                viewportpanel.setHeight(config.height);
            }
            var mainpanel = Ext.getCmp('_mainpanel');
            mainpanel.removeAll();
            if (config.items) {
                mainpanel.add(config.items);
            }
            var buttonpanel = Ext.getCmp('_buttonpanel');
            buttonpanel.removeAll();
            if (config.buttons) {
                buttonpanel.add(config.buttons);
            }
        }
        else {
            var mainpanel = Ext.getCmp('_mainpanel');
            mainpanel.removeAll();
        }
        if (this.afterRefresh) {
            this.afterRefresh();
        }
    },
});
Ext.onReady(function () {
    Util.initial(Global);
    Number.prototype.formatMoney = function(c, d, t){
        var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    // if (Global.iDevice) {
        // $(document).bind({
            // touchstart: function(e) {
                // message('touchstart ' + e.target.toString());
            // },
            // touchmove: function(e) {
                // message('touchmove ' + e.target.toString());
            // },
            // touchend: function(e) {
                // message('touchend ' + e.target.toString());
            // }
        // });
    // }
    // else {
        // $(document).bind({
            // mousedown: function(e) {
                // message(e.target);
            // },
            // mousemove: function(e) {
                // message(e.target);
            // },
            // mouseup: function(e) {
                // message(e.target);
            // }
        // });
    // }
});