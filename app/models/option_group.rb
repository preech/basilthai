class OptionGroup < ActiveRecord::Base
#  attr_accessible :name, :option_group_code
  has_many :options, dependent: :delete_all, autosave: :true
end
