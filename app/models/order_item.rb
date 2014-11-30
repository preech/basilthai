class OrderItem < ActiveRecord::Base
  belongs_to :order
  has_many :order_options, dependent: :delete_all, autosave: :true
  
  def hash_data
    result = {}
    self.attributes.each do | key,value |
      name = key.camelize
      case self.class.columns_hash[key].type
        when :decimal
          result[name] = value.to_f
        when :time
          result[name] = value.strftime('%H:%M:%S.%L')
        else
          result[name] = value
      end
    end
    result[:OrderOptions] = self.order_options.map { | order_option | order_option.hash_data}
    return result
  end
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      case name
        when 'order_options'
          self.order_options.clear
          (value||[]).each do | childvalue |
            record = self.order_options.build
            childvalue['id'] = nil
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
