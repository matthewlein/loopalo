define('menu', function(require) {

    'use strict';

    // ------------------------------------------------------------------------- //
    // Requires
    // ------------------------------------------------------------------------- //

    var localforage = require('localforage');
    var FileSaver = require('FileSaver');
    var canvas = require('canvas');
    var controls = require('controls');

    // ------------------------------------------------------------------------- //
    // App globals
    // ------------------------------------------------------------------------- //

    var globals = require('globals');


    // ------------------------------------------------------------------------- //
    // Menu
    // ------------------------------------------------------------------------- //

    var $exportBtn = $('#export-button');
    $exportBtn.on( 'click', exportSVG );

    // stores the saved
    var savedSettings = [];
    var $savedSettingsUI = $('#settings-list');
    // stored index of currently selected item
    var selectedIndex;

    //
    // Settings Setup
    //
    function getSavedSettings() {

        // requireJS loading localforage requires the .ready() syntax
        localforage.ready(function(){
            localforage.getItem('savedSettings', function(data) {
                if (!!data) {
                    savedSettings = data;
                }
                buildSettingsUI();
            });
        })
    }
    function buildSettingsUI() {
        $.each(savedSettings, function(index, item) {
            var $li = $('<li class="settings-list__item">' + item.name + '</li>');
            $li.data('name', item.name);
            $savedSettingsUI.append($li);
        });
        $savedSettingsUI.on('click', 'li', function() {
            var $this = $(this);

            // deal with classes
            var selectedClass = 'settings-list__item--active';
            $this.siblings().removeClass(selectedClass);
            $this.addClass(selectedClass);
            $loadSettingsBtn.prop('disabled', false);
            $deleteSettingsBtn.prop('disabled', false);

            // set index
            selectedIndex = $this.index();
        });
    }

    // clearing the selection
    function clearSettingSelection() {
        selectedIndex = null;
        $savedSettingsUI.children().removeClass('settings-list__item--active');
        $loadSettingsBtn.prop('disabled', true);
        $deleteSettingsBtn.prop('disabled', true);
    }

    //
    // Settings Save
    //
    var $saveSettingsBtn = $('#save-settings');
    $saveSettingsBtn.on('click', saveDialogOpen);

    var $saveDialogCancel = $('#save-dialog__cancel');
    $saveDialogCancel.on('click', saveDialogClose);

    var $saveDialog = $('#save-dialog');
    var saveDialogHideClass = 'save-dialog--hidden';

    var $saveDialogName = $('#save-dialog__name');
    $saveDialogName.on('keyup change', function() {
        if ( this.value.length ) {
            $saveDialogSave.prop('disabled', false);
        } else {
            $saveDialogSave.prop('disabled', true);
        }
    });

    var $saveDialogSave = $('#save-dialog__save');
    $saveDialogSave.on('click', saveSettings);


    function saveDialogOpen() {
        $saveDialog.removeClass(saveDialogHideClass);
    }

    function saveDialogClose() {
        $saveDialog.addClass(saveDialogHideClass);
        $saveDialogName.val('');
        $saveDialogSave.prop('disabled', true);
    }


    function saveSettings() {

        var name = $saveDialogName.val();

        savedSettings.push({
            name : name,
            settings : globals.settings
        });
        localforage.setItem('savedSettings', savedSettings, function(){
            var $li = $('<li class="settings-list__item">' + name + '</li>');
            $li.data('name', name);
            $savedSettingsUI.append($li);
            clearSettingSelection();
            saveDialogClose();
        });
    }

    //
    // Settings Load
    //
    var $loadSettingsBtn = $('#load-settings');
    $loadSettingsBtn.prop('disabled', true);
    $loadSettingsBtn.on('click', loadSettings);

    function loadSettings() {
        // get from storage
        localforage.getItem('savedSettings', function(data) {
            // set new settings
            globals.settings = data[selectedIndex].settings;
            // update the controller
            controls.updateSettingsUI();
            clearSettingSelection();
        });
    }

    //
    // Settings Delete
    //

    var $deleteSettingsBtn = $('#delete-settings');
    $deleteSettingsBtn.prop('disabled', true);
    $deleteSettingsBtn.on('click', deleteSettings);

    function deleteSettings() {

        // remove the settings from the array
        savedSettings.splice(selectedIndex, 1);

        // save the changed settings array
        localforage.setItem('savedSettings', savedSettings, function(){
            // remove the UI element
            $savedSettingsUI.children().eq(selectedIndex).remove();
            clearSettingSelection();
        })

    }

    //
    // Settings Clear
    //
    var $clearSettingsBtn = $('#clear-settings');
    $clearSettingsBtn.on('click', clearSettings);

    function clearSettings() {
        localforage.setItem('savedSettings', null, function() {
            // remove UI list
            $savedSettingsUI.children().remove();
            clearSettingSelection();
            // settings list is empty
            savedSettings = [];
        })
    }


    // ------------------------------------------------------------------------- //
    // Exports
    // ------------------------------------------------------------------------- //

    function exportSVG() {

        var SVGstring = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + (new XMLSerializer).serializeToString(canvas.canvas.node);

        // uses FileSaver script
        saveAs(
            new Blob(
                [SVGstring],
                {type: 'image/svg+xml;charset=' + document.characterSet}
            ), 'loopalo' + Date.now() + '.svg'
        );
    }


    // ------------------------------------------------------------------------- //
    // Init
    // ------------------------------------------------------------------------- //

    function init() {
        getSavedSettings();
    }

    init();

});