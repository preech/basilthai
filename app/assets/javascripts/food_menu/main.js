//= require_tree .

Ext.onReady(function () {
    var screensize;
    var ratio;
    var data;
    var originalData;
    var itemratio = 1;
    var currentitem;
    var currentcategory;
    
	$(window).on('beforeunload', function() {
        if (Ext.getCmp('btnSave').disabled) {
            return ;
        }
        else {
            return 'Data is changed. Are you sure you want to leave?';
        }
    });
    Util.initial(this);
    createStore();
    var main = Ext.create('Ta.control.Application', {
        loadConfig: function() {
            screensize = Util.getScreenSize();
            var config = {
                width: PHONE ? screensize.width*2 : screensize.width,
                height: screensize.height,
                items: [{
                    layout: 'border',
                    items: [{
                        id: 'panelEditItem',
                        region: 'east',
                        width: PHONE ? screensize.width : screensize.width/3,
                        layout: 'absolute',
                        disabled: true,
                        height: 470,
                        overflowY: 'auto',
                        items: [{
                            xtype: 'textfield',
                            id: 'boxItemName',
                            x: 10,
                            y: 10,
                            width: PHONE ? screensize.width-35 : screensize.width/3-35,
                        }, {
                            xtype: 'radiogroup',
                            id: 'radioPriceType',
                            fieldLabel: 'Price Type',
                            x: 10,
                            y: 50,
                            items: [
                                {boxLabel: 'Fix', name: 'pricetype', inputValue: 'FIX', checked: true},
                                {boxLabel: 'Choice', name: 'pricetype', inputValue: 'CHOICE'},
                            ]
                        }, {
                            xtype: 'panel',
                            layout: 'card',
                            id: 'panelPrice',
                            x: 10,
                            y: 80,
                            bodyStyle: 'border: none',
                            activeItem: 0,
                            items: [{
                                xtype: 'panel',
                                layout: 'absolute',
                                id: 'tabFix',
                                bodyStyle: 'border: none',
                                items: [{
                                    xtype: 'label', 
                                    text: 'Price', 
                                    x: 0, 
                                    y: 5,
                                }, {
                                    xtype: 'numberfield', 
                                    id: 'boxPrice', 
                                    x: 80, 
                                    y: 0,
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false,
                                }]
                            }, {
                                xtype: 'panel',
                                layout: 'absolute',
                                id: 'tabChoice',
                                bodyStyle: 'border: none',
                                items: [{
                                    xtype: 'label', 
                                    text: 'Choice', 
                                    x: 0, 
                                    y: 5,
                                }, {
                                    xtype: 'textfield', 
                                    id: 'boxChoiceGroup', 
                                    x: 50, 
                                    y: 0,
                                    readOnly: true,
                                }, {
                                    xtype: 'button',
                                    id: 'buttonChoiceGroup',
                                    x: 230,
                                    y: 0,
                                }, {
                                    xtype: 'gridpanel',
                                    id: 'gridChoice',
                                    store: 'storeGridChoice',
                                    x: 0,
                                    y: 25,
                                    width: PHONE ? screensize.width-25 : screensize.width/3-25,
                                    height: 100,
                                    hideHeaders: true,
                                    columns: [{
                                        xtype: 'gridcolumn',
                                        dataIndex: 'name',
                                        width: 150,
                                    }, {
                                        xtype: 'numbercolumn',
                                        dataIndex: 'price',
                                        width: 100,
                                    }]
                                }]
                            }]
                          }, {
                            xtype: 'fieldset',
                            id: 'panelOptionGroup',
                            x: 10,
                            y: 220,
                            width: PHONE ? screensize.width-25 : screensize.width/3-25,
                            height: 290,
                            title: 'Options',
                        }]
                    }, {
                        region: 'center',
                        id: 'pnlMenu',
                        region: 'center',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        bodyCls: 'menupanel',
                    }],
                }],
                buttons: [{
                    id: 'btnSave',
                    text: 'save',
                    disabled: true,
                }, {
                    id: 'btnNewCategory',
                    text: 'new category',
                }, {
                    id: 'btnNewItem',
                    text: 'new item',
                }],
            }
            return config;
        },
        afterRefresh: function() {
            load_data(function() {
                render_menu();
            });
        },
    });
    
    function createStore() {
        Ext.create('Ext.data.Store', {
            storeId: 'storeGridChoice',
            fields:[{
                name: 'name', 
            }, {
                name: 'price', 
            }],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                }
            }
        });
    }

    function load_data(callback) {
        if (data) {
            callback();
        }
        else {
            Util.requestCallback('GET', null, null, null, null, function(returnData) {
                data = returnData;
                originalData = $.extend(true, {}, data);
                console.log(data);
                callback();
            });
        }
    }
    
    function save_menu() {
        var itemcategories = {}
        var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom);
        var foodpanels = pnlMenu.find("table[ctype='foodpanel']");
        var itemcategoryseqno = 1;
        $.each(foodpanels, function(index, element) {
            var foodpanel = $(element);
            var itemcategorycode = foodpanel.attr('categorycode');
            var itemcategoryname = foodpanel.find("input[class='categoryname']:first").val();
            itemcategories[itemcategorycode] = {
                ItemCategoryCode: itemcategorycode,
                Name: itemcategoryname,
                SeqNo: itemcategoryseqno,
            }
            var foodlabels = foodpanel.find("[ctype='foodlabel']");
            itemseqno = 1;
            $.each(foodlabels, function(index, element) {
                var foodlabel = $(element);
                var itemcode = foodlabel.attr('itemcode');
                var item = data.Items[itemcode];
                item.SeqNo = itemseqno;
                item.CategoryCode = itemcategorycode;
                itemseqno++;
            });
            
            itemcategoryseqno++;
        });
        data.ItemCategories = itemcategories;
    }
    
    function render_menu() {
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
            tag += "<table ctype=foodcontainer style='width:100%;padding:10px;'><tr><td>";
            tag += "<table style='font-size:" + 100*itemratio + "%' ctype=foodpanel class=foodpanel categorycode=" + itemcategory.ItemCategoryCode + "><tr><td>";
            tag += "<input class=categoryname type=text value='" + itemcategory.Name + "'/></td><td style='width:20px'>";
            tag += "<div class='deletebutton'><span class='text'>X</span></div></td></tr><tr><td>";
            var itemlist = tempcategoryitem[itemcategory.ItemCategoryCode];
            for (var j=0; j<itemlist.length; j++) {
                var item = data.Items[itemlist[j].ItemCode];
                var style = "width:" + 60*itemratio + "px;height:" + 60*itemratio + "px;margin:" + 10*itemratio + "px;font-size:80%";
                tag += "<div ctype=foodlabel class=foodlabel style='" + style + "' id=" + item.ItemCode + " itemcode=" + item.ItemCode + "><table cellpadding=0 cellspacint=0 style='text-align:center' width=100% height=100%><tr><td><span>" + item.Name.replace(/\n/g, "<br>") + "</span></td></tr></table></div>";
            }
            tag += "</td></tr></table></td></tr></table>";
        }
        var pnlmenu = Ext.getCmp('pnlMenu');
        pnlmenu.update(tag);
        $(pnlmenu.el.dom).find("input[class='categoryname']").bind('blur', function(event) {
            var box = $(event.target);
            if (!box.val()) {
                box.val('category name');
            }
        });
        Ext.getCmp('btnNewCategory').on('click', function() {
            var table = $("[id='pnlMenu-innerCt']").eq(0);
            var categorycode = Util.genCode(8, function(value) {
                var list = table.find("table[ctype='foodpanel']");
                for (var i=0; i<list.length; i++) {
                    if (list.eq(i).attr('categorycode') == value) {
                        return true;
                    }
                }
            });
            var tag = "<table ctype=foodcontainer style='width:100%;padding:10px;'><tr><td>";
            tag += "<table style='font-size:" + 100*itemratio + "%' ctype=foodpanel class=foodpanel categorycode='" + categorycode + "'><tr><td>";
            tag += "<input class=categoryname type=text value='category name'/></td><td style='width:20px'>";
            tag += "<div class='deletebutton'><span class='text'>X</span></div></td></tr><tr><td></td></tr></table>";
            table.append(tag);
            var box = table.find("input[class='categoryname']:last").eq(0);
            box.bind('blur', function(event) {
                var box = $(event.target);
                if (!box.val()) {
                    box.val('category name');
                }
            });
            currentcategory = box.parents("table[ctype='foodcontainer']:eq(0)");
            Ext.getCmp('panelEditItem').disable();
            if (currentitem) {
                currentitem.removeClass('activeitem');
                currentitem = undefined;
                Ext.getCmp('boxItemName').setRawValue(null);
                Ext.getCmp('radioPriceType').setValue({pricetype: 'FIX'});
                Ext.getCmp('panelPrice').getLayout().setActiveItem(0);
                Ext.getCmp('boxPrice').setValue(null);
                Ext.getCmp('boxChoiceGroup').setValue(null);
                Ext.getCmp('panelOptionGroup').update(null);
            }
            checkChange();
        });
        Ext.getCmp('btnNewItem').on('click', function() {
            var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom);
            var foodpanels = pnlMenu.find("table[ctype='foodpanel']");
            if (foodpanels.length > 0) {
                var itemcode = Util.genCode(8, function(value) {
                    for (var key in data.Items) {
                        if (key == value) {
                            return true;
                        }
                    };
                });
                var item = {
                    ItemCode: itemcode,
                    Name: 'item name',
                    Price: 0,
                    PriceType: 'FIX',
                    OptionList: [],
                }
                data.Items[item.ItemCode] = item;
                var style = "width:" + 60*itemratio + "px;height:" + 60*itemratio + "px;margin:" + 10*itemratio + "px;font-size:80%";
                var tag = "<div ctype=foodlabel class=foodlabel style='" + style + "' id=" + item.ItemCode + " itemcode=" + item.ItemCode + "><table cellpadding=0 cellspacint=0 style='text-align:center' width=100% height=100%><tr><td><span>" + item.Name.replace(/\n/g, "<br>") + "</span></td></tr></table></div>";
                if (currentitem) {
                    currentitem.after(tag);
                    currentitem.removeClass('activeitem');
                    var fooditem = currentitem.next();
                }
                else {
                    if (currentcategory) {
                        var itemparent = currentcategory.find('td').eq(3);
                    }
                    else {
                        var itemparent = foodpanels.eq(0).find('td').eq(2);
                    }
                    itemparent.append(tag);
                    var fooditem = itemparent.find("div[ctype='foodlabel']:last");
                }
                fooditem.addClass('activeitem');
                currentitem = fooditem;
                displayItemPanel();
            }
            checkChange();
        });
        Ext.getCmp('boxItemName').on('blur', function() {
            if (currentitem) {
                var name = Ext.getCmp('boxItemName').getValue();
                var item = data.Items[currentitem.attr('itemcode')];
                item.Name = name;
                currentitem.find('span').eq(0).html(name.replace(/\n/g, "<br>"));
                checkChange();
            }
        });
        Ext.getCmp('btnSave').on('click', function() {
            save_menu();
            Util.requestCallback('PUT', null, null, null, data, function(returnData) {
                Ext.Msg.alert('message', 'ready', function() {
                    Ext.getCmp('btnSave').disable();
                });
            });
        });
        Ext.each(Ext.getCmp('radioPriceType').query('radiofield'), function(radiofield) {
            radiofield.on({
                change: function(control, newvalue, oldvalue) {
                    if (newvalue == true && currentitem) {
                        var item = data.Items[currentitem.attr('itemcode')];
                        item.PriceType = control.inputValue;
                        if (item.PriceType == 'FIX') {
                            Ext.getCmp('panelPrice').getLayout().setActiveItem(0);
                        }
                        else {
                            Ext.getCmp('panelPrice').getLayout().setActiveItem(1);
                        }
                        checkChange();
                    }
                }
            });
        });
        Ext.getCmp('boxPrice').on('blur', function() {
            if (currentitem) {
                var price = Ext.getCmp('boxPrice').getValue();
                var item = data.Items[currentitem.attr('itemcode')];
                item.Price = price;
                checkChange();
            }
        });
        Ext.getCmp('buttonChoiceGroup').on('click', function() {
            LookupChoiceGroup.show(data, function(code) {
                Ext.getCmp('boxChoiceGroup').setValue(data.ChoiceGroups[code].Name);
                var item = data.Items[currentitem.attr('itemcode')];
                item.ChoiceGroupCode = code;
                displayGridChoice();
                checkChange();
            });
        });
    }
    
    function displayGridChoice() {
        var item = data.Items[currentitem.attr('itemcode')];
        var choicegroupcode = item.ChoiceGroupCode;
        store = Ext.getStore('storeGridChoice');
        store.removeAll();
        if (choicegroupcode) {
            if (choicegroupcode) {
                var choicelist = data.ChoiceGroups[choicegroupcode].ChoiceList;
                Ext.each(choicelist, function(choice) {
                    store.add({
                        name: choice.Name,
                        price: choice.Price,
                    });
                });
            }
        }
    }
    
    function displayItemPanel() {
        Ext.getCmp('panelEditItem').enable();
        var item = data.Items[currentitem.attr('itemcode')];
        Ext.getCmp('boxItemName').setRawValue(item.Name);
        Ext.getCmp('radioPriceType').setValue({pricetype: item.PriceType});
        if (item.PriceType == 'FIX') {
            Ext.getCmp('panelPrice').getLayout().setActiveItem(0);
        }
        else {
            Ext.getCmp('panelPrice').getLayout().setActiveItem(1);
        }
        Ext.getCmp('boxPrice').setValue(item.Price);
        if (item.ChoiceGroupCode) {
            Ext.getCmp('boxChoiceGroup').setValue(data.ChoiceGroups[item.ChoiceGroupCode].Name);
        }
        else {
            Ext.getCmp('boxChoiceGroup').setValue('');
        }
        displayGridChoice();
        displayItemOption(item);
    }
    
    function displayItemOption(item) {
        var tag = '';
        for (var i=0; i<item.OptionList.length; i++) {
            var option = item.OptionList[i];
            var optionGroup = data.OptionGroups[option.OptionGroupCode];
            tag += "<div class='optiongroup' code='" + optionGroup.OptionGroupCode + "'>"
            tag += "<table class='tableheader' cellpadding=0 cellspacing=0><tr><td>" + optionGroup.Name + "</td></tr></table>";
            tag += "<div class='deletebutton'><span class='text'>X</span></div>";
            tag += "<table class='tabledetail' style='position:relative;left:0px;top:-20px;' cellpadding=0 cellspacing=0>";
            for (var j=0; j<optionGroup.OptionList.length; j++) {
                var choice = optionGroup.OptionList[j];
                tag += "<tr>";
                tag += "<td style='border-top:1px dotted blue;text-align:center;width:20px'>" + ((choice.OptionCode==option.DefaultOptionCode)?'x':'') + "</td>";
                tag += "<td style='border-top:1px dotted blue'>" + choice.Name + "</td>";
                tag += "</tr>";
            }
            tag += "</table>";
            tag += "</div>";
        }
        tag += "<div class='optiongroup' code='<<new>>'>"
        tag += "<table class='tablenew' cellpadding=0 cellspacing=0><tr><td>select from list</td></tr></table></div>";
        var panel = Ext.getCmp('panelOptionGroup');
        panel.update(tag);
        $(panel.el.dom).find("div[class='optiongroup']").bind('click', function(event) {
            var target = $(event.target);
            if (target.attr('class') == 'optiongroup') {
                var box = target;
            }
            else {
                var box = target.parents("div[class='optiongroup']:first");
            }
            var optionGroupCode = box.attr('code');
            if (target.attr('class') == 'deletebutton' || target.parents("div[class='deletebutton']:first").length > 0) {
                for (var i=0; i<item.OptionList.length; i++) {
                    if (item.OptionList[i].OptionGroupCode == optionGroupCode) {
                        item.OptionList.splice(i, 1);
                        displayItemOption(item);
                        checkChange();
                        break;
                    }
                }
            }
            else {
                if (optionGroupCode == '<<new>>') {
                    ignoreList = [];
                    for (var i=0; i<item.OptionList.length; i++) {
                        ignoreList.push(item.OptionList[i].OptionGroupCode);
                    }
                    LookupOptionGroup.show(data, ignoreList, function(option) {
                        item.OptionList.push(option);
                        displayItemOption(item);
                    }, function() {
                        checkChange();
                    });
                }
                else {
                    var itemOption = null;
                    for (var i=0; i<item.OptionList.length; i++) {
                        if (item.OptionList[i].OptionGroupCode == optionGroupCode) {
                            itemOption = item.OptionList[i];
                            break;
                        }
                    }
                    EditOptionDefault.show(data.OptionGroups[optionGroupCode], itemOption, function(result) {
                        if (result) {
                            displayItemOption(item);
                            checkChange();
                        }
                    });
                }
            }
        });
    }
    function checkChange() {
        save_menu();
        var result = compareObject(originalData, data);
        if (result == false) {
            Ext.getCmp('btnSave').enable();
        }
        else {
            Ext.getCmp('btnSave').disable();
        }
    }
    function compareObject(objA, objB) {
        if (objA == undefined ||
            objA == null ||
            typeof objA === 'string' ||
            typeof objA === 'number') {
            return (objA == objB);
        }
        else if ($.isArray(objA)) {
            if ($.isArray(objB) && objA.length == objB.length) {
                for (var i=0; i<objA.length; i++) {
                    if (compareObject(objA[i], objB[i]) == false) {
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
        else if ($.type(objA) == 'object') {
            if ($.type(objB) == 'object') {
                var listA = [];
                for (var prop in objA) {
                    listA.push(prop);
                }
                var listB = [];
                for (var prop in objB) {
                    listB.push(prop);
                }
                if (compareObject(listA, listB) == false) {
                    return false;
                }
                else {
                    for (var prop in objA) {
                        if (compareObject(objA[prop], objB[prop]) == false) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            else {
                return false;
            }
        }
        alert($.type(objA));
    }
    
    var dragdata;
    function mousedown(e) {
        if (dragdata) {
            dragdata.dummy.remove();
        }
        dragdata = undefined;
        var target = $(e.target);
        if (target.attr('class') == 'categoryname') {
            Ext.defer(function() {
                currentcategory = target.parents("table[ctype='foodcontainer']:eq(0)");
                Ext.getCmp('panelEditItem').disable();
                if (currentitem) {
                    currentitem.removeClass('activeitem');
                    currentitem = undefined;
                    Ext.getCmp('boxItemName').setRawValue(null);
                    Ext.getCmp('radioPriceType').setValue({pricetype: 'FIX'});
                    Ext.getCmp('panelPrice').getLayout().setActiveItem(0);
                    Ext.getCmp('boxPrice').setValue(null);
                    Ext.getCmp('boxChoiceGroup').setValue(null);
                    Ext.getCmp('panelOptionGroup').update(null);
                }
            }, 100);
        }
        else if (target.attr('class') == 'deletebutton' || target.parents("div[class='deletebutton']:first").length > 0) {
            var category = target.parents("table[ctype='foodcontainer']:eq(0)");
            var foodlabels = category.find("[ctype='foodlabel']");
            if (foodlabels.length > 0) {
                Ext.Msg.confirm('', 'You will lost all items in this category, confirm to delete!', function(answer) {
                    if (answer == 'yes') {
                        for (var i=0; i<foodlabels.length; i++) {
                            var itemcode = foodlabels.eq(i).attr('itemcode');
                            delete data.Items[itemcode];
                        }
                        category.remove();
                        currentitem = undefined;
                        currentcategory = undefined;
                        checkChange();
                    }
                });
            }
            else {
                category.remove();
                currentitem = undefined;
                currentcategory = undefined;
                checkChange();
            }
        }
        else {
            var acontrol = target.parents("div[ctype='foodlabel']:eq(0)");
            if (acontrol.length > 0) {
                if (currentitem) {
                    currentitem.removeClass('activeitem');
                }
                currentitem = acontrol;
                currentitem.addClass('activeitem');
                currentcategory = currentitem.parents("table[ctype='foodcontainer']:eq(0)");
                displayItemPanel();
                var position = acontrol.position();
                var offset = acontrol.offset();
                var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom).children(":eq(0)");
                var scrolltop = pnlMenu.scrollTop();
                dragdata = {
                    type: 'ITEM',
                    control: acontrol,
                    originalposition: {
                        left: position.left,
                        top: position.top + scrolltop,
                        scrolltop: scrolltop,
                        offsetleft: offset.left,
                        offsettop: offset.top,
                    },
                    clickposition: {
                        x: e.pageX,
                        y: e.pageY,
                    },
                }
                var dummy = acontrol.clone();
                dummy.removeAttr('ctype')
                dummy.css('position', 'absolute');
                dummy.css('left', dragdata.originalposition.left + "px");
                dummy.css('top', dragdata.originalposition.top + "px");
                dummy.css('cursor', 'pointer');
                pnlMenu.append(dummy);
                dragdata.dummy = dummy;
                dragdata.control.css('visibility', 'hidden');
            }
            else {
                var acontrol = target.parents("table[ctype='foodcontainer']:eq(0)");
                if (acontrol.length > 0) {
                    var position = acontrol.position();
                    var offset = acontrol.offset();
                    var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom).children(":eq(0)");
                    var scrolltop = pnlMenu.scrollTop();
                    dragdata = {
                        type: 'CATEGORY',
                        control: acontrol,
                        originalposition: {
                            left: position.left,
                            top: position.top + scrolltop,
                            scrolltop: scrolltop,
                            offsetleft: offset.left,
                            offsettop: offset.top,
                        },
                        clickposition: {
                            x: e.pageX,
                            y: e.pageY,
                        },
                    }
                    var dummy = acontrol.clone();
                    dummy.removeAttr('ctype')
                    dummy.css('position', 'absolute');
                    dummy.css('left', dragdata.originalposition.left + "px");
                    dummy.css('top', dragdata.originalposition.top + "px");
                    dummy.css('cursor', 'pointer');
                    dummy.find('input').css('cursor', 'pointer');
                    pnlMenu.append(dummy);
                    dragdata.dummy = dummy;
                    dragdata.control.css('visibility', 'hidden');
                    currentitem = undefined;
                    currentcategory = acontrol;
                }
            }
        }
    }
    function mousemove(e, originalEvent) {
        if (dragdata) {
            if (dragdata.type == 'ITEM') {
                var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom).children(":eq(0)");
                var diffx = e.pageX - dragdata.originalposition.offsetleft - 5;
                var diffy = e.pageY - dragdata.originalposition.offsettop - dragdata.originalposition.scrolltop + pnlMenu.scrollTop() - 5;
                dragdata.dummy.css('left', (dragdata.originalposition.left + diffx) + 'px');
                dragdata.dummy.css('top', (dragdata.originalposition.top + diffy) + 'px');
                if (originalEvent) {
                    originalEvent.preventDefault();
                }
            }
            else if (dragdata.type == 'CATEGORY') {
                var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom).children(":eq(0)");
                var diffy = e.pageY - dragdata.originalposition.offsettop - dragdata.originalposition.scrolltop + pnlMenu.scrollTop() - 5;
                dragdata.dummy.css('top', (dragdata.originalposition.top + diffy) + 'px');
                if (originalEvent) {
                    originalEvent.preventDefault();
                }
            }
        }
    }
    function mouseup(e) {
        if (dragdata) {
            if (dragdata.type == 'ITEM') {
                var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom);
                var foodpanels = pnlMenu.find("table[ctype='foodpanel']");
                $.each(foodpanels, function(index, element) {
                    var foodpanel = $(element);
                    var position = foodpanel.offset();
                    var left = position.left;
                    var right = position.left + foodpanel.width();
                    var top = position.top;
                    var bottom = position.top + foodpanel.height();
                    if (left <= e.pageX && e.pageX <= right && top <= e.pageY && e.pageY <= bottom) {
                        var effindex = -1;
                        var foodlabels = foodpanel.find("[ctype='foodlabel']");
                        $.each(foodlabels, function(index, element) {
                            var foodlabel = $(element);
                            var position = foodlabel.offset();
                            var rightpos = position.left + foodlabel.width();
                            var bottompos = position.top + foodlabel.height();
                            if (e.pageY > bottompos || e.pageY > position.top && e.pageX > rightpos ) {
                                effindex = index;
                            }
                        });
                        var itemcode = dragdata.control.attr('itemcode');
                        var item = data.Items[itemcode];
                        var style = "width:" + 60*itemratio + "px;height:" + 60*itemratio + "px;margin:" + 10*itemratio + "px;font-size:80%";
                        tag = "<div ctype=foodlabel class='foodlabel' style='" + style + "' id=" + item.ItemCode + " itemcode=" + item.ItemCode + "><table cellpadding=0 cellspacint=0 style='text-align:center' width=100% height=100%><tr><td><span>" + item.Name.replace(/\n/g, "<br>") + "</span></td></tr></table></div>";
                        if (effindex >=0) {
                            foodlabels.eq(effindex).after(tag);
                            var newitem = foodlabels.eq(effindex).next();
                        }
                        else {
                            if (foodlabels.length == 0) {
                                foodpanel.find('td').eq(2).append(tag);
                                var newitem = foodpanel.find("[ctype='foodlabel']").eq(0);
                            }
                            else {
                                foodlabels.eq(0).before(tag);
                                var newitem = foodlabels.eq(0).prev();
                            }
                        }
                        newitem.addClass('activeitem');
                        currentitem = newitem;
                        dragdata.control.remove();
                        return false;
                    }
                });
                dragdata.control.css('visibility', 'visible');
                dragdata.dummy.remove();
            }
            else if (dragdata.type == 'CATEGORY') {
                var pnlMenu = $(Ext.getCmp('pnlMenu').el.dom);
                var foodpanels = pnlMenu.find("table[ctype='foodcontainer']");
                var effindex = -1;
                $.each(foodpanels, function(index, element) {
                    var foodpanel = $(element);
                    var position = foodpanel.offset();
                    var bottom = position.top + foodpanel.height();
                    if (e.pageY > bottom) {
                        effindex = index;
                    }
                });
                if (effindex >=0) {
                    if ((effindex < foodpanels.length && foodpanels[effindex] === dragdata.control[0])
                        || ((effindex+1) < foodpanels.length && foodpanels[effindex+1] === dragdata.control[0])) {
                    }
                    else {
                        var reference = foodpanels.eq(effindex);
                        var source = dragdata.control;
                        reference.after(source);
                    }
                }
                else {
                    if (foodpanels[0] === dragdata.control[0]) {
                    }
                    else {
                        var reference = foodpanels.eq(0);
                        var source = dragdata.control;
                        reference.before(source);
                    }
                }
                dragdata.control.css('visibility', 'visible');
                dragdata.dummy.remove();
            }
            checkChange();
        }
        dragdata = undefined;
        //message('[clear]');
    }
    if (iDevice) {
        $(document).bind({
            touchstart: function(e) {
                mousedown(e.originalEvent.touches[0]);
            },
            touchmove: function(e) {
                mousemove(e.originalEvent.touches[0], e.originalEvent);
            },
            touchend: function(e) {
                mouseup(e.originalEvent.changedTouches[0]);
            },
        });
    }
    else {
        $(document).bind({
            mousedown: function(e) {
                mousedown(e);
            },
            mousemove: function(e) {
                mousemove(e);
            },
            mouseup: function(e) {
                mouseup(e);
            },
        });
    }
});




