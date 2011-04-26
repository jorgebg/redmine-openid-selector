/*
	Simple OpenID Plugin
	http://code.google.com/p/openid-selector/
	
	This code is licensed under the New BSD License.
*/

var providers_large = {
	google : {
		name : 'Google',
		url : 'https://www.google.com/accounts/o8/id'
	},
	yahoo : {
		name : 'Yahoo',
		url : 'http://me.yahoo.com/'
	},
	aol : {
		name : 'AOL',
		label : 'Nhập vào tên tài khoảng AOL của bạn.',
		url : 'http://openid.aol.com/{username}'
	},
	myopenid : {
		name : 'MyOpenID',
		label : 'Nhập vào tên tên tài khoản MyOpenID của bạn.',
		url : 'http://{username}.myopenid.com/'
	},
	openid : {
		name : 'OpenID',
		label : 'Nhập vào OpenID của bạn.',
		url : null
	}
};

var providers_small = {
	livejournal : {
		name : 'LiveJournal',
		label : 'Nhập vào tên tài khoản Livejournal của bạn.',
		url : 'http://{username}.livejournal.com/'
	},
	wordpress : {
		name : 'Wordpress',
		label : 'Nhập vào tên tài khoản Wordpress.com của bạn.',
		url : 'http://{username}.wordpress.com/'
	},
	blogger : {
		name : 'Blogger',
		label : 'Tài khoản Blogger của bạn',
		url : 'http://{username}.blogspot.com/'
	},
	verisign : {
		name : 'Verisign',
		label : 'Tên tài khoản Verisign của bạn',
		url : 'http://{username}.pip.verisignlabs.com/'
	},
	claimid : {
		name : 'ClaimID',
		label : 'Tên tài khoản ClaimID của bạn',
		url : 'http://claimid.com/{username}'
	},
	clickpass : {
		name : 'ClickPass',
		label : 'Nhập vào tên tài khoản ClickPass của bạn',
		url : 'http://clickpass.com/public/{username}'
	},
	google_profile : {
		name : 'Google Profile',
		label : 'Nhập vào tên tài khoản Google Profile của bạn',
		url : 'http://www.google.com/profiles/{username}'
	}
};

openid.locale = 'vi';
openid.sprite = 'en';
openid.demo_text = 'Ở chế độ trình diễn. Thông thường nên dùng OpenID:';
openid.signin_text = 'Đăng Nhập';
openid.image_title = 'đăng nhập với {provider}';