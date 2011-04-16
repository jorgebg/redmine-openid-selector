module OpenIDSelector
  class Hooks < Redmine::Hook::ViewListener
    render_on :view_account_login_bottom,
              :partial => 'view_account_login_bottom'
  end
end
