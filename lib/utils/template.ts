import { Editor } from '@tiptap/core'
import { Selection } from '@tiptap/pm/state'

export class TemplateParser {
  editor: Editor
  selection: Selection
  errors = false

  constructor(editor: Editor, selection: Selection) {
    this.editor = editor
    this.selection = selection
  }

  parseTemplate(template: string) {
    let parsed = template
    const variables = {
      SELECTED_TEXT: this.getSelectedText.bind(this),
    }

    Object.entries(variables).forEach(([variable, getter]) => {
      const value = getter()
      const variableRegex = new RegExp(`{{\\s*${variable}\\s*}}`)

      if (variable === 'SELECTED_TEXT' && !value) {
        console.error('Please select text.')
        this.errors = true
        return
      }

      parsed = parsed.replace(variableRegex, value)
    })

    return parsed
  }

  getSelectedText() {
    return this.editor.state.doc.textBetween(
      this.selection.from,
      this.selection.to,
    )
  }
}
