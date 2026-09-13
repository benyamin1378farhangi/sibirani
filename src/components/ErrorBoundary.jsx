import { Component } from 'react'

// Catches render-time errors anywhere below it so a bug in one part of the
// tree shows a recoverable message instead of an unstyled blank page.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in the app tree:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary glass">
          <h1>Something went wrong</h1>
          <p>Please reload the page. Your saved translations are safe in localStorage.</p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
