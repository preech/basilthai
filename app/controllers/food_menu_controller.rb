class FoodMenuController < TemplateController

  def edit
    data = Item.load_all
    # data = {
      # "ChoiceGroups" => {
        # "SPRINGROLL" => {
          # "ChoiceGroupCode" => "SPRINGROLL",
          # "Name" => "Spring Roll",
          # "ChoiceList" => [{
            # "ChoiceCode" => "PORK",
            # "Name" => "Pork",
            # "Price" => 2.95
          # },{
            # "ChoiceCode" => "VEG",
            # "Name" => "Veg",
            # "Price" => 2.95
          # }]
        # }
      # },
      # "ItemCategories" => {
        # "APPETIZER" => {
          # "ItemCategoryCode" => "APPETIZER",
          # "Name" => "Appetizers",
          # "Description" => "",
          # "SortIndex" => 0.10000
        # },
        # "THAISALAD" => {
          # "ItemCategoryCode" => "THAISALAD",
          # "Name" => "Thai Salads",
          # "Description" => "",
          # "SortIndex" => 0.00000
        # }
      # },
      # "OptionGroups" => {
        # "SPICY" => {
          # "OptionGroupCode" => "SPICY",
          # "Name" => "Spicy",
          # "OptionList" => [{
            # "OptionCode" => "SLIGHT",
            # "Name" => "Slightly Spicy"
          # },{
            # "OptionCode" => "MEDIUM",
            # "Name" => "Medium Spicy"
          # },{
            # "OptionCode" => "SPICY",
            # "Name" => "Spicy"
          # }]
        # }
      # },
      # "Items" => {
        # "CHICKENSATAY" => {
          # "ItemCode" => "CHICKENSATAY",
          # "Name" => "Chicken Satay",
          # "Description" => "",
          # "PriceType" => "FIX",
          # "Price" => 6.25,
          # "OptionList" => [],
          # "CategoryCode" => "APPETIZER",
          # "ChoiceGroupCode" => "",
          # "CategoryIndex" => 0.10000
        # },
        # "TOFUSATAY" => {
          # "ItemCode" => "TOFUSATAY",
          # "Name" => "Tofu Satay",
          # "Description" => "",
          # "PriceType" => "FIX",
          # "Price" => 5.45,
          # "OptionList" => [],
          # "CategoryCode" => "APPETIZER",
          # "ChoiceGroupCode" => "",
          # "CategoryIndex" => 0.10000
        # },
        # "THAISROLL" => {
          # "ItemCode" => "THAISROLL",
          # "Name" => "Thai Spring Roll",
          # "Description" => "",
          # "PriceType" => "CHOICE",
          # "Price" => 0.00,
          # "OptionList" => [],
          # "CategoryCode" => "APPETIZER",
          # "ChoiceGroupCode" => "SPRINGROLL",
          # "CategoryIndex" => 0.10000
        # },
        # "BEEFNUMTOK" => {
          # "ItemCode" => "BEEFNUMTOK",
          # "Name" => "Beef Num Tok Salad",
          # "Description" => "",
          # "PriceType" => "FIX",
          # "Price" => 6.95,
          # "OptionList" => [{
            # "DefaultOptionCode" => "MEDIUM",
            # "OptionGroupCode" => "SPICY"
          # }],
          # "CategoryCode" => "THAISALAD",
          # "ChoiceGroupCode" => "",
          # "CategoryIndex" => 0.00000
        # }
      # }
    # }
    render :json => { :success => true, :data => data }
  end
  
  def update
    transaction do
      data = params[:data] || "{}"
      hash = JSON.parse(data)
      ItemCategory.delete_all
      hash["ItemCategories"].each do | key, value |
        record = ItemCategory.new
        record.item_category_code = value["ItemCategoryCode"]
        record.name = value["Name"]
        record.seq_no = value["SeqNo"]
        record.save!
      end
      Choice.delete_all
      ChoiceGroup.delete_all
      hash["ChoiceGroups"].each do | key, value |
        record = ChoiceGroup.new
        record.choice_group_code = value["ChoiceGroupCode"]
        record.name = value["Name"]
        value["ChoiceList"].each do | childvalue |
          child = record.choices.build
          child.choice_code = childvalue["ChoiceCode"]
          child.name = childvalue["Name"]
          child.price = childvalue["Price"]
        end
        record.save!
      end
      Option.delete_all
      OptionGroup.delete_all
      hash["OptionGroups"].each do | key, value |
        record = OptionGroup.new
        record.option_group_code = value["OptionGroupCode"]
        record.name = value["Name"]
        value["OptionList"].each do | childvalue |
          child = record.options.build
          child.option_code = childvalue["OptionCode"]
          child.name = childvalue["Name"]
          child.price = childvalue["Price"]
        end
        record.save!
      end
      ItemOption.delete_all
      Item.delete_all
      hash["Items"].each do | key, value |
        record = Item.new
        record.item_code = value["ItemCode"]
        record.name = value["Name"]
        record.description = value["Description"]
        record.price_type = value["PriceType"]
        record.price = value["Price"]
        record.category_code = value["CategoryCode"]
        record.choice_group_code = value["ChoiceGroupCode"]
        record.seq_no = value["SeqNo"]
        value["OptionList"].each do | childvalue |
          child = record.options.build
          child.default_option_code = childvalue["DefaultOptionCode"]
          child.option_group_code = childvalue["OptionGroupCode"]
        end
        record.save!
      end
      #abort!
      render :json => { :success => true }
    end
  end
end
