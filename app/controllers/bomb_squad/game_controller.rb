module BombSquad

  ##
  # The GameController class provides the one method needed to display the game page.

  class GameController < ::ApplicationController
    def play
      render 'play', layout: false
    end
  end
end