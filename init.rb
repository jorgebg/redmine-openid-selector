require 'redmine'
require_dependency 'openid_selector/hooks'

Redmine::Plugin.register :redmine_openid_selector do
  name 'Redmine OpenID Selector plugin'
  author 'Jorge Barata Gonzalez'
  description 'Provides an OpenID selector at login.'
  version '0.0.1'
  url 'http://projects.jorgebg.com/projects/redmine-openid-selector'
  author_url 'http://www.jorgebg.com/about'
end
