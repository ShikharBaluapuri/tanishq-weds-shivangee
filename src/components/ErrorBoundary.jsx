import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Wedding App ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-[#FAF8F5] border border-[#B8A072]/40 shadow-xl">
            <h2 className="text-2xl font-cormorant font-light text-[#0C223B] mb-2">
              Tanishq &amp; Shivangee
            </h2>
            <p className="text-xs text-[#9A8052] mb-4 font-sans uppercase tracking-widest">
              Auspicious Wedding Celebrations • 14th–15th Feb 2027
            </p>
            <p className="text-sm text-[#0C223B]/80 mb-6 font-cormorant italic">
              Something unexpected happened while rendering. Please click below to refresh the royal invitation.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-[#0C223B] text-[#FAF8F5] font-cormorant font-medium text-xs tracking-wider uppercase border border-[#B8A072]/40 hover:bg-[#143256] transition-all"
            >
              Reload Invitation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
