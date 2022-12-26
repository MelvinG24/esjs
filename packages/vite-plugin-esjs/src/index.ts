import * as babel from '@babel/core'
import { splitCodeImports } from '@es-js/core'
import BabelPluginEsJS from '@es-js/babel-plugin-esjs'
import type { Plugin } from 'vite'

export default function EsJS(options = {}): Plugin {
  return {
    name: 'vite-plugin-esjs',
    enforce: 'pre',
    transform(raw: string, id: string) {
      if (!/\.esjs$/.test(id))
        return

      const result = babel.transformSync(raw, {
        babelrc: false,
        ast: true,
        plugins: [
          BabelPluginEsJS(),
        ],
        sourceFileName: id,
        configFile: false,
      })

      if (!result)
        throw new Error('Cant transpile')

      const scriptTranspiled = splitCodeImports(String(result.code))

      return `
<script>
import { usarTerminal } from "@es-js/terminal";
${scriptTranspiled.imports}

const Terminal = usarTerminal();

${scriptTranspiled.codeWithoutImports}
</script>
`
    },
  }
}
