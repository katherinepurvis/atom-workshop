import React from 'react';
import Scribe from 'scribe';
import scribeKeyboardShortcutsPlugin from 'scribe-plugin-keyboard-shortcuts';
import scribePluginToolbar from 'scribe-plugin-toolbar';
import scribePluginLinkPromptCommand from 'scribe-plugin-link-prompt-command';
import scribePluginNoting from 'scribe-plugin-noting';
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

    var noteElConfig = {
        'class': true,
        'title': true,
        'data-note-edited-by': true,
        'data-note-edited-date': true,
        'data-note-id': true,
        'data-click-action': true
    };

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
        li: {},
        "gu-note": noteElConfig,
        "gu-flag": noteElConfig,
        "gu-correct": noteElConfig
      }
    }));

    // @TODO - Add first and last names to config
    const userName = "User Name";

    const notingConfig = {
        user: userName,
        scribeInstanceSelector: this.props.editorClassName,
        selectors: [
            { commandName: 'note',    tagName: 'gu-note',    clickAction: 'collapse',   keyCodes: [119, 121] }
        ]
    };

    notingConfig.selectors = [
        { commandName: 'note',    tagName: 'gu-note',    clickAction: 'collapse',   keyCodes: [119, 121] },
        { commandName: 'flag',    tagName: 'gu-flag',    clickAction: 'toggle-tag', toggleTagTo: 'gu-correct', keyCodes: [117] },
        { commandName: 'correct', tagName: 'gu-correct', clickAction: 'toggle-tag', toggleTagTo: 'gu-flag', keyCodes: [118] }
    ];
    this.scribe.use(scribePluginNoting(notingConfig));

  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.refs.editor.innerHTML;
  }

  onContentChange() {
    const newContent = this.refs.editor.innerHTML;

    if (newContent !== this.props.value) {
      this.props.onChange(newContent);
    }
  }

  render () {
    return (
        <div className={this.props.className}>
          <div ref="toolbar" className={this.props.toolbarClassName}>
            <div data-command-name="bold" className={this.props.toolbarItemClassName}>Bold</div>
            <div data-command-name="italic" className={this.props.toolbarItemClassName}>Italic</div>
            <div data-command-name="linkPrompt" className={this.props.toolbarItemClassName}>Link</div>
            <div data-command-name="unlink" className={this.props.toolbarItemClassName}>Unlink</div>
            <div data-command-name="note" className={this.props.toolbarItemClassName}>Note</div>
            <div data-command-name="flag" className={this.props.toolbarItemClassName}>Flag</div>
            <div data-command-name="correct" className={this.props.toolbarItemClassName}>Correct</div>
          </div>
          <div className={this.props.editorClassName} dangerouslySetInnerHTML={{__html: this.props.value}} ref="editor"></div>
        </div>
    );
  }
}
