'use strict';

( function() {
	CKEDITOR.plugins.add( 'pandadoc', {
		requires: 'widget',
		icons: 'pandadoc',
		hidpi: true,

		onLoad: function() {
			// Register styles for placeholder widget frame.
			CKEDITOR.addCss( '.cke_pandadoc_widget{background-color:#ff0} .pd-widget br {display:none;}' );
      CKEDITOR.dtd.$editable.span = 1;
      //CKEDITOR.dtd.$editable.input = 1;
		},

		init: function( editor ) {

			// Put ur init code here.
			editor.widgets.add( 'pandadoc', {
				// Widget code.
				template: '<span style="padding: 3px; display:inline-block;" class="cke_pandadoc_widget"><span class="pd-widget">adasdasd</span></span>',

        inline: true,

        editables: {
          content: '.pd-widget'
        },

        init: function() {
          this.on('ready', function() {
            var el = this.element.$;
            $(el).resizable({
              resize: function(ev, ui) {
                //ui.element.width(ui.widget);
              }
            });
            $(el).keypress(function(e) {
              var code = e.keyCode || e.which;
              console.log('event '+ code);
              return code != 13;
            });
          })
        }
			});

			editor.ui.addButton && editor.ui.addButton( 'CreatePandadocWidget', {
				label: 'CreatePandadocWidget',
				command: 'pandadoc',
				toolbar: 'insert,5',
				icon: 'pandadoc'
			} );
		},

		afterInit: function( editor ) {
//			var placeholderReplaceRegex = /\[\[([^\[\]])+\]\]/g;
//
//			editor.dataProcessor.dataFilter.addRules( {
//				text: function( text, node ) {
//					var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];
//
//					// Skip the case when placeholder is in elements like <title> or <textarea>
//					// but upcast placeholder in custom elements (no DTD).
//					if ( dtd && !dtd.span )
//						return;
//
//					return text.replace( placeholderReplaceRegex, function( match ) {
//						// Creating widget code.
//						var widgetWrapper = null,
//							innerElement = new CKEDITOR.htmlParser.element( 'span', {
//								'class': 'cke_placeholder'
//							} );
//
//						// Adds placeholder identifier as innertext.
//						innerElement.add( new CKEDITOR.htmlParser.text( match ) );
//						widgetWrapper = editor.widgets.wrapElement( innerElement, 'placeholder' );
//
//						// Return outerhtml of widget wrapper so it will be placed
//						// as replacement.
//						return widgetWrapper.getOuterHtml();
//					} );
//				}
//			} );
		}
	} );

} )();
