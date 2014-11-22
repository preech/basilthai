class OrderItem < ActiveRecord::Base
  belongs_to :order
  has_many :order_options, dependent: :delete_all, autosave: :true
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      case name
        when 'order_options'
          self.order_options.clear
          (value||[]).each do | childvalue |
            record = self.order_options.build
            record.hash_data = childvalue
          end
        else
          if not value.kind_of?(Array)
            self[name] = value
          end
      end
    end
  end
end
