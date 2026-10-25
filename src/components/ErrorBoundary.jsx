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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-white border border-[#D4AF37] shadow-xl">
            <h2 className="text-2xl font-serif text-[#5A1818] font-bold mb-2">
              Tanishq weds Shivangee
            </h2>
            <p className="text-xs text-[#8C6D46] mb-4">
              Auspicious Wedding Celebrations • 14th–15th Feb 2027
            </p>
            <p className="text-sm text-gray-700 mb-6">
              Something unexpected happened while rendering. Please click below to refresh the royal invitation.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-[#5A1818] text-[#F3E5AB] font-semibold text-xs tracking-wider uppercase"
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
