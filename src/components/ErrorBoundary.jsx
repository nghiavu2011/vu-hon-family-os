import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Vũ Hồn Family OS error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="errorBoundary">
          <img src="/assets/seal-vu.png" alt="Vũ Hồn" />
          <h1>Hệ thống đang gặp lỗi hiển thị</h1>
          <p>
            Dữ liệu không bị xóa. Hãy tải lại trang hoặc gửi ảnh màn hình lỗi cho quản trị viên dòng họ.
          </p>
          <pre>{String(this.state.error?.message || this.state.error || 'Unknown error')}</pre>
          <button className="btn primary" type="button" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
