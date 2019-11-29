ls_keywords = [
    {
        "id": 1,
        "Name": "Amazon", 
        "Key": "a", 
        "Site": "https://www.amazon.com/s?k=%key%",
        "icon": "favicon-amazon.png"
    },
    {
        "id": 2,
        "Name": "Baidu", 
        "Key": "b", 
        "Site": "https://www.baidu.com/s?wd=%key%",
        "icon": "favicon-baidu.png"
    },
    {
        "id": 3,
        "Name": "Google", 
        "Key": "g", 
        "Site": "https://www.google.com/search?hl=en&q=%key%",
        "icon": "favicon-google.png"
    },
    {
        "id": 4,
        "Name": "Facebook", 
        "Key": "f", 
        "Site": "https://www.facebook.com/s.php?q=%key%",
        "icon": "favicon-facebook.png"
    },
    {
        "id": 5,
        "Name": "Twitter", 
        "Key": "t", 
        "Site": "https://twitter.com/search?q=%key%",
        "icon": "favicon-twitter.png"
    },
    {
        "id": 6,
        "Name": "Rebbit", 
        "Key": "r", 
        "Site": "https://www.reddit.com/search?q=%key%",
        "icon": "favicon-rebbit.png"
    },
    {
        "id": 7,
        "Name": "Wikipedia", 
        "Key": "w", 
        "Site": "https://wikipedia.org/wiki/%key%",
        "icon": "favicon-wikipedia.png"
    },
    {
        "id": 8,
        "Name": "YouTube", 
        "Key": "y", 
        "Site": "https://www.youtube.com/results?search_query=%key%",
        "icon": "favicon-youtube.png"
    }
]

function redrawTable() {
    // get handle of keyword-table
    var key_table = $('#keyword_list');
    key_table.empty();
    console.log('redraw table now');

    var str_keywords = localStorage.getItem('ss_keywords');
    var keywords = JSON.parse(str_keywords);

    keywords.forEach(keyword => {
        var line = document.createElement('tr');   
        line.setAttribute('id', 'ss_key_' + keyword.id);
        line.setAttribute('style', line.getAttribute('style') + ';' + 'border-top : 2px solid #ccc');
        line.setAttribute('style', line.getAttribute('style') + ';' + 'line-height : 1.8em; height : 42px');
        line.setAttribute('draggable', true);        
        line.addEventListener("dragover", allowDrop);
        line.addEventListener("drop", drop);        
        line.addEventListener("dragstart", drag);

        // checks if the current item is set as standard search engine or not
        if (localStorage.getItem('ss_engine') && 'ss_key_' + keyword.id == localStorage.getItem('ss_engine')) {
            line.classList.add('setSE');
            line.style.fontWeight = 'bold';
        } else {
            line.classList.add('notSetSE');
        }
        
        var key_img = document.createElement('td');
        key_img.setAttribute('style', 'width: 30px;');
        var site_icon = document.createElement('img');
        if (keyword.icon) {
            site_icon.setAttribute('src', '../favicon/' + keyword.icon);
        } else {
            site_icon.setAttribute('src', utils.favicon(keyword.Site));    
        }        
        site_icon.setAttribute('style', site_icon.getAttribute('style') + ';' + 'width: 16px; margin-left: 8px;');
        site_icon.setAttribute('style', site_icon.getAttribute('style') + ';' + 'height: 16px; margin-bottom: 4px;');
        key_img.append(site_icon);
        
        var key_name = document.createElement('td');
        key_name.innerHTML = keyword.Name;
        key_name.setAttribute('style', 'width: 170px;');
        // key_name.setAttribute('value', keyword.Name);

        var key_site = document.createElement('td');
        key_site.innerHTML = keyword.Key;
        // key_site.setAttribute('value', keyword.Site);

        var hr_line = document.createElement('hr');

        // var tst = document.createElement('td');
        // tst.setAttribute('width', "50");

        // line.append(tst);
        line.append(key_img);
        line.append(key_name);
        line.append(key_site);        

        key_table.append(line);
        // key_table.append(hr_line);
    });
}

var lastIndex;

