/**
* oEmbed Plugin plugin
* Licensed under the MIT license
* jQuery Embed Plugin: http://code.google.com/p/jquery-oembed/ (MIT License)
* Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
* AGORAA DEVS note: added a afterEmbed function to trigger ckeditor change event to update angular model. BUG#4761
*/

(function() {
    function repairHtmlOutput(provider, oldOutput, width, height) {
        switch (provider) {
            case "SlideShare":
                return oldOutput.replace(/width=\"\d+\" height=\"\d+\"/, "width=\"" + width + "\" height=\"" + height + "\"").replace(/http:/, "https:");
            case "Spotify":
                return oldOutput.replace(/width=\"\d+\" height=\"\d+\"/, "width=\"" + width + "\" height=\"" + height + "\"");
            default:
                return oldOutput;
        }
    }

    function embedCode(url, instance, maxWidth, maxHeight, responsiveResize, resizeType, align, widget, editor) {
                    jQuery('body').oembed(url, {
                        onEmbed: function(e) {
                            var elementAdded = false,
                                provider = jQuery.fn.oembed.getOEmbedProvider(url);

                            widget.element.data('resizeType', resizeType);
                            if (resizeType == "responsive" || resizeType == "custom") {
                                widget.element.data('maxWidth', maxWidth);
                                widget.element.data('maxHeight', maxHeight);
                            }
                            widget.element.data('align', align);
                            // TODO handle align
                            if (align == 'center') {
                                if (!widget.inline)
                                    widget.element.setStyle('text-align', 'center');
                                widget.element.removeStyle('float');
                            } else {
                                if (!widget.inline)
                                    widget.element.removeStyle('text-align');
                                if (align == 'none')
                                    widget.element.removeStyle('float');
                                else
                                    widget.element.setStyle('float', align);
                            }

                            if (typeof e.code === 'string') {
                                if (widget.element.$.firstChild) {
                                    widget.element.$.removeChild(widget.element.$.firstChild);
                                }
                                widget.element.appendHtml(e.code);
                                widget.element.data('oembed', url);
                                widget.element.data('oembed_provider', provider.name);
                                widget.element.addClass('oembed-provider-' + provider.name);
                                elementAdded = true;
                            } else if (typeof e.code[0].outerHTML === 'string') {
                                if (widget.element.$.firstChild) {
                                    widget.element.$.removeChild(widget.element.$.firstChild);
                                }
                                widget.element.appendHtml(e.code[0].outerHTML);
                                widget.element.data('oembed', url);
                                widget.element.data('oembed_provider', provider.name);
                                widget.element.addClass('oembed-provider-' + provider.name);
                                elementAdded = true;
                            } else {
                                alert(editor.lang.oembed.noEmbedCode);
                            }

                            setupResizer(widget, editor);
                        },
                        onError: function(externalUrl) {
                            if (externalUrl.indexOf("vimeo.com") > 0) {
                                alert(editor.lang.oembed.noVimeo);
                            } else {
                                alert(editor.lang.oembed.Error);
                            }
                        },
                        maxHeight: maxHeight,
                        maxWidth: maxWidth,
                        useResponsiveResize: responsiveResize,
                        embedMethod: 'editor'
                    });
                }

    function setupResizer(widget, editor) {
        //if (widget.element.data('resizerSetup')) {
        //    return;
        //}

        widget.element.data('resizerSetup', true);

        widget.element.data('oembed');

        var editable = editor.editable(),
            doc = editor.document,

            // Store the resizer in a widget for testing (#11004).
            resizer = widget.resizer = doc.createElement('span');

        resizer.addClass('cke_image_resizer');

        widget.element.append(resizer);

        // Calculate values of size variables and mouse offsets.
        resizer.on('mousedown', function (evt) {
            var factor = widget.data.align == 'right' ? -1 : 1,

                // The x-coordinate of the mouse relative to the screen
                // when button gets pressed.
                startX = parseInt(evt.data.$.screenX),
                startY = parseInt(evt.data.$.screenY),

                // The initial dimensions and aspect ratio of the image.
                startWidth = parseInt(widget.element.data('MaxWidth')) || widget.element.$.clientWidth,
                startHeight = parseInt(widget.element.data('MaxHeight')) || widget.element.$.clientHeight,
                ratio = startWidth / startHeight,

                listeners = [],

                // A class applied to editable during resizing.
                cursorClass = 'cke_image_s' + (!~factor ? 'w' : 'e'),

                nativeEvt, newWidth, newHeight, updateData,
                moveDiffX, moveDiffY, moveRatio;

            // Save the undo snapshot first: before resizing.
            editor.fire('saveSnapshot');

            // Mousemove listeners are removed on mouseup.
            attachToDocuments('mousemove', onMouseMove, listeners);

            // Clean up the mousemove listener. Update widget data if valid.
            attachToDocuments('mouseup', onMouseUp, listeners);

            // The entire editable will have the special cursor while resizing goes on.
            editable.addClass(cursorClass);

            // This is to always keep the resizer element visible while resizing.
            resizer.addClass('cke_image_resizing');

            drawBox(editor, startWidth, startHeight, widget, editor);

            if (widget.element.data('resizeType') !== 'custom' && widget.element.data('resizeType') !== 'responsive') {
                widget.element.data('resizeType', 'custom');
            }

            // Attaches an event to a global document if inline editor.
            // Additionally, if classic (`iframe`-based) editor, also attaches the same event to `iframe`'s document.
            function attachToDocuments(name, callback, collection) {
                var globalDoc = CKEDITOR.document,
                    listeners = [];

                if (!doc.equals(globalDoc))
                    listeners.push(globalDoc.on(name, callback));

                listeners.push(doc.on(name, callback));

                if (collection) {
                    for (var i = listeners.length; i--;)
                        collection.push(listeners.pop());
                }
            }

            // Calculate with first, and then adjust height, preserving ratio.
            function adjustToX() {
                newWidth = startWidth + factor * moveDiffX;
                newHeight = Math.round(newWidth / ratio);
            }

            function adjustBoth() {
                newWidth = startWidth + factor * moveDiffX;
                newHeight = startHeight - moveDiffY;
            }

            // Calculate height first, and then adjust width, preserving ratio.
            function adjustToY() {
                newHeight = startHeight - moveDiffY;

                newWidth = Math.round(newHeight * ratio);
            }

            // This is how variables refer to the geometry.
            // Note: x corresponds to moveOffset, this is the position of mouse
            // Note: o corresponds to [startX, startY].
            //
            //  +--------------+--------------+
            //  |              |              |
            //  |      I       |      II      |
            //  |              |              |
            //  +------------- o -------------+ _ _ _
            //  |              |              |      ^
            //  |      VI      |     III      |      | moveDiffY
            //  |              |         x _ _ _ _ _ v
            //  +--------------+---------|----+
            //                 |         |
            //                  <------->
            //                  moveDiffX
            function onMouseMove(evt) {
                nativeEvt = evt.data.$;

                // This is how far the mouse is from the point the button was pressed.
                moveDiffX = nativeEvt.screenX - startX;
                moveDiffY = startY - nativeEvt.screenY;

                // This is the aspect ratio of the move difference.
                moveRatio = Math.abs(moveDiffX / moveDiffY);

                adjustBoth();

                // Don't update attributes if less than 10.
                // This is to prevent images to visually disappear.
                if (newWidth >= 15 && newHeight >= 15) {


                    var resizeType = widget.element.data('oembed');
                    var align = widget.element.data('align');
                    adjustParentElement(widget, newWidth, newHeight, align);
                    drawBox(editor, newWidth, newHeight, widget, editor);

                    //embedCode(url, editor, newWidth, newHeight, false, resizeType, widget.data.align, widget);
                    //image.setAttributes({ width: newWidth, height: newHeight });
                    updateData = true;
                } else
                    updateData = false;
            }

            function onMouseUp(evt) {
                var l;

                while ((l = listeners.pop()))
                    l.removeListener();

                // Restore default cursor by removing special class.
                editable.removeClass(cursorClass);

                // This is to bring back the regular behaviour of the resizer.
                resizer.removeClass('cke_image_resizing');

                if (updateData) {
                    //widget.setData({ width: newWidth, height: newHeight });

                    var url = widget.element.data('oembed');
                    var resizeType = widget.element.data('resizeType');
                    removeBox(widget);
                    embedCode(url, editor, newWidth, newHeight, (resizeType === "responsive"), resizeType, widget.data.align, widget, editor);
                    widget.element.data('MaxWidth', newWidth),
                    widget.element.data('MaxHeight', newHeight),
                    // Save another undo snapshot: after resizing.
                    editor.fire('saveSnapshot');
                }

                // Don't update data twice or more.
                updateData = false;
            }
        });

        // Change the position of the widget resizer when data changes.
        widget.on('data', function () {
            resizer[widget.data.align == 'right' ? 'addClass' : 'removeClass']('cke_image_resizer_left');
        });
    }

    function drawBox(instance, width, height, widget, editor) {
        if (widget.element.$.firstChild && !jQuery(widget.element.$.firstChild).hasClass('cke-oembed-resize-box')) {
            widget.element.$.removeChild(widget.element.$.firstChild);

            var resizeBox = editor.document.createElement('div');

            resizeBox.addClass('cke-oembed-resize-box');

            resizeBox.setStyle('width', width + 'px');
            resizeBox.setStyle('height', height + 'px');

            jQuery(widget.element.$).prepend(resizeBox.getOuterHtml());

        } else {
            jQuery(widget.element.$.firstChild).css('width', width + 'px');
            jQuery(widget.element.$.firstChild).css('height', height + 'px');
        }
    }

    function removeBox(widget) {
        if (widget.element.$.firstChild && jQuery(widget.element.$.firstChild).hasClass('cke-oembed-resize-box')) {
            widget.element.$.removeChild(widget.element.$.firstChild);
        }
    }

    function adjustParentElement(widget, width, height, align) {
        if (align === 'center') {
            jQuery(widget.element.$).css('width', '');
        } else {
            jQuery(widget.element.$).css('width', width + 'px');
        }

        jQuery(widget.element.$).css('height', height + 'px');
    }


        CKEDITOR.plugins.add('oembed', {
            icons: 'oembed',
            hidpi: true,
            requires: 'widget,dialog',
            lang: 'de,en,fr,nl,pl,pt-br,ru,tr', // %REMOVE_LINE_CORE%
            version: 1.17,
        onLoad: function () {
            CKEDITOR.addCss(
                '.embeddedContent{' +
                    'position:relative' +

                    '}' +

            '.cke-oembed-resize-box{' +
                // This is to remove unwanted space so resize
                // wrapper is displayed property.
                'background:#999;' +
                'display:inline-block;' +
            '}');
        },
            init: function(editor) {
                // Load jquery?
                loadjQueryLibaries();

                CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
                    oEmbed: function(url, maxWidth, maxHeight, responsiveResize) {

                        if (url.length < 1 || url.indexOf('http') < 0) {
                            alert(editor.lang.oembed.invalidUrl);
                            return false;
                        }

                        function embed() {
                            if (maxWidth == null || maxWidth == 'undefined') {
                                maxWidth = null;
                            }

                            if (maxHeight == null || maxHeight == 'undefined') {
                                maxHeight = null;
                            }

                            if (responsiveResize == null || responsiveResize == 'undefined') {
                                responsiveResize = false;
                            }

                        embedCode(url, editor, false, maxWidth, maxHeight, responsiveResize, editor);
                        }

                        if (typeof(jQuery.fn.oembed) === 'undefined') {
                            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'), function() {
                                embed();
                            });
                        } else {
                            embed();
                        }

                        return true;
                    }
                });


            editor.widgets.add('oembed', {
                draggable: false,
                mask: true,
                dialog: 'oembed',
                allowedContent: {
                    div: {
                        styles: 'text-align,float',
                        attributes: '*',
                        classes: editor.config.oembed_WrapperClass != null ? editor.config.oembed_WrapperClass : "embeddedContent"
                    },
                    'div iframe': {
                        attributes: '*'
                    },
                        'div(embeddedContent,oembed-provider-*) iframe': {
                            attributes: '*'
                        },
                        'div(embeddedContent,oembed-provider-*) blockquote': {
                            attributes: '*'
                        },
                        'div(embeddedContent,oembed-provider-*) script': {
                            attributes: '*'
                        }

                },
                template:
                        '<div class="' + (editor.config.oembed_WrapperClass != null ? editor.config.oembed_WrapperClass : "embeddedContent") + '">' +
                            '</div>',
                    upcast: function(element) {
                        return element.name == 'div' && element.hasClass(editor.config.oembed_WrapperClass != null ? editor.config.oembed_WrapperClass : "embeddedContent");
                    },
                downcast: function (element) {
                    var innerSpan = element.getFirst('span');
                    if (innerSpan) {
                        innerSpan.remove();
                    }

                    //if (element.children) {
                    //    this.element.$.removeChild(this.element.$.lastChild);
                    //    jQuery(element.children).last().remove();
                    //}
                },
                init: function (e) {
                        var data = {
                            oembed: this.element.data('oembed') || '',
                            resizeType: this.element.data('resizeType') || 'noresize',
                            maxWidth: this.element.data('maxWidth') || 560,
                            maxHeight: this.element.data('maxHeight') || 315,
                            align: this.element.data('align') || 'none',
                            oembed_provider: this.element.data('oembed_provider') || ''
                    };

                        this.setData(data);
                        this.element.addClass('oembed-provider-' + data.oembed_provider);

                        this.on('dialog', function(evt) {
                            evt.data.widget = this;
                        }, this);

                    setupResizer(this, this.editor);
                    }
                });

                editor.ui.addButton('oembed', {
                    label: editor.lang.oembed.button,
                    command: 'oembed',
                    toolbar: 'insert,10'
                });

                var resizeTypeChanged = function() {
                    var dialog = this.getDialog(),
                        resizetype = this.getValue(),
                        maxSizeBox = dialog.getContentElement('general', 'maxSizeBox').getElement(),
                        sizeBox = dialog.getContentElement('general', 'sizeBox').getElement();

                    if (resizetype == 'noresize') {
                        maxSizeBox.hide();

                        sizeBox.hide();
                    } else if (resizetype == "custom") {
                        maxSizeBox.hide();

                        sizeBox.show();
                    } else {
                        maxSizeBox.show();

                        sizeBox.hide();
                    }

                };

                String.prototype.beginsWith = function(string) {
                    return (this.indexOf(string) === 0);
                };

                function loadjQueryLibaries() {
                    if (typeof(jQuery) === 'undefined') {
                        CKEDITOR.scriptLoader.load('https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js', function() {
                            jQuery.noConflict();
                            if (typeof(jQuery.fn.oembed) === 'undefined') {
                                CKEDITOR.scriptLoader.load(
                                    CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js')
                                );
                            }
                        });

                    } else if (typeof(jQuery.fn.oembed) === 'undefined') {
                        CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'));
                    }
                }                

                CKEDITOR.dialog.add('oembed', function(editor) {
                    return {
                        title: editor.lang.oembed.title,
                        minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 568 : 550,
                        minHeight: 155,
                        onShow: function() {
                            var data = {
                                oembed: this.widget.element.data('oembed') || '',
                                resizeType: this.widget.element.data('resizeType') || 'noresize',
                                maxWidth: this.widget.element.data('maxWidth'),
                                maxHeight: this.widget.element.data('maxHeight'),
                                align: this.widget.element.data('align') || 'none'
                            };

                            this.widget.setData(data);

                            this.getContentElement('general', 'resizeType').setValue(data.resizeType);

                            this.getContentElement('general', 'align').setValue(data.align);

                            var resizetype = this.getContentElement('general', 'resizeType').getValue(),
                                maxSizeBox = this.getContentElement('general', 'maxSizeBox').getElement(),
                                sizeBox = this.getContentElement('general', 'sizeBox').getElement();

                            if (resizetype == 'noresize') {
                                maxSizeBox.hide();
                                sizeBox.hide();
                            } else if (resizetype == "custom") {
                                maxSizeBox.hide();

                                sizeBox.show();
                            } else {
                                maxSizeBox.show();

                                sizeBox.hide();
                            }
                        },

                        onOk: function() {
                        },
                        contents: [
                            {
                                label: editor.lang.common.generalTab,
                                id: 'general',
                                elements: [
                                    {
                                        type: 'html',
                                        id: 'oembedHeader',
                                        html: '<div style="white-space:normal;width:500px;padding-bottom:10px">' + editor.lang.oembed.pasteUrl + '</div>'
                                    }, {
                                        type: 'text',
                                        id: 'embedCode',
                                        focus: function() {
                                            this.getElement().focus();
                                        },
                                        label: editor.lang.oembed.url,
                                        title: editor.lang.oembed.pasteUrl,
                                        setup: function(widget) {
                                            if (widget.data.oembed) {
                                                this.setValue(widget.data.oembed);
                                            }
                                        },
                                        commit: function(widget) {
                                            var dialog = CKEDITOR.dialog.getCurrent(),
                                                inputCode = dialog.getValueOf('general', 'embedCode').replace(/\s/g, ""),
                                                resizeType = dialog.getContentElement('general', 'resizeType').
                                                    getValue(),
                                                align = dialog.getContentElement('general', 'align').
                                                    getValue(),
                                                maxWidth = null,
                                                maxHeight = null,
                                                responsiveResize = false,
                                                editorInstance = dialog.getParentEditor();

                                            if (inputCode.length < 1 || inputCode.indexOf('http') < 0) {
                                                alert(editor.lang.oembed.invalidUrl);
                                                return false;
                                            }

                                            if (resizeType == "noresize") {
                                                responsiveResize = false;
                                                maxWidth = null;
                                                maxHeight = null;
                                            } else if (resizeType == "responsive") {
                                                maxWidth = dialog.getContentElement('general', 'maxWidth').
                                                    getInputElement().
                                                    getValue();
                                                maxHeight = dialog.getContentElement('general', 'maxHeight').
                                                    getInputElement().
                                                    getValue();

                                                responsiveResize = true;
                                            } else if (resizeType == "custom") {
                                                maxWidth = dialog.getContentElement('general', 'width').
                                                    getInputElement().
                                                    getValue();
                                                maxHeight = dialog.getContentElement('general', 'height').
                                                    getInputElement().
                                                    getValue();

                                                responsiveResize = false;
                                            }

                                embedCode(inputCode, editorInstance, maxWidth, maxHeight, responsiveResize, resizeType, align, widget, editor);

                                            widget.setData('oembed', inputCode);
                                            widget.setData('resizeType', resizeType);
                                            widget.setData('align', align);
                                            widget.setData('maxWidth', maxWidth);
                                            widget.setData('maxHeight', maxHeight);
                                        }
                                    }, {
                                        type: 'hbox',
                                        widths: ['50%', '50%'],
                                        children: [
                                            {
                                                id: 'resizeType',
                                                type: 'select',
                                                label: editor.lang.oembed.resizeType,
                                                'default': 'noresize',
                                                setup: function(widget) {
                                                    if (widget.data.resizeType) {
                                                        this.setValue(widget.data.resizeType);
                                                    }
                                                },
                                                items: [
                                                    [editor.lang.oembed.noresize, 'noresize'],
                                                    [editor.lang.oembed.responsive, 'responsive'],
                                                    [editor.lang.oembed.custom, 'custom']
                                                ],
                                                onChange: resizeTypeChanged
                                            }, {
                                                type: 'hbox',
                                                id: 'maxSizeBox',
                                                widths: ['120px', '120px'],
                                                style: 'float:left;position:absolute;left:58%;width:200px',
                                                children: [
                                                    {
                                                        type: 'text',
                                                        width: '100px',
                                                        id: 'maxWidth',
                                                        'default': editor.config.oembed_maxWidth != null ? editor.config.oembed_maxWidth : '560',
                                                        label: editor.lang.oembed.maxWidth,
                                                        title: editor.lang.oembed.maxWidthTitle,
                                                        setup: function(widget) {
                                                            if (widget.data.maxWidth) {
                                                                this.setValue(widget.data.maxWidth);
                                                            }
                                                        }
                                                    }, {
                                                        type: 'text',
                                                        id: 'maxHeight',
                                                        width: '120px',
                                                        'default': editor.config.oembed_maxHeight != null ? editor.config.oembed_maxHeight : '315',
                                                        label: editor.lang.oembed.maxHeight,
                                                        title: editor.lang.oembed.maxHeightTitle,
                                                        setup: function(widget) {
                                                            if (widget.data.maxHeight) {
                                                                this.setValue(widget.data.maxHeight);
                                                            }
                                                        }
                                                    }
                                                ]
                                            }, {
                                                type: 'hbox',
                                                id: 'sizeBox',
                                                widths: ['120px', '120px'],
                                                style: 'float:left;position:absolute;left:58%;width:200px',
                                                children: [
                                                    {
                                                        type: 'text',
                                                        id: 'width',
                                                        width: '100px',
                                                        'default': editor.config.oembed_maxWidth != null ? editor.config.oembed_maxWidth : '560',
                                                        label: editor.lang.oembed.width,
                                                        title: editor.lang.oembed.widthTitle,
                                                        setup: function(widget) {
                                                            if (widget.data.maxWidth) {
                                                                this.setValue(widget.data.maxWidth);
                                                            }
                                                        }
                                                    }, {
                                                        type: 'text',
                                                        id: 'height',
                                                        width: '120px',
                                                        'default': editor.config.oembed_maxHeight != null ? editor.config.oembed_maxHeight : '315',
                                                        label: editor.lang.oembed.height,
                                                        title: editor.lang.oembed.heightTitle,
                                                        setup: function(widget) {
                                                            if (widget.data.maxHeight) {
                                                                this.setValue(widget.data.maxHeight);
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }, {
                                        type: 'hbox',
                                        id: 'alignment',
                                        children: [
                                            {
                                                id: 'align',
                                                type: 'radio',
                                                items: [
                                                    [editor.lang.oembed.none, 'none'],
                                                    [editor.lang.common.alignLeft, 'left'],
                                                    [editor.lang.common.alignCenter, 'center'],
                                                    [editor.lang.common.alignRight, 'right']
                                                ],
                                                label: editor.lang.common.align,
                                                setup: function(widget) {
                                                    this.setValue(widget.data.align);
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                });
            }
        });
    }
)();
