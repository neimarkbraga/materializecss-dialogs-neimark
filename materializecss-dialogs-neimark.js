/*
    Title: Neimark Materialize Css Dialogs
    Author: Neimark Junsay Braga
    Date: Aug 4, 2017
*/
function MaterializeDialog(options) {
    //variables
    if(!options) options = {};
    var myOptions = {
        color: options.color || '',
        opacity: options.opacity || .5,
        in_duration: options.inDuration || 300,
        out_duration: options.outDuration || 200,
        starting_top: options.startingTop || '4%',
        ending_top: options.endingTop || '10%',
        dialog_title_tag: options.dialogTitleTag || 'h4',
        preloader_size: options.preloaderSize || 'small',
        preloader_label_tag: options.preloaderLabelTag || 'h5',
        preloader_default_label: options.preloaderDefaultLabel || 'Loading...'
    };
    var createCircularPreLoader = function () {
        var circle = document.createElement('div');
        $(circle)
            .attr('class', 'circle');
        var circle_clipper_left = document.createElement('div');
        $(circle_clipper_left)
            .attr('class', 'circle-clipper left')
            .append(circle);
        var gap_patch = document.createElement('div');
        $(gap_patch)
            .attr('class', 'gap-patch')
            .append($(circle).clone());
        var circle_clipper_right = document.createElement('div');
        $(circle_clipper_right)
            .attr('class', 'circle-clipper right')
            .append($(circle).clone());
        var spinner_layer = document.createElement('div');
        $(spinner_layer)
            .css('border-color', myOptions.color)
            .attr('class', 'spinner-layer')
            .append(circle_clipper_left)
            .append(gap_patch)
            .append(circle_clipper_right);
        var pre_loader_wrapper = document.createElement('div');
        $(pre_loader_wrapper)
            .attr('class', 'preloader-wrapper active ' + myOptions.preloader_size)
            .append(spinner_layer);
        return pre_loader_wrapper;
    };
    var TopModal = function (options) {
        var ThisModal = this;
        if(!options) options = {};
        var modalOptions = {
            dismissible: options.dismissible
        };
        this.title = document.createElement(myOptions.dialog_title_tag);
        this.inner_content = document.createElement('div');
        this.content = document.createElement('div');
        this.footer = document.createElement('div');
        this.body = document.createElement('div');
        this.onReady = function () {};
        this.onComplete = function () {};
        $(this.content)
            .attr('class', 'modal-content')
            .append(this.title)
            .append(this.inner_content);
        $(this.footer)
            .attr('class', 'modal-footer');
        $(this.body)
            .attr('class', 'modal')
            .append(this.content)
            .append(this.footer)
            .modal({
                dismissible: modalOptions.dismissible,
                opacity: myOptions.opacity,
                inDuration: myOptions.in_duration,
                outDuration: myOptions.out_duration,
                startingTop: myOptions.starting_top,
                endingTop: myOptions.ending_top,
                ready: function () {ThisModal.onReady();},
                complete: function () {ThisModal.onComplete(); $(ThisModal.body).remove();}
            });
        $('body').append(this.body);
    };
    var BottomModal = function () {
        var ThisModal = this;
        this.label = document.createElement(myOptions.preloader_label_tag);
        this.content = document.createElement('div');
        this.body = document.createElement('div');
        this.onReady = function () {};
        this.onComplete = function () {};
        $(this.label)
            .css('display', 'inline-block')
            .css('margin', '0px 10px');
        $(this.content)
            .css('display', 'flex')
            .css('align-items', 'center')
            .attr('class', 'modal-content')
            .append(createCircularPreLoader())
            .append(this.label);
        $(this.body)
            .attr('class', 'modal bottom-sheet')
            .append(this.content)
            .modal({
                dismissible: false,
                opacity: myOptions.opacity,
                inDuration: myOptions.in_duration,
                outDuration: myOptions.out_duration,
                startingTop: myOptions.starting_top,
                endingTop: myOptions.ending_top,
                ready: function () {ThisModal.onReady();},
                complete: function () {ThisModal.onComplete(); $(ThisModal.body).remove();}
            });
        $('body')
            .append(this.body);
    };
    this.alert = function (title, message, callback) {
        var _title = title || '';
        var _message = message || '';
        var _callback = callback || function () {};
        var myModal = new TopModal({dismissible: true});
        var component = {
            paragraph: document.createElement('p'),
            ok_button: document.createElement('button')
        };
        $(component.paragraph)
            .html(_message);
        $(component.ok_button)
            .css('background-color', myOptions.color)
            .attr('type', 'button')
            .attr('class', 'btn modal-action modal-close waves-effect waves-light')
            .html('OK')
            .on('click', function () {
                _callback();
                $(myModal.body).modal('close');
            });
        $(myModal.title).html(_title);
        $(myModal.inner_content)
            .html('')
            .append(component.paragraph);
        $(myModal.footer)
            .html('')
            .append(component.ok_button);
        $(myModal.body)
            .modal('open');
        myModal.onReady = function () {
            $(component.ok_button).focus();
        };
    };
    this.confirm = function (title, message, callback) {
        var _title = title || '';
        var _message = message || '';
        var _callback = callback || function () {};
        var myModal = new TopModal({dismissible: false});
        var component = {
            paragraph: document.createElement('p'),
            yes_button: document.createElement('button'),
            no_button: document.createElement('button')
        };
        $(component.paragraph)
            .html(_message);
        $(component.yes_button)
            .css('background-color', myOptions.color)
            .css('margin', '0 5px')
            .attr('type', 'button')
            .attr('class', 'btn waves-effect waves-light')
            .html('YES')
            .on('click', function () {
                $(myModal.body).modal('close');
                _callback(null, true);
            });
        $(component.no_button)
            .css('margin', '0 5px')
            .attr('type', 'button')
            .attr('class', 'btn-flat waves-effect')
            .html('NO')
            .on('click', function () {
                $(myModal.body).modal('close');
                _callback(null, false);
            });
        $(myModal.title).html(_title);
        $(myModal.inner_content)
            .html('')
            .append(component.paragraph);
        $(myModal.footer)
            .html('')
            .append(component.yes_button)
            .append(component.no_button);
        $(myModal.body)
            .modal('open');
        myModal.onReady = function () {
            $(component.yes_button).focus();
        };
    };
    this.prompt = function (title, message, callback, options) {
        if(!options) options = {};
        var _title = title || '';
        var _message = message || '';
        var _callback = callback || function () {};
        var _type = options.type || 'text';
        var _placeholder = options.placeholder || '';
        var _value = options.value || '';
        var _required = options.required;
        var myModal = new TopModal({dismissible: false});
        var component = {
            paragraph: document.createElement('p'),
            placeholder: document.createElement('label'),
            input: document.createElement('input'),
            input_field: document.createElement('div'),
            form: document.createElement('form'),
            ok_button: document.createElement('button')
        };
        $(component.paragraph)
            .css('margin-bottom', '25px')
            .html(_message);
        $(component.placeholder)
            .html(_placeholder);
        $(component.input)
            .attr('class', 'validate')
            .attr('value', _value)
            .attr('type', _type);
        if(_required)
            $(component.input)
                .attr('required', 'required');
        $(component.input_field)
            .append(component.input)
            .append(component.placeholder)
            .attr('class', 'input-field');
        $(component.ok_button)
            .css('background-color', myOptions.color)
            .attr('type', 'submit')
            .attr('class', 'btn waves-effect waves-light')
            .html('OK');
        $(myModal.title)
            .html(_title);
        $(myModal.inner_content)
            .html('')
            .append(component.paragraph)
            .append(component.input_field);
        $(myModal.footer)
            .html('')
            .append(component.ok_button);
        $(component.form)
            .append(myModal.content)
            .append(myModal.footer)
            .on('submit', function (e) {
                e.preventDefault();
                _callback(null, $(component.input).val());
                $(myModal.body).modal('close');
            });
        $(myModal.body)
            .append(component.form)
            .modal('open');
        myModal.onReady = function () {
            $(component.input).focus();
        };
    };
    this.preloader = function (label) {
        var myModal = new BottomModal();
        $(myModal.label).html(label || myOptions.preloader_default_label);
        $(myModal.body).modal('open');
        this.close = function () {$(myModal.body).modal('close');};
    };
}