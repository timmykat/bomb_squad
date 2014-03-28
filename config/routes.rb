##
# Only one route is needed for the game

BombSquad::Engine.routes.draw do
  get 'play',   to: 'game#play'
end
