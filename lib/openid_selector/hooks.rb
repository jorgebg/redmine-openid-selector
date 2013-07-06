module OpenIDSelector
  class Hooks < Redmine::Hook::ViewListener
    render_on :view_account_login_top,
              :partial => 'view_account_login_top'
  end
end
