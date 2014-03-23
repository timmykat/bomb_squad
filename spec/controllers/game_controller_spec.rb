require_relative './../spec_helper'

require 'pry-debugger'

describe BombSquad::GameController, :type => :controller do
  describe "GET play" do
    it "renders the play template" do
      get :play, use_route: :bomb_squad
      expect(response).to render_template("game/play")
    end
  end
end


