module BombSquad

  ##
  # The GameController class provides the one method needed to display the game page.
  #
  # **Most of the magic happens in the javascript:**
  # 
  #     :include: bomb_squad.js.erb

  class GameController < ::ApplicationController
  
    ##
    # Renders the game page
    #
    
    def play
      render 'play', layout: false
    end

    
  end
end