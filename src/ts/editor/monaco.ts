import { editor as monacoEditor, MarkerSeverity } from 'monaco-editor'
import 'ts/editor/monaco-glsl'
import { ShaderError } from 'ts/model/shader-model'

const OWNER_ID = 'mother-fucker'

let model: monacoEditor.ITextModel
let editor: monacoEditor.IStandaloneCodeEditor

export const init = (
  el: HTMLDivElement,
  code: string,
  onChange: (text: string) => void
): (() => void) => {
  model = monacoEditor.createModel(code, 'glsl')

  model.onDidChangeContent((...args) => {
    const text = model.getValue()
    onChange(text)
  })

  editor = monacoEditor.create(el, {
    model: model,
    language: 'glsl',
    theme: 'shadercityTheme',
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
    bracketPairColorization: { enabled: true },
    smoothScrolling: true,
    mouseWheelZoom: true,
    scrollBeyondLastLine: false,
    padding: {
      top: 10,
      bottom: 10,
    },
    folding: false, // TODO ::: fix
  })

  return (): void => {
    console.log('destrouyed')
    editor.dispose()
  }
}

export const setEditorCode = (value: string): void => {
  // This is stupid hack
  if (value === model.getValue()) return
  model.setValue(value)
}

export const setErrors = (errors: ShaderError[]): void => {
  if (!errors || !errors.length) {
    monacoEditor.setModelMarkers(model, OWNER_ID, [])
    return
  }

  monacoEditor.setModelMarkers(
    model,
    OWNER_ID,
    errors
      .filter((err) => {
        return err.line < model.getLineCount()
      })
      .map((err) => {
        return {
          severity: MarkerSeverity.Error,
          startLineNumber: err.line,
          startColumn: 1,
          endLineNumber: err.line,
          endColumn: model.getLineMaxColumn(err.line),
          message: err.text,
        }
      })
  )
}

const ele = document.querySelector('.ssibal')

const cWid: monacoEditor.IContentWidget = {
  getId: () => {
    return 'shit'
  },
  getDomNode: () => {
    return ele as HTMLElement
  },
  getPosition: () => {
    return {
      position: { lineNumber: 10, column: 0 },
      preference: [
        monacoEditor.ContentWidgetPositionPreference.BELOW,
        monacoEditor.ContentWidgetPositionPreference.ABOVE,
        monacoEditor.ContentWidgetPositionPreference.EXACT,
      ],
    }
  },
}

// window.setTimeout(() => {
//   // monaco.editor.setModelMarkers(model, OWNER_ID, [
//   //   {
//   //     severity: monaco.MarkerSeverity.Error,
//   //     startLineNumber: 3,
//   //     startColumn: 1,
//   //     endLineNumber: 3,
//   //     endColumn: 4 + 1,
//   //     message: 'Syntax error\n',
//   //   },
//   // ])
//   // editor.addContentWidget(cWid)
//   // editor.setBanner(ele, 16)
// }, 2000)

const COLOR = `#1f2730`

monacoEditor.defineTheme('shadercityTheme', {
  colors: { 'editor.background': COLOR },
  base: 'vs-dark',
  inherit: true,
  rules: [],
})

// monaco.languages.register(lang)

// editor.onMouseMove(function (e: monaco.editor.IEditorMouseEvent) {
//   console.log('onmousemove', e.target.element.innerText)
// })

// const provideHover: monaco.languages.HoverProvider = {
//   provideHover: function (model, position) {
//     const w = model.getWordAtPosition(position)
//     console.log('getWordAtPosition', w)
//   },
// }

// languages.registerHoverProvider('glsl', provideHover)
