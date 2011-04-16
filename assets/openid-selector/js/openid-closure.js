/**
 * @fileoverview Implementation of the openid-selector written with 
 * the Google Closure library
 * @author Martin Thoma
 */

goog.provide('moose.openidselector');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.net.cookies');

/** @define {boolean} */
moose.ALLOW_AUTOLOGIN    = false;

/**
 * OpenID-Object
 * @param {string} input_id The html-id of the input element, that should submit the OpenID
 * @constructor
 */
moose.openidselector = function(input_id) {
	this.version = /** @type {string} */ ('1.3'); // version constant
	this.demo = /** @type {boolean} */ (openid.demo);
	this.demo_text = /** @type {string} */ (openid.demo_text);
	this.cookie_expires = /** @type {number} */ (6 * 30); // 6 months.
	this.cookie_name = /** @type {string} */ ('openid_provider');
	this.cookie_path = /** @type {string} */ ('/');

	this.img_path = /** @type {string} */ ('images/');
	this.locale = /** @type {string} */ (openid.locale);          // is set in openid-<locale>.js
	this.sprite = /** @type {string} */ (openid.sprite);          // usually equals to locale, is set in openid-<locale>.js
	this.signin_text = /** @type {string} */ (openid.signin_text);// text on submit button on the form
	this.all_small = /** @type {boolean} */ (false);              // output large providers w/ small icons
	this.no_sprite = /** @type {boolean} */ (false);              // don't use sprite image
	this.image_title = /** @type {string} */ (openid.image_title);// for image title

	this.input_id = input_id;
    this.input_element = goog.dom.getElement(input_id);

	this.provider_url = /** @type {string} */ ('');
	this.provider_id = undefined;

    this.providers = goog.object.create();
    goog.object.extend(this.providers, providers_large, providers_small);

    this.openid_btns = goog.dom.getElement('openid_btns');
    var openid_choice = goog.dom.getElement('openid_choice');
    openid_choice.style.display = 'block';                                      //goog.style.showElement(openid_choice, true);
    this.openid_input_area = goog.dom.getElement('openid_input_area');
    goog.dom.removeChildren(this.openid_input_area);

    var i = 0;
    // add box for each provider
    goog.object.forEach(providers_large, function(element, id, object){
        this.getBoxHTML(
            id, 
            providers_large[id], 
            (this.all_small ? 'small' : 'large'), 
            i++
        );
    }, this);


	if (providers_small) {
        goog.dom.appendChild(this.openid_btns, goog.dom.createDom('br'));
        goog.object.forEach(providers_small, function(element, id, object){
            this.getBoxHTML(id, providers_small[id], 'small', i++);
        }, this);
	}

    this.openid_form = goog.dom.getElement('openid_form');                
    var box_id = goog.net.cookies.get(this.cookie_name);// this.readCookie();
	if (box_id) {
		this.signin(box_id, true);
	}
};

/**
  * 
  * @param {string} box_id e.g. "google", "yahoo", "myopenid", ...
  * @param {Object} provider e.g. {label: "Enter your MyOpenID username.", name: "MyOpenID", url: "http://{username}.myopenid.com/"}
  * @param {string} box_size either "large" or "small"
  * @param {number} index
  */
moose.openidselector.prototype.getBoxHTML = function(box_id, provider, box_size, index) {
    if (this.no_sprite) {
        var image_ext = (box_size == 'small') ? '.ico.gif' : '.gif';
        var box = goog.dom.createDom('a', {
                'title' : this.image_title.replace('{provider}', provider["name"]),
                'href'  : 'javascript:openidselectorobject.signin(\'' + box_id + '\');',
			    'style' : 'background: #FFF url(' + this.img_path + '../images.' + box_size + '/' + box_id + image_ext + ') no-repeat center center',
                'class' : box_id + ' openid_' + box_size + '_btn'
             }, null);
    }
	var x = (box_size == 'small') ? -index * 24 : -index * 100;
	var y = (box_size == 'small') ? -60 : 0;

	var box = goog.dom.createDom('a', {
                'title' : this.image_title.replace('{provider}', provider["name"]),
                'href'  : 'javascript:openidselectorobject.signin(\'' + box_id + '\');',
			    'style' : 'background: #FFF url(' + this.img_path + 'openid-providers-' + this.sprite + '.png); ' +
                          'background-position: ' + x + 'px ' + y + 'px',
                'class' : box_id + ' openid_' + box_size + '_btn'
              }, null);

    goog.dom.appendChild(this.openid_btns, box);
};

/**
  * 
  * @param {string} box_id e.g. "google", "yahoo", "myopenid", ...
  * @param {boolean} opt_onload
  * @return {boolean}
  */
