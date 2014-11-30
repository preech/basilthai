class CookTicketController < TemplateController

  def fetch
    orderdate = params[:OrderDate]
    lastrefreshtime = params[:LastRefreshTime]
    orders = Order.refresh_order(orderdate, lastrefreshtime)
    data = {
      :RefreshTime => DateTime.now,
      :Orders => orders.map { | order | order.hash_data },
    }
    render :json => { :success => true, :data => data }
  end
  
  def update
    transaction do
      data = params[:data] || "{}"
      hash = JSON.parse(data)
      order = Order.find(params[:id])
      order.hash_data = hash
      order.update_date = DateTime.now
      order.save!
      #abort!
      render :json => { :success => true }
    end
  end
  
end