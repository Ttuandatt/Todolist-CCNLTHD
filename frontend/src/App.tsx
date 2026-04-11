function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      backgroundColor: '#282c34',
      color: 'white'
    }}>
      <h1>TodoList CCNLTHD</h1>
      <p>Frontend placeholder is running!</p>
      <p style={{ color: '#61dafb' }}>Backend API: <a href="http://localhost:3333/api-docs" style={{ color: 'inherit' }}>http://localhost:3333/api-docs</a></p>
    </div>
  )
}

export default App
