class PosOrderController < TemplateController
  def load
    data = Item.load_all
    render :json => { :success => true, :data => data }
  end
  
  def update
    transaction do
      data = params[:data] || "{}"
      hash = JSON.parse(data)
      if hash['Id'].blank?
        order = Order.new
      else
        order = Order.find(hash['Id'])
      end
      order.hash_data = hash
      order.update_date = DateTime.now
      order.save!
      #abort!
      render :json => { :success => true }
    end
  end
  
  def get_last_queue_no
    orderdate = params[:OrderDate]
    data = {
      :LastQueueNo => Order.get_last_queue_no(orderdate),
    }
    render :json => { :success => true, :data => data }
  end
  
  def index
    data = Order.select_by_date params[:OrderDate], :hash
    render :json => { :success => true, :data => data }
  end
  
  def load_order
    transaction do
      data = Order.load_for_edit params[:id], :hash
      render :json => { :success => true, :data => data }
    end
  end
  
  def unlock
    transaction do
      Order.unlock(params[:id])
      render :json => { :success => true }
    end
  end
end
