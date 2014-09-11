//= require_tree .

Ext.onReady(function () {
    Util.initial(this);
    var screenSize;
    var ratio;
    var padyratio;
    var itemratio;
    var optionratio;
    var choiceratio;
    var viewport;
    var keypadtimer;
    var data;
    
    createStore();
    resize();
    if (PHONE) {
        $(window).resize(function (event) {
            resize();
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
                resize();
            }, 100);
        });
    }
   
    function setAllRatio() {
        if (PHONE) {
            if (screenSize.width > screenSize.height) {
                ratio = screenSize.width/2/240;
                padyratio = (screenSize.height-36)/280;
            }
            else {
                ratio = screenSize.width/240;
                if ((240*ratio) > (screenSize.height/3)) {
                    padyratio = screenSize.height/3/240;
                }
                else {
                    padyratio = ratio;
                }
            }
            itemratio = 0.7;
            optionratio = 0.7;
            choiceratio = 0.4;
        }
        else {
            var screenRatio = screenSize.width/screenSize.height;
            if (screenRatio > 2) {
                ratio = screenSize.width/5/240;
            }
            else if (screenRatio > 1) {
                ratio = screenSize.width/4/240;
            }
            else {
                ratio = screenSize.width/3/240;
            }
            if ((240*ratio) > (screenSize.height/3)) {
                padyratio = screenSize.height/3/240;
            }
            else {
                padyratio = ratio;
            }
            itemratio = 1.2;
            optionratio = 1.2;
            choiceratio = 1.2;
        }
    }
    function createStore() {
        Ext.create('Ext.data.Store', {
            storeId:'orderlistStore',
            fields:[{
                name: 'foodid', 
            }, {
                name: 'name', 
            }, {
                name: 'choice',
            }, {
                name: 'option',
            }, {
                name: 'quantity', 
            }, {
                name: 'price'
            }, {
                name: 'displaytag',
                convert: function(v, record) {
                    var tag = record.data.name;
                    tag = "<span style='font-size:" + 100*ratio + "%'>" + tag + "</span>";
                    var optiontag = "";
                    if (record.data.choice) {
                        optiontag += record.data.choice;
                    }
                    if (record.data.option) {
                        if (optiontag) {
                            optiontag += ' , ';
                        }
                        optiontag += record.data.option;
                    }
                    if (optiontag) {
                        tag += "<br><span style='font-size:" + 70*ratio + "%'>" + optiontag + "</span>";
                    }
                    return tag;
                },
            }, {
                name: 'displayqty',
                convert: function(v, record) {
                    var tag = "<span style='font-size:" + 100*ratio + "%'>" + record.data.quantity + "</span>";
                    return tag;
                },
            }],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });
    }
    function initialConfig() {
        var config = {
            layout: 'border',
            width: screenSize.width,
            height: screenSize.height,
            items: [{
                region: 'north',
                border: false,
                margins: '0 0 5 0'
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
                        text: 'Food Menu',
                        href: '../page/food_menu',
                    }],
                }]
            }, {
                region: 'south',
                height: 20,
                margins: '5 0 0 0',
                items: [{
                    id: 'boxstatus',
                    xtype: 'label',
                }]
            }, {
                region: 'east',
                width: 240*ratio,
                layout: 'border',
                items: [{
                    region: 'center',
                    layout: 'border',
                    items: [{
                        id: 'orderGrid',
                        xtype: 'gridpanel',
                        region: 'center',
                        store: 'orderlistStore',
                        columns: [{
                            text: 'Item',
                            style: 'text-align: center',
                            dataIndex: 'displaytag',
                            flex: 1,
                            style: 'font-size:' + 100*ratio + '%',
                        }, {
                            text: 'Qty.',
                            style: 'text-align: center',
                            dataIndex: 'displayqty',
                            align: 'right',
                            width: 40*ratio,
                            style: 'font-size:' + 100*ratio + '%',
                        }],
                    }, {
                        region: 'south',
                        layout: 'border',
                        height: 51*ratio,
                        layout: 'absolute',
                        bodyStyle: 'font-size:' + 100*ratio + '%',
                        items: [{
                            xtype: 'label',
                            x: 10*ratio,
                            y: 0*ratio,
                            style: 'color: gray;',
                            text: 'Total',
                        }, {
                            xtype: 'label',
                            id: 'totalLabel',
                            x: 85*ratio,
                            y: 0*ratio,
                            width: 140*ratio,
                            style: 'text-align: right; color: gray',
                            text: '$0.00',
                        }, {
                            xtype: 'label',
                            x: 10*ratio,
                            y: 15*ratio,
                            style: 'color: gray;',
                            text: 'Tax',
                        }, {
                            xtype: 'label',
                            id: 'taxLabel',
                            x: 85*ratio,
                            y: 15*ratio,
                            width: 140*ratio,
                            style: 'text-align: right; color: gray;',
                            text: '$0.00',
                        }, {
                            xtype: 'label',
                            x: 10*ratio,
                            y: 30*ratio,
                            text: 'Net',
                        }, {
                            xtype: 'label',
                            id: 'netLabel',
                            x: 85*ratio,
                            y: 30*ratio,
                            width: 140*ratio,
                            style: 'text-align: right;',
                            text: '$0.00',
                        }]
                    }]
                }, {
                    region: 'south',
                    layout: {
                        type: 'table',
                        columns: 4,
                    },
                    id: 'keypad',
                    defaults: {
                        width: 60*ratio,
                        height: 60*padyratio,
                        xtype: 'panel',
                        bodyCls: 'touchbutton',
                        bodyStyle: 'font-size:' + 200*padyratio + '%',
                    },
                    items: [{
                        data: { command: 'delete_item' },
                        colspan: 2,
                        width: 120*ratio,
                        height: 40*padyratio,
                        bodyCls: 'touchcommand',
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center;font-size:60%;" width=100% height=100%><tr><td><span>delete item</span></td></tr></table>',
                    }, {
                        data: { command: 'close_order' },
                        colspan: 2,
                        width: 120*ratio,
                        height: 40*padyratio,
                        bodyCls: 'touchcommand',
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center;font-size:60%" width=100% height=100%><tr><td><span>close order</span></td></tr></table>',
                    }, {
                        data: { value: 7 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>7</span></td></tr></table>',
                    }, {
                        data: { text: '8', value: 8 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>8</span></td></tr></table>',
                    }, {
                        data: { text: '9', value: 9 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>9</span></td></tr></table>',
                    }, {
                        data: { text: '<-' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { text: '4', value: 4 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>4</span></td></tr></table>',
                    }, {
                        data: { text: '5', value: 5 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>5</span></td></tr></table>',
                    }, {
                        data: { text: '6', value: 6 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>6</span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { text: '1', value: 1 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>1</span></td></tr></table>',
                    }, {
                        data: { text: '2', value: 2 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>2</span></td></tr></table>',
                    }, {
                        data: { text: '3', value: 3 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>3</span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { text: '0', value: 0 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>0</span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }],
                }]
            }, {
                region: 'center',
                layout: 'border',
                items: [{
                    id: 'pnlMenu',
                    region: 'center',
                    autoScroll: true,
                    bodyCls: 'menupanel',
                }, {
                    region: 'south',
                    height: 68+20,
                    bodyCls: 'optionmainpane',
                    items: [{
                        id: 'pnlOption',
                        bodyCls: 'optionpane',
                        height: 68,
                    }]
                }]
            }]
        };
        return config;
    }
    function resizeConfig(config) {
        if (PHONE) {
            config.width = screenSize.width*2;
            config.items[3].width = screenSize.width;
            if (screenSize.width > screenSize.height) {
                config.items[3].items[1].region = screenSize.width/2;
                config.items[3].items[1].region = 'east';
            }
            config.items[4].items[1].height = 60*optionratio+8;
            config.items[4].items[1].items[0].height = 60*optionratio+8;
        }
        else {
            config.items[4].items[1].height = 60*optionratio+28;
            config.items[4].items[1].items[0].height = 60*optionratio+8;
        }
    }
    function resize() {
        screenSize = Util.getScreenSize();
        setAllRatio();
        var config = initialConfig();
        resizeConfig(config);
        if (viewport) {
            viewport.removeAll();
        }
        viewport = Ext.create('Ext.container.Viewport', {
            layout: 'absolute',
            items: [config]
        });
        loadData(function() {
            renderMenu();
            bindEvent();
            var store = Ext.getStore('orderlistStore');
            Ext.each(store.getRange(), function(record) {
                record.set('displaytag', null);
                record.set('displayqty', null);
            });
            store.commitChanges();
            updatetotal();
        });
    }
    function setkeypadtimeout() {
        clearkeypadtimeout();
        keypadtimer = setTimeout(function() {
            keypadtimer = undefined;
        }, 1000);
    }
    function clearkeypadtimeout() {
        if (keypadtimer) {
            clearTimeout(keypadtimer);
            keypadtimer = undefined;
        }
    }
    function keypadclick(control) {
        var target = $(control);
        while (target && !target.hasClass('x-panel')) {
            target = target.parent();
        }
        var comp = Ext.getCmp(target.attr('id'));
        var sm = Ext.getCmp('orderGrid').getSelectionModel();
        if (sm.hasSelection())
        {
            var record = sm.getLastSelected();
            if (comp.data.value >= 0) {
                var quantity = 0;
                if (keypadtimer) {
                    quantity = record.get('quantity');
                }
                record.set('quantity', quantity*10+comp.data.value);
                record.set('displayqty', null);
                Ext.getStore('orderlistStore').commitChanges();
            }
            else if (comp.data.command) {
                switch (comp.data.command) {
                    case 'delete_item':
                        var store = Ext.getStore('orderlistStore');
                        var index = store.indexOf(record);
                        store.remove(record);
                        var count = store.getCount();
                        if (count > index) {
                            Ext.getCmp('orderGrid').getView().select(index);
                        }
                        else if (count > 0) {
                             Ext.getCmp('orderGrid').getView().select(store.getAt(count-1));
                        }
                        break;
                    case 'close_order':
                        var store = Ext.getStore('orderlistStore');
                        store.removeAll();
                        var optionpanel = Ext.getCmp('pnlOption');
                        optionpanel.removeAll();
                        break;
                }
            }
            updatetotal();
        }
        setkeypadtimeout();
    }
    function bindEvent() {
        Ext.each(Ext.getCmp('keypad').query('panel'), function(panel) {
            var element = $(panel.el.dom);
            bindClick(element, keypadclick);
        });
        Ext.getCmp('orderGrid').on('selectionchange', function(comp, selected) {
            clearkeypadtimeout();
            if (selected && selected.length > 0) {
                showoption(selected[0].data.foodid, selected[0].data.choice, selected[0].data.option);
            }
        });
    }
    function message(text, addflag) {
        var s = '';
        if (addflag == true) {
            s = Ext.getCmp('boxstatus').text || '';
        }
        if (s) {
            s += ', ';
        }
        Ext.getCmp('boxstatus').setText(s + text);
    }
    function decimalround(value) {
        return Math.round(value*100)/100;
    }
    function updatetotal() {
        var store = Ext.getStore('orderlistStore');
        var list = store.getRange();
        var total = 0;
        Ext.each(list, function(record) {
            total = decimalround(total + (record.get('quantity')||0) * (record.get('price')||0));
        });
        var tax = Math.round(total * 10) / 100;
        var net = total + tax;
        Ext.getCmp('totalLabel').setText('$'+total.formatMoney(2));
        Ext.getCmp('taxLabel').setText('$'+tax.formatMoney(2));
        Ext.getCmp('netLabel').setText('$'+net.formatMoney(2));
    }
    function optionclick(control) {
        clearkeypadtimeout();
        var comp = Util.componentFromDom('x-panel', control);
        var parent = comp.findParentByType('panel');
        Ext.each(parent.query('panel'), function(item) {
            item.removeBodyCls('selected');
        });
        comp.addBodyCls('selected');
        var sm = Ext.getCmp('orderGrid').getSelectionModel();
        if (sm.hasSelection())
        {
            var record = sm.getLastSelected();
            var foodid = record.get('foodid');
            var fooditem;
            Ext.each(data.Items, function(item) {
                if (item.id == foodid) {
                    fooditem = item;
                    return false;
                }
            });
            var defaultoption = fooditem.defaultoption;
            if (comp.data.choice) {
                record.set('choice', comp.data.choice);
            }
            if (comp.data.option) {
                if (comp.data.option == defaultoption) {
                    record.set('option', null);
                }
                else {
                    record.set('option', comp.data.option);
                }
            }
            if (comp.data.price >= 0) {
                record.set('price', comp.data.price);
            }
            record.set('displaytag', null);
            record.set('displayqty', null);
            Ext.getStore('orderlistStore').commitChanges();
            updatetotal();
        }
    }
    function showoption(foodid, currentchoice, currentoption) {
        var optionpanel = Ext.getCmp('pnlOption');
        optionpanel.removeAll();
        var fooditem = data.Items[foodid];
        // Ext.each(data.Items, function(item) {
            // if (item.id == foodid) {
                // fooditem = item;
                // return false;
            // }
        // });
        var choicecount = 0;
        var optioncount = 0;
        if (Util.isString(fooditem.price)) {
            var priceset = data.pricesets[fooditem.price];
            var panel = Ext.create('Ext.panel.Panel', {
                height: 60*optionratio+2,
                width: priceset.length*60*optionratio+3,
                margin: '2 10 2 10',
                bodyCls: 'optionpanel',
                style: 'float: left;',
            });
            optionpanel.add(panel);
            Ext.each(priceset, function(item) {
                var choice = Ext.create('Ext.panel.Panel', {
                    width: 50*optionratio,
                    height: 50*optionratio,
                    bodyCls: 'optionlabel',
                    margin: 5*optionratio,
                    bodyStyle: 'font-size: ' + 80*optionratio + '%',
                    style: 'float: left;',
                    data: { 
                        choice: item.choice,
                        price: item.price,
                    },
                    html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>' + item.choice + '</span></td></tr></table>',
                });
                if (currentchoice == item.choice) {
                    choice.addBodyCls('selected');
                }
                panel.add(choice);
                choicecount++;
                var element = $(choice.el.dom);
                bindClick(element, optionclick);
            });
            optioncount++;
        }
        if (fooditem.option) {
            var optionlist = data.options[fooditem.option];
            var panel = Ext.create('Ext.panel.Panel', {
                height: 60*optionratio+2,
                width: optionlist.length*60*optionratio+3,
                margin: '2 10 2 10',
                bodyCls: 'optionpanel',
                style: 'float: left',
            });
            optionpanel.add(panel);
            Ext.each(optionlist, function(item) {
                var choice = Ext.create('Ext.panel.Panel', {
                    width: 50*optionratio,
                    height: 50*optionratio,
                    bodyCls: 'optionlabel',
                    margin: 5*optionratio,
                    bodyStyle: 'font-size: ' + 80*optionratio + '%',
                    style: 'float: left',
                    data: { 
                        option: item.option,
                    },
                    html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>' + item.option + '</span></td></tr></table>',
                });
                if ((currentoption == item.option)||(!currentoption && (item.option == fooditem.defaultoption))) {
                    choice.addBodyCls('selected');
                }
                panel.add(choice);
                choicecount++;
                var element = $(choice.el.dom);
                bindClick(element, optionclick);
            });
            optioncount++;
        }
        optionpanel.setSize({ width: 61*choicecount*optionratio+21*optioncount });
    }
    function menuclick(control) {
        clearkeypadtimeout();
        var target = $(control);
        while (target && !target.hasClass('foodlabel')) {
            target = target.parent();
        }
        
        var itemcode = target.attr('itemcode');
        var itemdata = data.Items[itemcode];
        var store = Ext.getStore('orderlistStore');
        if (itemdata.PriceType == 'CHOICE') {
            var priceset = data.ChoiceGroups[itemdata.ChoiceGroupCode].ChoiceList;
            var form = Ext.create('Ext.window.Window', {
                title: 'select a choice',
                height: 120*choiceratio + 80,
                width: priceset.length * 120 * choiceratio + 15,
                layout: 'fit',
                closable: false,
                modal: true,
                items: {
                    id: 'choicepanel',
                },
                buttons: [{
                    text: 'Cancel',
                    handler: function() {
                        form.close();
                    }
                }]
            });
            var panel = form.query('#choicepanel')[0];
            Ext.each(priceset, function(item) {
                var choice = Ext.create('Ext.panel.Panel', {
                    width: 100*choiceratio,
                    height: 100*choiceratio,
                    bodyCls: 'choicelabel',
                    bodyStyle: 'font-size: ' + 140*choiceratio + '%',
                    margin: 10*choiceratio,
                    style: 'float: left',
                    data: { 
                        choice: item.Name,
                        price: item.Price,
                    },
                    html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>' + item.Name + '</span></td></tr></table>',
                });
                panel.add(choice);
            });
            function choiceclick(control) {
                var target = $(control);
                while (target && !target.hasClass('x-panel')) {
                    target = target.parent();
                }
                var compx = Ext.getCmp(target.attr('id'));
                var store = Ext.getStore('orderlistStore');
                store.add({ foodid: itemdata.ItemCode, name: itemdata.Name, choice: compx.data.choice, quantity: 1, price: compx.data.price});
                var count = store.getCount();
                Ext.getCmp('orderGrid').getView().select(store.getAt(count-1));
                updatetotal();
                //showoption(itemdata.id, compx.data.choice, null);
                form.close();
            }
            form.show(null, function() {
                Ext.each(panel.query('panel'), function(choice) {
                    var element = $(choice.el.dom);
                    bindClick(element, choiceclick);
                });
            });
        }
        else {
            store.add({ foodid: itemdata.id, name: itemdata.name, quantity: 1, price: itemdata.price });
            var count = store.getCount();
            Ext.getCmp('orderGrid').getView().select(store.getAt(count-1));
            updatetotal();
            showoption(itemdata.id, null, null);
        }
    }
    function renderMenu() {
        var oldgroup;
        var tag = "";
        var firsttime = true;
        for (var itemcode in data.Items) {
            var item = data.Items[itemcode];
            if (oldgroup != item.CategoryCode) {
                if (!firsttime) {
                    tag += "</td></tr></table></td></tr></table>";
                }
                tag += "<table style='width:100%;padding:10px;'><tr><td><table style='font-size:" + 100*itemratio + "%' class=foodpanel><tr><td>" + data.ItemCategories[item.CategoryCode].Name + "</td></tr><tr><td>";
                oldgroup = item.CategoryCode;
                firsttime = false;
            }
            var style = "width:" + 60*itemratio + "px;height:" + 60*itemratio + "px;margin:" + 10*itemratio + "px;font-size:80%";
            tag += "<div class=foodlabel style='" + style + "' id=" + item.ItemCode + " itemcode=" + item.ItemCode + "><table cellpadding=0 cellspacint=0 style='text-align:center' width=100% height=100%><tr><td><span>" + item.Name.replace(/\n/g, "<br>") + "</span></td></tr></table></div>";
        }
        if (!firsttime) {
            tag += "</td></tr></table></td></tr></table>";
        }
        var pnlmenu = Ext.getCmp('pnlMenu');
        pnlmenu.update(tag);
        var elements = $(pnlmenu.el.dom).find("div[itemcode]");
        bindClick(elements, menuclick);
    }
    function bindClick(elements, callback) {
        var touchflag = false;
        var startX;
        var startY;
        if (WINDOWSPHONE) {
            elements.bind('MSPointerDown', function(event) {
                var touch = event.originalEvent;
                startX = touch.pageX;
                startY = touch.pageY;
                touchflag = true;
            });
            elements.bind('MSPointerMove', function(event) {
                var touch = event.originalEvent;
                if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                    touchflag = false;
                }
            });
            elements.bind('MSPointerUp', function(event) {
                if (touchflag) {
                    callback(this);
                }
                touchflag = false;
            });
        }
        else if (iDevice) {
            elements.bind('touchstart', function(event) {
                var touch = event.originalEvent.touches[0];
                startX = touch.pageX;
                startY = touch.pageY;
                touchflag = true;
            });
            elements.bind('touchmove', function(event) {
                var touch = event.originalEvent.touches[0];
                if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                    touchflag = false;
                }
            });
            elements.bind('touchend', function(event) {
                if (touchflag) {
                    callback(this);
                }
                touchflag = false;
            });
        }
        else {
            elements.bind('mousedown', function(event) {
                var touch = event;
                startX = touch.pageX;
                startY = touch.pageY;
                touchflag = true;
            });
            elements.bind('mousemove', function(event) {
                var touch = event;
                if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                    touchflag = false;
                }
            });
            elements.bind('mouseup', function(event) {
                if (touchflag) {
                    callback(this);
                }
                touchflag = false;
            });
        }
    }
    function loadData(callback) {
        if (data) {
            callback();
        }
        else {
            Util.requestCallback('GET', null, null, null, null, function(returnData) {
                data = returnData;
                console.log(data);
                callback();
            });
            // Util.call('load_data', function(returndata) {
                // console.log($.parseJSON(returndata));
                // data = {
                    // groups: {
                        // APPETIZER: { name: 'Appetizers' },
                        // THAISALAD: { name: 'Thai Salads' },
                        // SOUP: { name: 'Soups' },
                        // NOODLESOUP: { name: 'Noodle Soups' },
                        // FRIEDNOODLE: { name: 'Stir-fried Noodles' },
                        // ENTREE: { name: 'Entrees' },
                        // CURRY: { name: 'Curry' },
                        // RICEDISH: { name: 'Thai Style Rice Dishes' },
                        // FRIEDRICE: { name: 'Thai Style Fried Rice' },
                        // SIDEORDER: { name: 'Side Orders' },
                        // DESSERT: { name: 'Desserts' },
                        // COLDBEVERAGE: { name: 'Cold Beverages' },
                        // HOTBEVERAGE: { name: 'Hot Beverages' },
                    // },
                    // pricesets: {
                        // CURRY: [
                            // { choice: 'Chicken', price: 8.45 },
                            // { choice: 'Beef', price: 8.45 },
                            // { choice: 'Pork', price: 8.45 },
                            // { choice: 'Tofu', price: 8.45 },
                            // { choice: 'Shrimp', price: 10.95 }],
                        // RICEDISH: [
                            // { choice: 'Chicken', price: 8.95 },
                            // { choice: 'Beef', price: 8.95 },
                            // { choice: 'Pork', price: 8.95 },
                            // { choice: 'Tofu', price: 8.95 },
                            // { choice: 'Shrimp', price: 11.45 }],
                        // KRATIAM: [
                            // { choice: 'Chicken', price: 8.95 },
                            // { choice: 'Beef', price: 8.95 },
                            // { choice: 'Pork', price: 8.95 }],
                        // FRIEDRICE: [
                            // { choice: 'Chicken', price: 8.45 },
                            // { choice: 'Beef', price: 8.45 },
                            // { choice: 'Pork', price: 8.45 },
                            // { choice: 'Tofu', price: 8.45 },
                            // { choice: 'Shrimp', price: 10.95 }],
                        // TROPICAL: [
                            // { choice: 'Chicken', price: 8.95 },
                            // { choice: 'Beef', price: 8.95 },
                            // { choice: 'Pork', price: 8.95 },
                            // { choice: 'Tofu', price: 8.95 },
                            // { choice: 'Shrimp', price: 11.45 }],
                        // SAUCE: [
                            // { choice: 'Small', price: 1.50 },
                            // { choice: 'Large', price: 2.50 }],
                        // SPRINGROLL: [
                            // { choice: 'Pork', price: 2.95 },
                            // { choice: 'Veg', price: 2.95 }],
                        // SOUP: [
                            // { choice: 'Chicken', price: 4.25 },
                            // { choice: 'Tofu', price: 4.25 },
                            // { choice: 'Shrimp', price: 5.45 }],
                        // BEEFSOUP: [
                            // { choice: 'Stewed', price: 7.95 },
                            // { choice: 'Sliced', price: 7.95 }],
                        // NOODLESOUP: [
                            // { choice: 'Chicken', price: 7.95 },
                            // { choice: 'Beef', price: 7.95 },
                            // { choice: 'Pork', price: 7.95 },
                            // { choice: 'Tofu', price: 7.95 },
                            // { choice: 'Shrimp', price: 10.45 }],
                        // FRIEDNOODLE: [
                            // { choice: 'Chicken', price: 7.95 },
                            // { choice: 'Beef', price: 7.95 },
                            // { choice: 'Pork', price: 7.95 },
                            // { choice: 'Tofu', price: 7.95 },
                            // { choice: 'Shrimp', price: 10.45 }],
                        // LADNAR: [
                            // { choice: 'Chicken', price: 8.95 },
                            // { choice: 'Beef', price: 8.95 },
                            // { choice: 'Pork', price: 8.95 },
                            // { choice: 'Tofu', price: 8.95 },
                            // { choice: 'Shrimp', price: 11.45 }],
                        // BASIL: [
                            // { choice: 'Chicken', price: 7.95 },
                            // { choice: 'Tofu', price: 7.95 },
                            // { choice: 'Shrimp', price: 10.45 }],
                        // NOBEEF: [
                            // { choice: 'Chicken', price: 7.95 },
                            // { choice: 'Pork', price: 7.95 },
                            // { choice: 'Tofu', price: 7.95 },
                            // { choice: 'Shrimp', price: 10.45 }],
                        // THAIBBQ: [
                            // { choice: 'Rice', price: 7.95 },
                            // { choice: 'Noodle', price: 7.95 }],
                        // NOPORK: [
                            // { choice: 'Chicken', price: 7.95 },
                            // { choice: 'Beef', price: 7.95 },
                            // { choice: 'Tofu', price: 7.95 },
                            // { choice: 'Shrimp', price: 10.45 }],
                        // PRARAM: [
                            // { choice: 'Chicken', price: 8.45 },
                            // { choice: 'Tofu', price: 8.45 },
                            // { choice: 'Shrimp', price: 10.45 }],
                        // PADTHAI: [
                            // { choice: 'Chicken', price: 8.45 },
                            // { choice: 'Beef', price: 8.45 },
                            // { choice: 'Pork', price: 8.45 },
                            // { choice: 'Tofu', price: 8.45 },
                            // { choice: 'Shrimp', price: 10.95 }],
                        // PEANUT: [
                            // { choice: 'Chicken', price: 8.95 },
                            // { choice: 'Beef', price: 8.95 },
                            // { choice: 'Pork', price: 8.95 },
                            // { choice: 'Tofu', price: 8.95 },
                            // { choice: 'Shrimp', price: 11.45 }],
                        // CASHEW: [
                            // { choice: 'Chicken', price: 8.95 },
                            // { choice: 'Tofu', price: 8.95 },
                            // { choice: 'Shrimp', price: 11.45 }],
                    // },
                    // options: {
                        // SPICY: [
                            // { option: 'Slightly Spicy' },
                            // { option: 'Medium Spicy' },
                            // { option: 'Spicy' }],
                        // SPICY2: [
                            // { option: 'Medium Spicy' },
                            // { option: 'Spicy' }],
                    // },
                    // fooditems: [
                        // { id: 'CHICKENSATAY', name: 'Chicken Satay', group: 'APPETIZER', price: 6.25 },
                        // { id: 'TOFUSATAY', name: 'Tofu Satay', group: 'APPETIZER', price: 5.45 },
                        // { id: 'THAISROLL', name: 'Thai Spring Roll', group: 'APPETIZER', price: 'SPRINGROLL' },
                        // { id: 'FRIEDTOFU', name: 'Fried Tofu', group: 'APPETIZER', price: 2.95 },
                        // { id: 'FRESHROLL', name: 'Fresh Spring Roll', group: 'APPETIZER', price: 4.25 },
                        // { id: 'PEANUTROLL', name: 'Peanut Sauce Spring Roll', group: 'APPETIZER', price: 4.95 },
                        // { id: 'CRABRANGOON', name: 'Crab Rangoon', group: 'APPETIZER', price: 3.95 },
                        // { id: 'CHICKSTICK', name: 'Chicken Pot Stickers', group: 'APPETIZER', price: 4.25 },
                        // { id: 'DIMSUM', name: 'Mixed Dimsum', group: 'APPETIZER', price: 4.25 },
                        // { id: 'FISHCAKE', name: 'Fish Cake', group: 'APPETIZER', price: 4.25 },
                        // { id: 'BEEFNUMTOK', name: 'Beef Num Tok Salad', group: 'THAISALAD', price: 6.95, option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'PORKNUMTOK', name: 'Pork Num Tok Salad', group: 'THAISALAD', price: 6.95, option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'NOODLESALAD', name: 'Bean Threads Noodle Salad', group: 'THAISALAD', price: 6.95, option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'LARBKAI', name: 'Larb Gai Salad', group: 'THAISALAD', price: 6.95, option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'YUMNEUA', name: 'Yum Neua', group: 'THAISALAD', price: 6.95, option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'YUMMOO', name: 'Yum Moo', group: 'THAISALAD', price: 6.95, option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'TUMTANG', name: 'Cucumber Salad', group: 'THAISALAD', price: 3.50 },
                        // { id: 'GREENSALAD', name: 'Green Salad', group: 'THAISALAD', price: 4.25 },
                        // { id: 'TOMYUM', name: 'Tom Yum', group: 'SOUP', price: 'SOUP', option: 'SPICY', defaultoption: 'Slightly Spicy' },
                        // { id: 'TOMKHA', name: 'Tom Kha', group: 'SOUP', price: 'SOUP', option: 'SPICY', defaultoption: 'Slightly Spicy' },
                        // { id: 'BEEFNOODLE', name: 'Beef Noodle Soup', group: 'NOODLESOUP', price: 'BEEFSOUP' },
                        // { id: 'CHICKNOODLE', name: 'Chicken Noodle Soup', group: 'NOODLESOUP', price: 7.95 },
                        // { id: 'SHRIMPNOODLE', name: 'Shrimp Noodle Soup', group: 'NOODLESOUP', price: 10.45 },
                        // { id: 'VEGNOODLE', name: 'Vegetable Noodle Soup', group: 'NOODLESOUP', price: 7.95 },
                        // { id: 'TOMYUMNOODLE', name: 'Tom Yum Noodle Soup', group: 'NOODLESOUP', price: 'NOODLESOUP', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'EGGNOODLE', name: 'Egg Noodle with BBQ Pork', group: 'NOODLESOUP', price: 8.45 },
                        // { id: 'PADTHAI', name: 'Pad Thai', group: 'FRIEDNOODLE', price: 'FRIEDNOODLE' },
                        // { id: 'PADSEEEWE', name: 'Pad See Ewe', group: 'FRIEDNOODLE', price: 'FRIEDNOODLE' },
                        // { id: 'PADKEEMAO', name: 'Pad Kee Mao', group: 'FRIEDNOODLE', price: 'FRIEDNOODLE', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'LADNAR', name: 'Lad Nar', group: 'FRIEDNOODLE', price: 'LADNAR' },
                        // { id: 'BASIL', name: 'Basil', group: 'ENTREE', price: 'BASIL', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'GARLIC', name: 'Garlic', group: 'ENTREE', price: 'NOBEEF' },
                        // { id: 'GINGER', name: 'Ginger', group: 'ENTREE', price: 'NOBEEF' },
                        // { id: 'BBQCHICKEN', name: 'Thai BBQ Chicken', group: 'ENTREE', price: 'THAIBBQ' },
                        // { id: 'MIXEDVEG', name: 'Mixed Vegetable', group: 'ENTREE', price: 'BASIL' },
                        // { id: 'BROCCOLI', name: 'Broccoli', group: 'ENTREE', price: 'NOPORK' },
                        // { id: 'PRARAM', name: 'Praram', group: 'ENTREE', price: 'PRARAM' },
                        // { id: 'PADTHAISWEET', name: 'Pad Thai Sweet & Sour Sauce', group: 'ENTREE', price: 'PADTHAI' },
                        // { id: 'PADPREOWWAN', name: 'Pad Preow Wan', group: 'ENTREE', price: 'PADTHAI' },
                        // { id: 'PEANUTLOVER', name: 'Peanut Sauce Lover', group: 'ENTREE', price: 'PEANUT', option: 'SPICY', defaultoption: 'Slightly Spicy' },
                        // { id: 'CASHEW', name: 'Cashew', group: 'ENTREE', price: 'CASHEW', option: 'SPICY', defaultoption: 'Slightly Spicy' },
                        // { id: 'PADWOONSEN', name: 'Pad Woon Sen', group: 'ENTREE', price: 'PEANUT' },
                        // { id: 'REDCURRY', name: 'Red\nCurry', group: 'CURRY', price: 'CURRY', option: 'SPICY2', defaultoption: 'Medium Spicy' },
                        // { id: 'GREENCURRY', name: 'Green\nCurry', group: 'CURRY', price: 'CURRY', option: 'SPICY2', defaultoption: 'Medium Spicy' },
                        // { id: 'MUSSAMUN', name: 'Mussamun\nCurry', group: 'CURRY', price: 'CURRY', option: 'SPICY2', defaultoption: 'Medium Spicy' },
                        // { id: 'YELLOWCURRY', name: 'Yellow\nCurry', group: 'CURRY', price: 'CURRY', option: 'SPICY2', defaultoption: 'Medium Spicy' },
                        // { id: 'GANGPA', name: 'Gang Pa', group: 'CURRY', price: 'CURRY', option: 'SPICY2', defaultoption: 'Medium Spicy' },
                        // { id: 'PANANGCURRY', name: 'Panang\nCurry', group: 'CURRY', price: 'CURRY', option: 'SPICY2', defaultoption: 'Medium Spicy' },
                        // { id: 'PADKRAPRAOW', name: 'Pad\nKra Praow', group: 'RICEDISH', price: 'RICEDISH', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'PADPRIK', name: 'Pad\nPrik', group: 'RICEDISH', price: 'RICEDISH', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'PADPED', name: 'Pad Ped\nNoh Mai', group: 'RICEDISH', price: 'RICEDISH', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'KRATIAM', name: 'Kratiam\nPrik Thai', group: 'RICEDISH', price: 'KRATIAM' },
                        // { id: 'THAIOMELET', name: 'Thai\nOmelet', group: 'RICEDISH', price: 7.95 },
                        // { id: 'VEGOMLET', name: 'Thai\nVeggie\nOmelet', group: 'RICEDISH', price: 7.95 },
                        // { id: 'BBQPORK', name: 'BBQ Pork\nwith\nRice', group: 'RICEDISH', price: 8.45 },
                        // { id: 'BASILRICE', name: 'Basil\nFried Rice', group: 'FRIEDRICE', price: 'FRIEDRICE', option: 'SPICY', defaultoption: 'Medium Spicy' },
                        // { id: 'SUNRISERICE', name: 'Sunrise\nFried Rice', group: 'FRIEDRICE', price: 'FRIEDRICE' },
                        // { id: 'TROPICALRICE', name: 'Tropical\nFried Rice', group: 'FRIEDRICE', price: 'TROPICAL' },
                        // { id: 'COMBORICE', name: 'Special Combo\nFried Rice', group: 'FRIEDRICE', price: 9.95 },
                        // { id: 'SEAFOODRICE', name: 'Sea Food\nFried Rice', group: 'FRIEDRICE', price: 11.45 },
                        // { id: 'CRAZYRICE', name: 'Crazy\nFried Rice', group: 'FRIEDRICE', price: 11.45, option: 'SPICY', defaultoption: 'Slightly Spicy' },
                        // { id: 'JUSMINERICE', name: 'Steamed\nJusmine\nRice', group: 'SIDEORDER', price: 2.00 },
                        // { id: 'STEAMNOODLE', name: 'Steamed\nNoodle', group: 'SIDEORDER', price: 2.25 },
                        // { id: 'PEANUTSAUCE', name: 'Peanut\nSauce', group: 'SIDEORDER', price: 'SAUCE' },
                        // { id: 'SOURSAUCE', name: 'Sweet &\nSour\nSauce', group: 'SIDEORDER', price: 'SAUCE' },
                        // { id: 'CUSTART', name: 'Thai Custard', group: 'DESSERT', price: 2.50 },
                        // { id: 'BANANACAKE', name: 'Thai Banana Cake', group: 'DESSERT', price: 3.50 },
                        // { id: 'STICKYRICE', name: 'Thai Custard with Sticky Rice', group: 'DESSERT', price: 3.95 },
                        // { id: 'STICKYMANGO', name: 'Sweet Sticky Rice with Mango', group: 'DESSERT', price: 4.95 },
                        // { id: 'SODA', name: 'Soda', group: 'COLDBEVERAGE', price: 1.50 },
                        // { id: 'FUZE', name: 'Fuze', group: 'COLDBEVERAGE', price: 2.50 },
                        // { id: 'ICEDTEA', name: 'Thai Iced Tea with Milk', group: 'COLDBEVERAGE', price: 2.50 },
                        // { id: 'ICEDCOFFEE', name: 'Thai Iced Coffee with Milk', group: 'COLDBEVERAGE', price: 2.50 },
                        // { id: 'GREENTEA', name: 'Milk Green Tea', group: 'COLDBEVERAGE', price: 2.50 },
                        // { id: 'MILKTEA', name: 'Bangkok Milk Tea', group: 'COLDBEVERAGE', price: 2.50 },
                        // { id: 'HOTTEA', name: 'Hot Jasmine Tea', group: 'HOTBEVERAGE', price: 1.50 },
                        // { id: 'HOTGREENTEA', name: 'Hot Green Tea', group: 'HOTBEVERAGE', price: 1.50 },
                    // ],
                // }
                // callback();
            // });
        }
    }
});

