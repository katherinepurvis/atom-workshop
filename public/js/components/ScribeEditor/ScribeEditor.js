import React from 'react';
import Scribe from 'scribe';
import scribeKeyboardShortcutsPlugin from 'scribe-plugin-keyboard-shortcuts';
import scribePluginToolbar from 'scribe-plugin-toolbar';
import scribePluginLinkPromptCommand from 'scribe-plugin-link-prompt-command';
import scribePluginSanitizer from 'scribe-plugin-sanitizer';

export default class ScribeEditor extends React.Component {

  componentDidMount() {
    if (!this.props.disabled) {
      // Create an instance of Scribe
      this.scribe = new Scribe(this.refs.editor);

      this.configureScribe();

      this.scribe.on('content-changed', this.onContentChange);
    }
  }

  componentWillUnmount() {
    if (!this.props.disabled) {
    }
  }

  configureScribe() {
    // Create an instance of the Scribe toolbar
    this.scribe.use(scribePluginToolbar(this.refs.toolbar));

    // Configure Scribe plugins
    this.scribe.use(scribePluginLinkPromptCommand());
    this.scribe.use(scribeKeyboardShortcutsPlugin({
        bold: function (event) { return event.metaKey && event.keyCode === 66; }, // b
        italic: function (event) { return event.metaKey && event.keyCode === 73; }, // i
        linkPrompt: function (event) { return event.metaKey && !event.shiftKey && event.keyCode === 75; }, // k
        unlink: function (event) { return event.metaKey && event.shiftKey && event.keyCode === 75; } // shft + k
    }));

    this.scribe.use(scribePluginSanitizer({
      tags: {
        p: {},
        i: {},
        b: {},
        a: {
          href: true
        },
        ul: {},
        ol: {},
        li: {}
      }
    }));

  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.refs.editor.innerHTML;
  }

  onContentChange = () => {
    const newContent = this.refs.editor.innerHTML;

    if (newContent !== this.props.value) {
      this.props.onChange(newContent);
    }
  }

  render () {
    return (
        <div className={this.props.className}>
          <div ref="toolbar" className={this.props.toolbarClassName}>
            <button type="button" data-command-name="bold" className={this.props.toolbarItemClassName}>Bold</button>
            <button type="button" data-command-name="italic" className={this.props.toolbarItemClassName}>Italic</button>
            <button type="button" data-command-name="linkPrompt" className={this.props.toolbarItemClassName}>Link</button>
            <button type="button" data-command-name="unlink" className={this.props.toolbarItemClassName}>Unlink</button>
          </div>
          <div className={this.props.editorClassName} dangerouslySetInnerHTML={{__html: this.props.value}} ref="editor"></div>
        </div>
    );
  }
}
