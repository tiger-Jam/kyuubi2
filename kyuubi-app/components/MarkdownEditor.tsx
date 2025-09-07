'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState<string>(`# Welcome to Kyuubi Editor! 🚀

## Markdown基本機能テスト

### 見出し
普通のテキスト

**太字** と *斜体* と ~~打ち消し線~~

### リスト
- 項目1
- 項目2
  - ネストした項目

### 番号付きリスト
1. 最初
2. 次
3. その次

### リンクと画像
[リンクテキスト](https://example.com)

### コードブロック
\`\`\`javascript
function hello() {
  console.log("Hello, Kyuubi!");
}
\`\`\`

### 引用
> これは引用です

### テーブル
| カラム1 | カラム2 |
|---------|---------|
| データ1 | データ2 |

### タスクリスト
- [x] 完了したタスク
- [ ] 未完了のタスク

### 数式
インライン数式: $E = mc^2$

ブロック数式:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### Obsidian記法（プレビュー用）
内部リンク: [[ページ名]]
タグ: #タグ名
埋め込み: ![[画像.png]]
`);

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const startState = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        highlightSelectionMatches(),
        markdown(),
        autocompletion(),
        EditorView.lineWrapping,
        keymap.of([
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...completionKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            setContent(newContent);
            // ローカルストレージに自動保存
            localStorage.setItem('kyuubi-content', newContent);
          }
        }),
        ...(isDarkMode ? [oneDark] : []),
        EditorView.theme({
          '&': {
            fontSize: '14px',
            height: '100%',
          },
          '.cm-content': {
            padding: '12px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          },
          '.cm-focused .cm-cursor': {
            borderLeftColor: '#0ea5e9',
          },
          '.cm-line': {
            padding: '0 2px 0 4px',
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // ローカルストレージから読み込み
    const saved = localStorage.getItem('kyuubi-content');
    if (saved) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: saved },
      });
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [isDarkMode]);

  // Obsidian記法を処理する関数
  const processObsidianSyntax = (text: string): string => {
    // 内部リンク [[page]] を処理
    text = text.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
      const parts = p1.split('|');
      const displayText = parts[1] || parts[0];
      return `[${displayText}](#${parts[0].toLowerCase().replace(/\s+/g, '-')})`;
    });
    
    // タグ #tag を処理
    text = text.replace(/(^|\s)#([a-zA-Z0-9_\u4e00-\u9fa5]+)/g, '$1<span class="tag">#$2</span>');
    
    // 埋め込み ![[file]] を処理
    text = text.replace(/!\[\[([^\]]+)\]\]/g, '![Embedded: $1](#)');
    
    return text;
  };

  const processedContent = processObsidianSyntax(content);

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* ツールバー */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-2 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Kyuubi Editor
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const blob = new Blob([content], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'document.md';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className={`px-3 py-1 rounded text-sm ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Export .md
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1 rounded text-sm ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* エディタとプレビュー */}
      <div className="flex-1 flex overflow-hidden">
        {/* エディタ */}
        <div className={`w-1/2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-r overflow-auto`}>
          <div ref={editorRef} className="h-full" />
        </div>

        {/* プレビュー */}
        <div className={`w-1/2 overflow-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                span: ({ children, ...props }) => {
                  if ((props as any).className === 'tag') {
                    return (
                      <span className="inline-block px-2 py-1 mx-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {children}
                      </span>
                    );
                  }
                  return <span {...props}>{children}</span>;
                },
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}