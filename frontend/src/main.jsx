import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import './styles.css';

const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
  : null;

const lessons = [
  ['Terminal fundamentals', 'Meet the terminal, shell, prompt, commands, arguments, options, and paths.'],
  ['Directory navigation', 'Move confidently with pwd, ls, cd, ., .., ~, history, and completion.'],
  ['File management', 'Create, copy, move, remove, and organize files without losing your work.'],
  ['Reading and writing', 'Inspect files with cat, less, head, tail, echo, nano, and vim basics.'],
  ['Searching and text', 'Find needles in haystacks with grep, find, sort, uniq, wc, sed, and awk.'],
  ['Shell operators', 'Chain commands using pipes, redirects, quoting, substitution, and conditions.'],
  ['Permissions', 'Understand rwx, chmod, users, groups, sudo, chown, and safe access.'],
  ['Processes', 'Inspect and control running work with ps, top, jobs, bg, fg, and signals.'],
  ['Shell configuration', 'Shape your environment with variables, PATH, aliases, and startup files.'],
  ['Packages and systems', 'Learn package managers, disk usage, system identity, and resources.'],
  ['Networking', 'Understand DNS, hosts, ports, curl, ping, ssh, scp, and connections.'],
  ['Shell scripting', 'Write scripts with variables, input, conditions, loops, functions, and errors.'],
  ['Advanced shell', 'Explore expansions, file descriptors, subshells, traps, heredocs, xargs, and tee.'],
  ['Terminal productivity', 'Use shortcuts, reverse history, tmux, plugins, and custom prompts.'],
  ['System command line', 'Read logs, understand the filesystem, links, mounts, services, and cron.'],
  ['Windows command line', 'Map Bash ideas to CMD and PowerShell commands and scripts.'],
];

