class ItemOption < ActiveRecord::Base
#  attr_accessible :default_option_code, :option_group_code
  belongs_to :item
end
