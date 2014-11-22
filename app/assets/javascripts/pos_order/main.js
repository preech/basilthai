//= require_tree .

Ext.onReady(function () {
    var MAXQUEUENO = 50;
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
    var order = {};
    
    createStore();
    clearOrder();
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
                name: 'choicename',
            }, {
                name: 'option',
            }, {
                name: 'optionname',
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
                        optiontag += record.data.choicename;
                    }
                    var fooditem = data.Items[record.data.foodid];
                    if (record.data.option) {
                        for (var i=0; i<fooditem.OptionList.length; i++) {
                            var option = fooditem.OptionList[i];
                            var currentoption = record.data.option[i];
                            if (currentoption && currentoption != option.DefaultOptionCode) {
                                if (optiontag) {
                                    optiontag += ' , ';
                                }
                                var optiongroup = data.OptionGroups[option.OptionGroupCode];
                                for (j=0; j<optiongroup.OptionList.length; j++) {
                                    if (currentoption == optiongroup.OptionList[j].OptionCode) {
                                        optiontag += optiongroup.OptionList[j].Name;
                                        break;
                                    }
                                }
                            }
                        }
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
    function clearOrder() {
        order = {
            OrderType: 'FORHERE',
            Status: 'INITIAL',
            PaymentType: 'CASH',
            TaxExemptFlag: 'F',
        }
        var params = {
            OrderDate: Util.dateToStr(new Date()),
        }
        Util.requestCallback('GET', 'get_last_queue_no', null, params, null, function(returnData) {
            var lastqueueno = returnData.LastQueueNo;
            order.QueueNo = Util.toFloat(lastqueueno) + 1;
            if (order.QueueNo > MAXQUEUENO) {
                order.QueueNo = 1;
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
                            text: 'Net Total',
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
                            text: 'Total',
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
                        data: { value: 8 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>8</span></td></tr></table>',
                    }, {
                        data: { value: 9 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>9</span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { value: 4 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>4</span></td></tr></table>',
                    }, {
                        data: { value: 5 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>5</span></td></tr></table>',
                    }, {
                        data: { value: 6 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>6</span></td></tr></table>',
                    }, {
                        data: { text: '' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
                    }, {
                        data: { value: 1 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>1</span></td></tr></table>',
                    }, {
                        data: { value: 2 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>2</span></td></tr></table>',
                    }, {
                        data: { value: 3 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>3</span></td></tr></table>',
                    }, {
                        bodyStyle: 'font-size:' + 100*padyratio + '%',
                        data: { command: 'remark' },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>Remark</span></td></tr></table>',
                    }, {
                        colspan: 2,
                        width: 120*ratio,
                        data: { value: 0 },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>0</span></td></tr></table>',
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
        if (comp.data.command == 'remark') {
            Remark.show(data, order, function() {
            });
        }
        else {
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
                            var list = store.getRange();
                            var net = 0;
                            Ext.each(list, function(record) {
                                net = decimalround(net + (record.get('quantity')||0) * (record.get('price')||0));
                            });
                            var tax = Math.round(net * 10) / 100;
                            var total = net + tax;
                            order.Amount = net;
                            ConfirmOrder.show(data, order, function(closeflag) {
                                if (closeflag) {
                                    saveOrder();
                                    order.Status = 'START';
                                    var now = new Date();
                                    order.OrderDate = Util.dateToStr(now);
                                    order.OrderTime = Ext.util.Format.date(now, 'H:i');
                                    Util.requestCallback('PUT', null, null, null, order, function(returnData) {
                                        var store = Ext.getStore('orderlistStore');
                                        store.removeAll();
                                        var optionpanel = Ext.getCmp('pnlOption');
                                        optionpanel.removeAll();
                                        clearOrder();
                                        updatetotal();
                                    });
                                }
                                else {
                                    updatetotal();
                                }
                            });
                            break;
                    }
                }
                updatetotal();
            }
            setkeypadtimeout();
        }
    }
    function saveOrder() {
        var store = Ext.getStore('orderlistStore');
        var list = store.getRange();
        var items = [];
        Ext.each(list, function(record, index) {
            var itemcode = record.get('foodid');
            var item = data.Items[itemcode];
            var orderitem = {
                ItemCode: itemcode,
                ItemName: record.get('name'),
                CategoryCode: item.CategoryCode,
                CategoryName: data.ItemCategories[item.CategoryCode].Name,
                Quantity: record.get('quantity'),
                Price: record.get('price'),
                PriceType: item.PriceType,
                Status: 'ORDER',
                SeqNo: index+1,
            }
            if (item.PriceType == 'CHOICE') {
                $.extend(orderitem, {
                    ChoiceGroupCode: item.ChoiceGroupCode,
                    ChoiceGroupName: data.ChoiceGroups[item.ChoiceGroupCode].Name,
                });
            }
            recordoptions = record.get('option');
            var options = [];
            Ext.each(item.OptionList, function(optiongroup, optionindex) {
                var optioncode = recordoptions[optionindex];
                var defaultflag = 'F';
                if (!optioncode) {
                    optioncode = optiongroup.DefaultOptionCode;
                    defaultflag = 'T';
                }
                var orderoption = {
                    OptionGroupCode: optiongroup.OptionGroupCode,
                    OptionGroupName: data.OptionGroups[optiongroup.OptionGroupCode].Name,
                    OptionCode: optioncode,
                    DefaultFlag: defaultflag,
                    SeqNo: optionindex+1,
                }
                Ext.each(data.OptionGroups[optiongroup.OptionGroupCode].OptionList, function(option) {
                    if (optioncode == option.OptionCode) {
                        orderoption.OptionName = option.Name;
                        orderoption.Price = option.Price;
                        return false;
                    }
                });
                options.push(orderoption);
            });
            orderitem.OrderOptions = options;
            items.push(orderitem);
        });
        order.OrderItems = items;
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
        if (order.TaxExemptFlag == 'T') {
            var tax = 0;
        }
        else {
            var tax = Math.round(total * 9.5) / 100;
        }
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
            var fooditem = data.Items[foodid];
            if (comp.data.choice) {
                record.set('choice', comp.data.choice);
                record.set('choicename', comp.data.name);
            }
            if (comp.data.option) {
                var optionarray = record.get('option');
                Ext.each(fooditem.OptionList, function(itemoption, index) {
                    if (itemoption.OptionGroupCode == comp.data.optiongroupcode) {
                        var defaultoption = itemoption.DefaultOptionCode;
                        if (comp.data.option == defaultoption) {
                            optionarray[index] = null;
                        }
                        else {
                            optionarray[index] = comp.data.option;
                        }
                        return false;
                    }
                });
                record.set('option', optionarray);
            }
            var price = 0;
            if (fooditem.PriceType == 'FIX') {
                price = parseFloat(fooditem.Price||0);
            }
            else {
                Ext.each(data.ChoiceGroups[fooditem.ChoiceGroupCode].ChoiceList, function(choice) {
                    if (choice.ChoiceCode == record.get('choice')) {
                        price = parseFloat(choice.Price||0);
                        return false;
                    }
                });
            }
            var optionarray = record.get('option');
            Ext.each(fooditem.OptionList, function(itemoption, index) {
                if (optionarray[index]) {
                    optioncode = optionarray[index];
                }
                else {
                    optioncode = itemoption.DefaultOptionCode;
                }
                Ext.each(data.OptionGroups[itemoption.OptionGroupCode].OptionList, function(option) {
                    if (option.OptionCode == optioncode) {
                        if (option.Price) {
                            price = price + parseFloat(option.Price||0);
                        }
                        return false;
                    }
                });
            });
            record.set('price', price);
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
        var choicecount = 0;
        var optioncount = 0;
        if (fooditem.PriceType == 'CHOICE') {
            var priceset = data.ChoiceGroups[fooditem.ChoiceGroupCode].ChoiceList;
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
                        choice: item.ChoiceCode,
                        name: item.Name,
                        price: item.Price,
                    },
                    html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>' + item.Name + '</span></td></tr></table>',
                });
                if (currentchoice == item.ChoiceCode) {
                    choice.addBodyCls('selected');
                }
                panel.add(choice);
                choicecount++;
                var element = $(choice.el.dom);
                bindClick(element, optionclick);
            });
            optioncount++;
        }
        if (fooditem.OptionList.length > 0) {
            for (i=0; i<fooditem.OptionList.length; i++) {
                var optiongroup = data.OptionGroups[fooditem.OptionList[i].OptionGroupCode];
                var optionlist = optiongroup.OptionList;
                var panel = Ext.create('Ext.panel.Panel', {
                    height: 60*optionratio+2,
                    width: optionlist.length*60*optionratio+3,
                    margin: '2 10 2 10',
                    bodyCls: 'optionpanel',
                    style: 'float: left',
                });
                optionpanel.add(panel);
                Ext.each(optionlist, function(item, index) {
                    var choice = Ext.create('Ext.panel.Panel', {
                        width: 50*optionratio,
                        height: 50*optionratio,
                        bodyCls: 'optionlabel',
                        margin: 5*optionratio,
                        bodyStyle: 'font-size: ' + 80*optionratio + '%',
                        style: 'float: left',
                        data: { 
                            optiongroupcode: optiongroup.OptionGroupCode,
                            option: item.OptionCode,
                            name: item.Name,
                            price: item.Price,
                        },
                        html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>' + item.Name + '</span></td></tr></table>',
                    });
                    if ((currentoption[i] == item.OptionCode)||(!currentoption[i] && (item.OptionCode == fooditem.OptionList[i].DefaultOptionCode))) {
                        choice.addBodyCls('selected');
                    }
                    panel.add(choice);
                    choicecount++;
                    var element = $(choice.el.dom);
                    bindClick(element, optionclick);
                });
                optioncount++;
            }
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
                height: 120*choiceratio*2 + 80,
                width: 5 * 120 * choiceratio + 15 + 20,
                layout: 'fit',
                closable: false,
                modal: true,
                items: {
                    id: 'choicepanel',
                    autoScroll: true,
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
                        choice: item.ChoiceCode,
                        name: item.Name,
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
                store.add({ foodid: itemdata.ItemCode, name: itemdata.Name, choice: compx.data.choice, choicename: compx.data.name, quantity: 1, price: compx.data.price, option: []});
                var count = store.getCount();
                Ext.getCmp('orderGrid').getView().select(store.getAt(count-1));
                updatetotal();
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
            store.add({ foodid: itemdata.ItemCode, name: itemdata.Name, quantity: 1, price: itemdata.Price, option: [] });
            var count = store.getCount();
            Ext.getCmp('orderGrid').getView().select(store.getAt(count-1));
            updatetotal();
        }
    }
    function renderMenu() {
        var tempcategoryitem = {}
        for (var itemcategorycode in data.ItemCategories) {
            var itemcategory = data.ItemCategories[itemcategorycode];
            tempcategoryitem[itemcategorycode] = [];
        }
        for (var itemcode in data.Items) {
            var item = data.Items[itemcode];
            var list = tempcategoryitem[item.CategoryCode];
            var index = -1;
            for (var i=0; i<list.length; i++) {
                if (list[i].SeqNo > item.SeqNo) {
                    index = i;
                    break;
                }
            }
            var newitem = {
                SeqNo: item.SeqNo,
                ItemCode: item.ItemCode,
            }
            if (index == -1) {
                list.push(newitem);
            }
            else {
                list.splice(index,0,newitem);
            }
        }
        var tag = "";
        var itemcategories = [];
        for (var itemcategorycode in data.ItemCategories) {
            var itemcategory = data.ItemCategories[itemcategorycode];
            var newcategory = {
                SeqNo: itemcategory.SeqNo,
                CategoryCode: itemcategory.ItemCategoryCode,
            }
            var index = -1;
            for (var i=0; i<itemcategories.length; i++) {
                if (itemcategories[i].SeqNo > itemcategory.SeqNo) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                itemcategories.push(newcategory);
            }
            else {
                itemcategories.splice(index,0,newcategory);
            }
        }
        for (var i=0; i<itemcategories.length; i++) {
            var itemcategory = data.ItemCategories[itemcategories[i].CategoryCode];
            tag += "<table style='width:100%;padding:10px;'><tr><td><table style='font-size:" + 100*itemratio + "%' class=foodpanel><tr><td>" + itemcategory.Name + "</td></tr><tr><td>";
            var itemlist = tempcategoryitem[itemcategory.ItemCategoryCode];
            for (var j=0; j<itemlist.length; j++) {
                var item = data.Items[itemlist[j].ItemCode];
                var style = "width:" + 60*itemratio + "px;height:" + 60*itemratio + "px;margin:" + 10*itemratio + "px;font-size:80%";
                tag += "<div class=foodlabel style='" + style + "' id=" + item.ItemCode + " itemcode=" + item.ItemCode + "><table cellpadding=0 cellspacint=0 style='text-align:center' width=100% height=100%><tr><td><span>" + item.Name.replace(/\n/g, "<br>") + "</span></td></tr></table></div>";
            }
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
        }
    }
});