const initialLines = [
  { type: 'system', text: 'TERMINAL LAB // SAFE SIMULATION' },
  { type: 'system', text: 'Type "help" to see available commands.' },
];

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/home');
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('terminal-lab-progress') || '[]'));
  const [lines, setLines] = useState(initialLines);
  const [command, setCommand] = useState('');
  const [notice, setNotice] = useState('');
  const hydrated = useRef(false);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const userId = useMemo(() => {
    const existing = localStorage.getItem('terminal-lab-user-id');
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem('terminal-lab-user-id', created);
    return created;
  }, []);

  useEffect(() => {
    const change = () => setRoute(window.location.hash || '#/home');
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);

  useEffect(() => {
    localStorage.setItem('terminal-lab-progress', JSON.stringify(completed));
    if (supabase && hydrated.current) {
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) return;
        supabase.from('progress').upsert({ user_id: data.user.id, completed, updated_at: new Date().toISOString() }).then(({ error }) => {
          if (error) setNotice('Cloud save unavailable. Your local progress is still safe.');
        });
      });
      return;
    }
    if (hydrated.current) {
      fetch(`${apiUrl}/progress/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      }).catch(() => setNotice('Cloud save unavailable. Your local progress is still safe.'));
    }
  }, [apiUrl, completed, userId]);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        const user = data.session?.user;
        if (!user) {
          hydrated.current = true;
          return;
        }
        supabase.from('progress').select('completed').eq('user_id', user.id).maybeSingle().then(({ data: remote }) => {
          if (Array.isArray(remote?.completed)) setCompleted(remote.completed);
          hydrated.current = true;
        });
      });
      return;
    }
    fetch(`${apiUrl}/progress/${userId}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Progress API unavailable')))
      .then((remote) => {
        if (Array.isArray(remote.completed) && remote.completed.length > completed.length) {
          setCompleted(remote.completed);
        }
      })
      .catch(() => {})
      .finally(() => { hydrated.current = true; });
  }, [apiUrl, userId]);

  const active = route.split('/')[1] || 'home';
  const lessonIndex = Number(route.split('/')[2]);
  const xp = completed.length * 100;
  const level = Math.floor(xp / 300) + 1;
  const currentLesson = Number.isInteger(lessonIndex) ? lessons[lessonIndex] : null;

  const runCommand = (event) => {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;
    const [name, ...args] = value.split(/\s+/);
    let output = '';
    if (name === 'help') output = 'help  pwd  ls  cd  cat  echo  clear  history  whoami  date';
    else if (name === 'pwd') output = '/home/learner';
    else if (name === 'ls') output = 'docs  logs  notes.txt';
    else if (name === 'whoami') output = 'learner';
    else if (name === 'date') output = new Date().toString();
    else if (name === 'echo') output = args.join(' ');
    else if (name === 'clear') {
      setLines([]);
      setCommand('');
      return;
    } else if (name === 'history') output = lines.filter((line) => line.type === 'command').map((line) => line.text).join('\n') || 'No commands yet.';
    else output = `bash: ${name}: simulated command not found`;
    setLines((current) => [...current, { type: 'command', text: `learner@lab:~$ ${value}` }, { type: 'output', text: output }]);
    setCommand('');
  };

  const markComplete = (index) => {
    if (index > 0 && !completed.includes(index - 1)) {
      setNotice('Finish the previous mission first.');
      return;
    }
    setCompleted((current) => [...new Set([...current, index])]);
    setNotice('Mission complete. New sector unlocked.');
  };

  const signIn = async () => {
    if (!supabase) {
      setNotice('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Google login.');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setNotice(error.message);
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setNotice('Signed out. Local progress is still available on this device.');
  };

  const page = useMemo(() => {
    if (active === 'learn' && currentLesson) {
      const unlocked = lessonIndex === 0 || completed.includes(lessonIndex - 1);
      return (
        <section>
          <button className="back" onClick={() => { window.location.hash = '#/learn'; }}>← all missions</button>
          <div className="eyebrow">MISSION {String(lessonIndex + 1).padStart(2, '0')} / {lessons.length}</div>
          <h2>{currentLesson[0]}</h2>
          <p className="lead">{currentLesson[1]}</p>
          {!unlocked ? <div className="panel warning">🔒 Complete the previous mission to unlock this sector.</div> : (
            <>
              <div className="panel lesson-copy"><strong>Objective</strong><p>Understand the idea, run the commands, then verify what changed. This is a safe simulation: your real computer is never touched.</p><pre>$ pwd{'\n'}$ ls{'\n'}$ help</pre></div>
              <div className="panel"><div className="panel-title">COMMAND DECK</div><Terminal lines={lines} command={command} setCommand={setCommand} runCommand={runCommand} /></div>
              <button className="primary" onClick={() => markComplete(lessonIndex)}>✓ Mark mission complete</button>
              {notice && <p className="notice">{notice}</p>}
            </>
          )}
        </section>
      );
    }
    if (active === 'learn') return <Learn completed={completed} />;
    if (active === 'play') return <section><div className="eyebrow">FREE ROAM</div><h2>Playground</h2><p className="lead">No objectives. Just you and the prompt.</p><div className="panel"><Terminal lines={lines} command={command} setCommand={setCommand} runCommand={runCommand} /></div></section>;
    if (active === 'progress') return <Progress completed={completed} level={level} xp={xp} signIn={signIn} notice={notice} />;
    return <Home completed={completed} level={level} xp={xp} />;
  }, [active, completed, command, currentLesson, lessonIndex, level, lines, notice, xp]);

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#/home"><span className="brand-mark">›_</span><span>TERMINAL<br /><b>LAB</b></span></a>
      <div className="status"><span className="dot" /> SIMULATION ONLINE</div>
      <nav><a className={active === 'home' ? 'active' : ''} href="#/home">⌂ Home</a><a className={active === 'learn' ? 'active' : ''} href="#/learn">▸ Mission map</a><a className={active === 'play' ? 'active' : ''} href="#/play">⚡ Playground</a><a className={active === 'progress' ? 'active' : ''} href="#/progress">★ Progress</a></nav>
      <div className="sidebar-footer">SAFE MODE<br /><span>Nothing executes on your machine.</span></div>
    </aside>
    <main>
      <header className="topbar">
        <span className="topbar-context">TERMINAL LAB / {active.toUpperCase()}</span>
        <div className="topbar-actions"><button className="login-button" onClick={signIn}>{supabase ? 'Sign in with Google' : 'Connect Google'}</button>{notice && <span className="topbar-notice">{notice}</span>}</div>
      </header>
      {page}
    </main>
  </div>;
}

