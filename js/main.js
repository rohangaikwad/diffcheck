require.config({ paths: { 'vs': 'js/monaco-editor-package/min/vs' } });

var orgEditor, newEditor, diffEditor;

require(['vs/editor/editor.main'], function () {
    orgEditor = monaco.editor.create(document.querySelector('.editor.org'), {
        value: 'abc', wordWrap: true, language: 'plaintext'
    });
    newEditor = monaco.editor.create(document.querySelector('.editor.new'), {
        value: 'xyz', wordWrap: true, language: 'plaintext'
    });

    diffEditor = monaco.editor.createDiffEditor(document.querySelector('.editor.dc'));

});

document.querySelector('.src.s1 button').addEventListener('click', () => {
    let url1 = document.getElementById('url1');
    console.log(url1.value)
    if (url1.value.length > 0) {
        
        fetch(url1)
            .then(res => res.text())
            .then(res => {
                orgEditor.getModel().setValue(res);
            })
            .catch(err => {
                console.error(err);
                alert(err);
            })
    }
});

document.querySelector('.src.s2 button').addEventListener('click', () => {
    console.log('url 1')
    let url2 = document.getElementById('url2');
    if (url2.value.length > 0) {
        
        fetch(url2)
            .then(res => res.text())
            .then(res => {
                newEditor.getModel().setValue(res);
            })
            .catch(err => {
                console.error(err);
                alert(err);
            })
    }
});

document.querySelector('#compare').addEventListener('click', () => {
    diffEditor.setModel({
        original: monaco.editor.createModel(orgEditor.getValue(), "text/plain"),
        modified: monaco.editor.createModel(newEditor.getValue(), "text/plain")
    });
    document.querySelector('#lr2').click();
    document.querySelector('.diff-review-actions .close-diff-review').click();
});

window.addEventListener('resize', () => {
    orgEditor !== null && orgEditor.layout();
    newEditor !== null && newEditor.layout();
    diffEditor !== null && diffEditor.layout();
});

let loadFromFile = (file, editor) => {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            editor.setValue(evt.target.result);
        }
    }
}

document.getElementById("fOrg").addEventListener('change', (e) => {
    console.log(e);
    var file = document.getElementById("fOrg").files[0];
    loadFromFile(file, orgEditor);
});

document.getElementById("fNew").addEventListener('change', (e) => {
    console.log(e)
    var file = document.getElementById("fNew").files[0];
    loadFromFile(file, newEditor);
});

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('serviceWorker.js');
    console.log("diffchecker service worker registered");
}