import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
let root, instance;
const load = async file => { const full = path.resolve(file); if (fs.existsSync(full)) await import(/* @vite-ignore */ full); };
beforeEach(async () => {
  vi.resetModules(); delete window.Oficina; document.body.innerHTML = '<div id="app"></div>';
  history.replaceState(null, '', '/'); root = document.querySelector('#app');
  await load('app/navigation.js'); await load('app/presentation.js');
  await load('features/history-model.js'); await load('features/history-view.js');
});
afterEach(() => instance?.destroy());
const mount = () => { expect(window.Oficina.mountHistory).toBeTypeOf('function'); instance = window.Oficina.mountHistory(root); };
const click = action => root.querySelector(`[data-history-action="${action}"]`).click();
const toConflict = () => { for(let i=0;i<4;i++) click('advance'); };
it('renders accessible graph, textual parents, conflict editing and completed merge', () => {
  mount(); expect(root.querySelector('svg[role="img"]')).not.toBeNull();
  expect(root.textContent).toContain('HEAD → main'); toConflict();
  const editor = root.querySelector('textarea');
  expect(editor.labels.length).toBe(1); expect(editor.value).toContain('<<<<<<< main');
  expect(root.querySelector('[data-history-action="completeMerge"]').disabled).toBe(true);
  editor.value = '<img src=x onerror=alert(1)>'; editor.dispatchEvent(new Event('input', {bubbles:true}));
  expect(document.activeElement).not.toBeNull(); click('completeMerge');
  expect(root.textContent).toContain('pais: c3, c2'); expect(root.querySelector('img')).toBeNull();
  expect(root.textContent).toContain('aluno → c2'); click('reset');
  expect(root.querySelector('textarea')).toBeNull(); expect(root.textContent).toContain('c1');
});
it('registered widget leaves editor keystrokes with the presentation on the same slide', () => {
  instance = window.Oficina.mountPresentation(root, [
    {id:'inicio',title:'Branches',blocks:[{type:'widget',widget:'history'}]},
    {id:'fim',title:'Fim',blocks:[]}
  ]);
  expect(root.querySelector('[data-history-action="advance"]')).not.toBeNull(); toConflict();
  const editor = root.querySelector('textarea'); editor.focus();
  editor.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  expect(root.querySelector('h1').textContent).toBe('Branches');
  expect(document.activeElement).toBe(editor);
});
it('destroy removes controls and their listeners', () => {
  mount(); const button = root.querySelector('button'); instance.destroy(); button.click(); expect(root.childNodes).toHaveLength(0);
});

