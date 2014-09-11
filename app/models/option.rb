class Option < ActiveRecord::Base
#  attr_accessible :name, :option_code
  belongs_to :option_group
end