function Terminal({ lines, command, setCommand, runCommand }) {
  return <div className="terminal"><div className="terminal-bar"><i /><i /><i /><span>learner@terminal-lab</span></div><div className="terminal-output">{lines.map((line, index) => <div key={`${line.text}-${index}`} className={line.type}>{line.text}</div>)}</div><form className="terminal-input" onSubmit={runCommand}><span>learner@lab:~$</span><input autoFocus value={command} onChange={(event) => setCommand(event.target.value)} aria-label="Terminal command" /></form></div>;
}

function Home({ completed, level, xp }) {
  return <><div className="eyebrow">WELCOME, LEARNER</div><h1>Learn the command line<br /><em>by doing.</em></h1><p className="lead">A safe terminal playground with a clear path from your first command to confident shell work.</p><div className="hero-actions"><a className="primary" href={`#/learn/${completed.length < lessons.length ? completed.length : 0}`}>{completed.length ? 'Continue mission →' : 'Start your first mission →'}</a><a className="secondary" href="#/play">Open playground</a></div><div className="stats"><div><strong>LVL {level}</strong><span>{xp} XP earned</span></div><div><strong>{completed.length}/{lessons.length}</strong><span>missions cleared</span></div><div><strong>SAFE</strong><span>browser simulation</span></div></div><div className="callout"><span>i</span><div><strong>Practice without consequences.</strong><p>The shell is simulated in your browser. Try <code>rm</code>, pipes, and permissions without touching your real files.</p></div></div></>;
}

function Learn({ completed }) {
  return <section><div className="eyebrow">THE CAMPAIGN</div><h2>Mission map</h2><p className="lead">Clear each sector in order. New missions unlock as you prove the last one.</p><div className="mission-list">{lessons.map((lesson, index) => { const unlocked = index === 0 || completed.includes(index - 1); const done = completed.includes(index); return <a className={`mission ${unlocked ? '' : 'locked'}`} href={unlocked ? `#/learn/${index}` : undefined} key={lesson[0]}><span className="mission-number">{done ? '✓' : unlocked ? String(index + 1).padStart(2, '0') : '🔒'}</span><span><b>{lesson[0]}</b><small>{lesson[1]}</small></span><span className="mission-arrow">{done ? 'CLEARED' : unlocked ? 'ENTER →' : 'LOCKED'}</span></a>; })}</div></section>;
}

function Progress({ completed, level, xp, signIn, notice }) {
  return <section><div className="eyebrow">PLAYER PROFILE</div><h2>Your progress</h2><div className="profile-card"><div className="avatar">⌘</div><div><strong>learner</strong><p>Level {level} shell explorer</p></div><div className="profile-xp"><b>{xp} XP</b><span>Next level: {300 - (xp % 300)} XP</span></div></div><div className="stats"><div><strong>{completed.length}</strong><span>missions cleared</span></div><div><strong>{lessons.length - completed.length}</strong><span>sectors remaining</span></div><div><strong>★</strong><span>badges earned</span></div></div><div className="panel"><strong>Cloud sync</strong><p>Sign in with Google to keep your missions synced across devices. Without Supabase configuration, local progress still works.</p><button className="secondary" onClick={signIn}>Sign in with Google</button>{notice && <p className="notice">{notice}</p>}</div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