function drop(ev) {
    ev.preventDefault();
    
    redrawTable();
}

function allowDrop(ev) {
    ev.preventDefault();
    // console.log(ev.target.parentNode.id);

    var from_id = ev.dataTransfer.getData("from");
    var to_id = ev.path[1].id;
    var from_index, to_index;

    var str_keywords = localStorage.getItem("ss_keywords");
    var keywords = JSON.parse(str_keywords);

    var i = 0;
    keywords.forEach(keyword => {
        if (to_id == "ss_key_" + keyword.id) {
            to_index = i;
        }
        i = i + 1;
    });
    from_index = lastIndex;

    if (from_index == to_index) {
        return;
    }

    if (from_index < to_index) {
        var tmp = keywords[from_index];
        for (var j = from_index; j < to_index; j = j + 1) {
            keywords[j] = keywords[j + 1];
        }
        keywords[to_index] = tmp;
    }

    if (from_index > to_index) {
        var tmp = keywords[from_index];
        for (var j = from_index; j > to_index; j = j - 1) {
            keywords[j] = keywords[j - 1];
        }
        keywords[to_index] = tmp;
    }

    localStorage.setItem('ss_keywords', JSON.stringify(keywords));

    ev.dataTransfer.setData('from', to_id);

    redrawTable();

    lastIndex = to_index; 
    $('#ss_key_' + keywords[to_index].id).css('background-color', '#eee');
}

function drag(ev) {
    var str_keywords = localStorage.getItem("ss_keywords");
    var keywords = JSON.parse(str_keywords);

    var i = 0;
    var from_index = 0;

    keywords.forEach(keyword => {
        if (ev.target.id == "ss_key_" + keyword.id) {
            from_index = i;
        }
        i = i + 1;
    });

    ev.dataTransfer.setData("from_index", from_index);
    ev.currentTarget.style.border = 'none';
    // ev.currentTarget.style.backgroundColor = 'yellow';
    lastIndex = from_index;
}

// add keyword dlg --- > input ---> focus function
$('#dlg_example').focus(function() {
    $('#dlg_i_example').show();
});

$('#dlg_example').focusout(function() {
    $('#dlg_i_example').hide();
});

$('#dlg_keyword').focus(function() {
    $('#dlg_i_keyword').show();
});

$('#dlg_keyword').focusout(function() {
    $('#dlg_i_keyword').hide();
});

$('#dlg_term').focus(function() {
    $('#dlg_i_term').show();
});

$('#dlg_term').focusout(function() {
    $('#dlg_i_term').hide();
});
// add keyword dlg ---->   input --->   focus

function showEditPage(key_id) {
    var str_keywords = localStorage.getItem('ss_keywords');
    var keywords = JSON.parse(str_keywords);

    var edit_index, i = 0;
    keywords.forEach(keyword => {
        if ("ss_key_" + keyword.id == key_id) {
            edit_index = i;
        }
        i = i + 1;
    });

    $('#dlg_example').val(keywords[edit_index].Name);
    $('#dlg_keyword').val(keywords[edit_index].Key);
    $('#dlg_term').val(keywords[edit_index].Site);
    // $('#dlg_example').focus(); 

    $('.container').hide();
    $('body').css('width', '')
    $('#dlg_addKeyword').show();

    $('body').css('width', '320px');    
    $('body').css('height', '285px');
    $('#dlg_i_example').hide();
    $('#dlg_i_keyword').hide();
    $('#dlg_i_term').hide();

    $('#escapeIt').click(function() {
        $('#dlg_addKeyword').hide();
    });

    $('#addIt').click(function() {
        $('#dlg_addKeyword').hide();

        var example = $('#dlg_example').val();
        var keyword = $('#dlg_keyword').val();
        var site = $('#dlg_term').val();

        if (example && site && keyword && example != ''  && keyword != '' && site != '') {
            keywords[edit_index].Key = keyword;
            keywords[edit_index].Name = example;
            keywords[edit_index].Site = site;

            localStorage.setItem('ss_keywords', JSON.stringify(keywords));

            redrawTable();    
        }
        
    });
}

