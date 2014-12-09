class Order < ActiveRecord::Base
  has_many :order_items, dependent: :delete_all, autosave: :true
  
  def save!
    if self.order_no.blank?
      begin
        self.order_no = (0...8).map { (65 + rand(26)).chr }.join
      end until self.class.where(:order_no => self.order_no).blank?
    end
    super
  end
  
  def hash_data options=[]
    options = [options].flatten
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
    unless options.include? :nochild
      result[:OrderItems] = self.order_items.map { | order_item | order_item.hash_data} 
    end
    return result
  end
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      case name
        when 'order_items'
          self.order_items.clear
          (value||[]).each do | childvalue |
            record = self.order_items.build
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
  
  def self.get_last_queue_no orderdate
    a = arel_table.dup; a.table_alias = 'a'
    arel = a.project(a[:queue_no]).
      where(a[:order_date].eq(orderdate)).
      order('id desc').take(1)
    record = find_by_sql(arel.to_sql).first
    return record.queue_no unless record.blank?
  end
  
  def self.refresh_order orderdate, lastrefreshtime
    a = arel_table.dup; a.table_alias = 'a'
    arel = a.project(Arel.star).
      where(a[:order_date].eq(orderdate)).
      order('id asc')
    arel.where(a[:update_date].gteq(lastrefreshtime)) unless lastrefreshtime.blank?
    records = find_by_sql(arel.to_sql)
    return records
  end
  
  def self.select_by_date order_date, options=[]
    options = [options].flatten
    a = arel_table.dup; a.table_alias = 'a'
    arel = a.project(a[:id], a[:queue_no], a[:order_time], a[:order_type], a[:status]).
      where(a[:order_date].eq(order_date)).
      where(a[:status].not_eq('CANCEL')).
      order('id desc')
    records = find_by_sql(arel.to_sql)
    if options.include? :hash
      return records.map do | record | 
        result = record.hash_data :nochild 
        result[:OrderItems] = record.order_items.map do | record |
          {
            :ItemName => record.item_name,
            :Quantity => record.quantity,
          }
        end
        result
      end
    else
      return records
    end
  end
  
  def self.load_for_edit id, options=[]
    options = [options].flatten
    record = Order.find(id)
    record.status = 'WAIT'
    record.update_date = DateTime.now
    record.save!
    if options.include? :hash
      return record.hash_data
    else
      return record
    end
  end
  
  def self.unlock id
    record = Order.find(id)
    record.status = 'ORDER'
    record.update_date = DateTime.now
    record.save!
  end
end
