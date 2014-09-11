class ProgramController < ApplicationController
  def page
    unless params[:program].blank?
      @program_js = "#{params[:program]}/main.js"
      @program_css = "#{params[:program]}.css"
    end
  end
end