function removeKeyword(key_id) {
    // add code here to remove a specified keyword from keyword_list
    var str_keywords = localStorage.getItem('ss_keywords');
    var keywords = JSON.parse(str_keywords);

    // traverse the keyword list and find out the index of keyword to remove
    var rm_index, i = 0;
    keywords.forEach(keyword => {
        if ('ss_key_' + keyword.id == key_id) {
            rm_index = i;
        }
        i = i + 1;
    });
    
    // remove it
    console.log("remove", rm_index);
    keywords.splice(rm_index, 1);

    localStorage.setItem('ss_keywords', JSON.stringify(keywords));
    redrawTable();

    // add code here to checks if the specified keyword is (or not) set as standard search engine
    if (localStorage.getItem('ss_engine') && key_id == localStorage.getItem('ss_engine')) {
        localStorage.removeItem('ss_engine');
    }
}

function showDialog(type) {
    $('.dialog').hide();
    $('.container').hide();
    
    if (type == 'main') {
        $('body').css('width', '289px');
        $('body').css('height', '342px');
        $('.container').show();        
    } else if (type == 'addKeyword') {
        $('body').css('width', '320px');    
        $('body').css('height', '285px');

        $('#dlg_example').val('');
        $('#dlg_keyword').val('');
        $('#dlg_term').val('');
        $('#dlg_i_example').hide();
        $('#dlg_i_keyword').hide();
        $('#dlg_i_term').hide();       
    
        $('#dlg_addKeyword').show();        
        $('#dlg_example').focus();
    } else if (type == 'LogIn') {
        $('#dlg_login').show();
        $('body').css('width', '365');
        $('body').css('height', '375');

        $('#dlg_login_email_hint').hide();
        $('#dlg_login_password_hint').hide();
        $('#dlg_login_email').val('');
        $('#dlg_login_password').val('');
        $('#dlg_login_email').focus();       
    } else if (type == 'Register') {
        $('#dlg_register').show();
        $('body').css('width', '365');
        $('body').css('height', '450');

        $('#dlg_register_email').val('');
        $('#dlg_register_password').val('');
        $('#dlg_register_confirm').val('');
        $('#dlg_register_email').focus();        
    } else if (type == 'Setting') {
        $('#dlg_setting').show();
        $('body').css('width', '365');
        $('body').css('height', '370');      
        
        var str_reg_user = localStorage.getItem('reg_user');
        var reg_user = JSON.parse(str_reg_user);

        if (reg_user != undefined) {
            $('#dlg_setting_mail').html(reg_user.user_email);    
        }
    } else if (type =='UpdateMail') {
        $('#dlg_mail').show();
        $('body').css('width', '365');
        $('body').css('height', '280');

        $('#dlg_mail_new').val('');
    } else if (type == 'ResetPassword') {
        $('#dlg_password').show();

        $('body').css('width', '365');
        $('body').css('height', '380');
        $('#dlg_password_mail').val('');
    } else if ('NewPassword' == type) {        
        $('#dlg_password_new').show();

        $('body').css('width', '365');
        $('body').css('height', '340');
        $('#dlg_password_new_new').val('');
        $('#dlg_password_new_confirm').val('');
    } else if ('DeleteAccount' == type) {
        $('#dlg_delete_account').show();

        $('body').css('width', '365');
        $('body').css('height', '285');        
    } else if ('Notification' == type) {
        $('#dlg_notification').show();

        $('body').css('width', '365');
        $('body').css('height', '150');  
    }
}