moose.openidselector.prototype.signin = function(box_id, opt_onload) {
	var provider = this.providers[box_id];
	if (!provider) {
		return false;
	}
	this.highlight(box_id);  
    goog.net.cookies.set(
        this.cookie_name, 
        box_id, 
        this.cookie_expires * 24 * 60 * 60, 
        this.cookie_path
    );                                                 
	this.provider_id = box_id;
	this.provider_url = provider['url'];
	// prompt user for input?
	if (provider['label']) {
		this.useInputBox(provider);
	} else {
		goog.dom.removeChildren(this.openid_input_area);
		if (!opt_onload || moose.ALLOW_AUTOLOGIN) {
		    this.submit();                                          
		}
	}
    return false;
};

/**
 * Sign-in button click
 * @return {boolean}
 */
moose.openidselector.prototype.submit = function() {
	var url = this.provider_url;
	if (url) {
        var openid_username = goog.dom.getElement('openid_username');
        // Google and Yahoo! don't need usernames
        if(openid_username){
		    url = url.replace('{username}', openid_username.value);
        }
		this.setOpenIdUrl(url);
	}
	if (this.demo) {
		alert(this.demo_text + "\r\n" + this.input_element.value);
		return false;
	}
	if (url.indexOf("javascript:") == 0) {
		url = url.substr("javascript:".length);
		eval(url);
		return false;
	}
	return true;
};

/**
 * @param {string} url The OpenID identifier
 */
moose.openidselector.prototype.setOpenIdUrl = function(url) {
	var hidden = this.input_element;
	if (hidden != null) {
		hidden.value = url;
	} else {
        goog.dom.append(this.openid_form, goog.dom.createDom(
                        'input', {
                            'type'  : 'hidden',
                            'id'    : this.input_id,
                            'name'  : this.input_id,
                            'value' : url
                        }));
	}
};

/**
 * @param {string} box_id e.g. "google", "yahoo", "myopenid", ...
 */
moose.openidselector.prototype.highlight = function(box_id) {
	// remove previous highlight.
	var highlighted_link = goog.dom.getElement('openid_highlight');
 
	if (highlighted_link) {
        var links = goog.dom.getElementsByTagNameAndClass('a', undefined, highlighted_link);
        var only_link = links[0];
        goog.dom.replaceNode(only_link, highlighted_link);
	}       
	// add new highlight.
    var link_to_highlight = goog.dom.getElementsByTagNameAndClass('a', box_id, this.openid_btns)[0];
    var new_dom = goog.dom.createDom('div', {'id':'openid_highlight'}, goog.dom.createDom('a', {
            'title':link_to_highlight.title,
            'href':link_to_highlight.href,
            'style':link_to_highlight.style.cssText,
            'class':link_to_highlight.className
            })
    );
    goog.dom.replaceNode(new_dom, link_to_highlight);
};

/**
 * @param {Object} provider e.g. {label: "Enter your MyOpenID username.", name: "MyOpenID", url: "http://{username}.myopenid.com/"}
 */
moose.openidselector.prototype.useInputBox = function(provider) {
	var input_area = this.openid_input_area;
	var id = 'openid_username';
	var value = '';
	var label = provider['label'];
	var style = '';
    goog.dom.removeChildren(input_area);
	if (label) {
		var html = goog.dom.createDom('p', '', label);
	} else {
        var html = goog.dom.createDom('p', '');
    }
	goog.dom.append(input_area,html);
	if (provider['name'] == 'OpenID') {
		id = this.input_id;
		value = 'http://';
		style = 'background: #FFF url(' + this.img_path + 'openid-inputicon.gif) no-repeat scroll 0 50%; padding-left:18px;';
	}
    goog.dom.append(input_area, 
                    goog.dom.createDom('input', {
                        'id' : id,
                        'type': "text",
                        'style': style,
                        'name' : id,
                        'value': value
                    })
    );
    goog.dom.append(input_area, 
                    goog.dom.createDom('input', {
                        'id' : 'openid_submit',
                        'type': "submit",
                        'value': this.signin_text
                    })
    );
    goog.dom.getElement(id).focus();
};

moose.openidselector.prototype.setDemoMode = function() {
    this.demo = true;
};


// If you don't do that, you get an "Uncaught ReferenceError: moose is not defined"
// http://code.google.com/intl/de-DE/closure/compiler/docs/api-tutorial3.html#export
window['openidselector'] = moose.openidselector; // <-- Constructor
goog.exportSymbol('openidselector.prototype.signin', moose.openidselector.prototype.signin); // <-- Constructor
window['openid'] = goog.object.create();
