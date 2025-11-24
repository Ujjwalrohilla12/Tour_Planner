def Settings(**kwargs):
    return {
        'ls': {
            'typescript': {
                'cmd': ['typescript-language-server', '--stdio'],
                'filetypes': ['typescript', 'typescriptreact', 'javascript', 'javascriptreact']
            }
        }
    }