$(function() {
    // contex - menu for keyword items
    $.contextMenu({
        selector: '#keyword_list > tr.notSetSE',
        callback: function(key, options) {                        
            if ("cm_engine" == key) {
                // add some code here to remove search engine from other keyword
                $('#keyword_list > tr').removeClass('setSE');
                $('#keyword_list > tr').addClass('notSetSE');
                $('#keyword_list > tr').css('font-weight', 'normal');

                // set current item as standard search engine
                var cur_selected_id = $(this).attr("id");
                $('#' + cur_selected_id).toggleClass('notSetSE');
                $('#' + cur_selected_id).toggleClass('setSE');
                $('#' + cur_selected_id).css('font-weight', 'bold');
                
                // add some code here to save standard search engine to local storage
                localStorage.setItem('ss_engine', cur_selected_id);
            } else if ("cm_edit" == key) {
                showEditPage($(this).attr('id'));
            } else if ("cm_remove" == key) {
                removeKeyword($(this).attr('id'));
            }
        },
        items: {
            "cm_engine": {
                name: 'Set as standard search engine'                
            },
            "cm_edit": {
                name: "Edit"
            }, 
            "cm_remove": {
                name: "Remove"
            }
        }
    });

    $.contextMenu({
        selector: '#keyword_list > tr.setSE',
        callback: function(key, options) {
            if ("cm_engine" == key) {
                var cur_selected_id = $(this).attr("id");
                $('#' + cur_selected_id).toggleClass('notSetSE');
                $('#' + cur_selected_id).toggleClass('setSE');
                $('#' + cur_selected_id).css('font-weight', 'normal');

                // add some code here to remove standard search engine from localStorage
                localStorage.removeItem('ss_engine');
            } else if ("cm_edit" == key) {
                showEditPage($(this).attr('id'));
            } else if ("cm_remove" == key) {
                removeKeyword($(this).attr('id'));
            }   
        },
        items: {
            "cm_engine": {
                name: 'Remove as standard search engine'
            },
            "cm_edit": {
                name: "Edit"
            },
            "cm_remove": {
                name: "Remove"
            }
        }
    });

    // $('.content').hide();

    // init for first use
    var isLogined = false;
    if (isLogined == true) {
        // toggle btns
        $('#btn_login').hide();
        $('#btn_setting').show();

        // fetch keywords list from the server
        
    } else {
        // toggle btns
        $('#btn_login').show();
        $('#btn_setting').hide();

        // if the user not logined
        // localStorage.removeItem('ss_initialized');
        var is_initialized = localStorage.getItem("ss_initialized");
        if (is_initialized == null) {
            console.log("not initialized");

            // set initialial keyword
            localStorage.setItem('ss_keywords', JSON.stringify(ls_keywords));
            // set initalized flag to 1
            localStorage.setItem('ss_initialized', '1');
        }

        // reads from localstorage
        var str_keywords = localStorage.getItem('ss_keywords');
        var keywords = JSON.parse(str_keywords);

        redrawTable();
    }

    // for manage dialog(s)
    $('.dialog').hide();

    // for add keyword dialog
    $('#add_key').click(function() {
        showDialog('addKeyword');
    });

    // for login dialog
    $('#btn_login').click(function() {
        showDialog('LogIn');
    });

    // for setting dialog
    $('#btn_setting').click(function() {
        showDialog('Setting');
    });

    // add button - click - event - listeners to Add Keyword Dialog
    $('#escapeIt').click(function() {
        showDialog('main');
    });

    $('#addIt').click(function() {
        var str_keywords = localStorage.getItem('ss_keywords');
        var keywords = JSON.parse(str_keywords);

        var example = $('#dlg_example').val();
        var keyword = $('#dlg_keyword').val();
        var site = $('#dlg_term').val();

        if (example == '' || keyword == '' || site == '') {
        } else {
            var max_id = 0;
            keywords.forEach(keyword => {
                if (keyword.id > max_id) {
                    max_id = keyword.id;
                }
            });

            var new_keyword = {
                "id": max_id + 1,
                "Name": example,
                "Key": keyword,
                "Site": site
            };

            keywords.push(new_keyword);
            localStorage.setItem('ss_keywords', JSON.stringify(keywords));
            redrawTable();                
        }
        showDialog('main');
    });

    // behaviors in log-in dialog
    $('#dlg_login_email').change(function() {
        $('#dlg_login_email').removeClass('outline_wrong');
        $('#dlg_login_email').addClass('outline');
        $('#dlg_login_email_hint').hide();
    });

    $('#dlg_login_password').change(function() {
        $(this).removeClass('outline_wrong');
        $(this).addClass('outline');
        $('#dlg_login_password_hint').hide();
    });

    $('#dlg_login_btn_login').click(function() {           
        var email = $('#dlg_login_email').val();
        var password = $('#dlg_login_password').val();

        var str_reg_user = localStorage.getItem('reg_user');
        var reg_user = JSON.parse(str_reg_user);
        console.log(reg_user);

        if ('' == email || reg_user == undefined || reg_user.user_email != email) {                
            $('#dlg_login_email_hint').show();
            $('#dlg_login_email').focus();
            $('#dlg_login_email').addClass('outline_wrong');
            $('#dlg_login_email').removeClass('outline');
            $('#dlg_login_email_hint').html('Sorry, but the username doesn\'t exist.');
        } else if ('' == password || reg_user == undefined || reg_user.user_password != password) {
            $('#dlg_login_password_hint').show();
            $('#dlg_login_password_hint').html('Sorry, but the password is wrong.');
            $('#dlg_login_password_hint').addClass('outline_wrong');
            $('#dlg_login_password_hint').removeClass('outline');
        } else {
            showDialog('main');

            $('#btn_login').hide();
            $('#btn_setting').show();            
        }
    });
    
    $('#dlg_login_btn_register').click(function() {
        showDialog('Register');
    });

    // events in register dialogs
    $('#dlg_register_btn_register').click(function() {
        var email = $('#dlg_register_email').val();
        var password = $('#dlg_register_password').val();
        var confirm = $('#dlg_register_confirm').val();

        if (email && password && confirm && email != '' && 
            password != '' && confirm != '' && password == confirm) {
                var reg_user = {
                    user_email: email,
                    user_password: password
                }
                localStorage.setItem("reg_user", JSON.stringify(reg_user));
                showDialog('main');

                $('#btn_login').hide();
                $('#btn_setting').show();
            }
        else {
            alert('please make valid input');    
        }        
    });

    $('#dlg_register_btn_login').click(function() {
        showDialog('LogIn');
    });

    // events in settings
    $('#dlg_setting_btn_logout').click(function() {
        $('#btn_setting').hide();
        $('#btn_login').show();
        
        showDialog('main');
    });

    $('#dlg_setting_btn_mail').click(function() {
        showDialog('UpdateMail');
    });

    $('#dlg_setting_btn_pass').click(function() {
        showDialog('ResetPassword');
    });

    $('#dlg_setting_btn_delete').click(function() {
        showDialog('DeleteAccount');
    })

    // events in update mails
    $('#dlg_mail_update').click(function() {
        var new_mail = $('#dlg_mail_new').val();
        if (new_mail != '') {
            var str_reg_user = localStorage.getItem('reg_user');
            var reg_user = JSON.parse(str_reg_user);

            reg_user.user_email = new_mail;

            localStorage.setItem('reg_user', JSON.stringify(reg_user));
        }
        showDialog('Setting');
    });

    $('#dlg_mail_cancel').click(function() {
        showDialog('Setting');
    });

    // events in reset password dlg
    $('#dlg_password_reset').click(function() {
        localStorage.setItem('tmp_email', $('#dlg_password_email').val());

        showDialog('NewPassword');
    });

    $('#dlg_password_cancel').click(function() {
        showDialog('Setting');
    });

    // events in new password dlg
    $('#dlg_password_new_update').click(function() {
        var password_new = $('#dlg_password_new_new').val();
        var password_confirm = $('#dlg_password_new_confirm').val();

        var str_reg_user = localStorage.getItem('reg_user');
        var reg_user = JSON.parse(str_reg_user);

        if (password_new == password_confirm && localStorage.getItem('tmp_email') == reg_user.user_email) {
            reg_user.user_password = password_new;

            localStorage.setItem('reg_user', JSON.stringify(reg_user));
        }

        showDialog('Setting');
    });

    $('#dlg_password_new_cancel').click(function() {
        showDialog('Setting');
    });

    // events in delete dialog
    $('#dlg_delete_btn_confirm').click(function() {
        localStorage.removeItem('reg_user');

        showDialog('Notification');
    });

    $('#dlg_delete_btn_cancel').click(function() {
        showDialog('Setting');
    });

    // events in notification
    $('#dlg_notification_close').click(function() {
        window.close();
    });
});