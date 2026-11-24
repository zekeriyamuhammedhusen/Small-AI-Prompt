import { useState, useRef } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import './App.css'

marked.use({ gfm: true })

function App() {
  const [serverData, setServerData] = useState('')
  const [userPrompt, setUserPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  async function handleSubmit() {
    if (!userPrompt.trim() || loading) return
    setServerData('')
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setServerData(DOMPurify.sanitize(marked.parse(data.answer)))
      setUserPrompt('')
      inputRef.current?.focus()
    } catch (err) {
      console.error('Request failed:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="MyPrompter home"><span className="brand-mark">✳</span> MyPrompter</a>
        <span className="status"><i /> Your AI workspace</span>
      </header>

      <section className="workspace" id="top">
        <div className="intro">
          <p className="eyebrow">A little room to think</p>
          <h1>What’s on your mind?</h1>
          <p className="subheading">Ask a question, explore an idea, or get help with something you’re working on.</p>
        </div>

        <section className={`answer-card ${serverData || loading || error ? 'has-content' : ''}`} aria-live="polite">
          {loading && <div className="loading-state"><span className="spinner" /> Gathering a thoughtful response…</div>}
          {error && <div className="error-state"><strong>We couldn’t get a response</strong><p>{error}</p></div>}
          {serverData && <article className="answer" dangerouslySetInnerHTML={{ __html: serverData }} />}
          {!serverData && !loading && !error && <div className="empty-state"><span className="sparkle">✦</span><p>Your conversation will appear here.</p></div>}
        </section>

        <div className="composer-wrap">
          <div className="composer">
            <textarea
              ref={inputRef}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your prompt here…"
              aria-label="Your prompt"
              rows="3"
            />
            <div className="composer-footer">
              <span>Be as brief or detailed as you like</span>
              <button onClick={handleSubmit} disabled={loading || !userPrompt.trim()}>
                {loading ? 'Thinking…' : <>Send <span aria-hidden="true">↗</span></>}
              </button>
            </div>
          </div>
          <p className="hint">Press <kbd>Enter</kbd> to send <span>·</span> <kbd>Shift + Enter</kbd> for a new line</p>
        </div>
      </section>
    </main>
  )
}

export default App
