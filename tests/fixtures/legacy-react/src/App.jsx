import React, { Component } from 'react';
import './styles/app.css';
import UserGrid from './components/UserGrid';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: true,
      currentUser: 'OperatorAdmin',
      activeTab: 'dashboard'
    };
  }

  handleLogout = () => {
    // Session token removal - critical auth invariant
    sessionStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  render() {
    return (
      <div className="legacy-container" style={{ margin: '0px', padding: '10px' }}>
        <table className="legacy-table-layout" width="100%">
          <tbody>
            <tr>
              <td width="20%" className="sidebar" style={{ background: '#f0f0f0', verticalAlign: 'top' }}>
                <h3 style={{ fontSize: '18px', color: '#333333' }}>Legacy App</h3>
                <ul>
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li><a href="/users">User Records</a></li>
                  <li><a href="/settings">Settings</a></li>
                </ul>
                <button onClick={this.handleLogout} className="btn-legacy-logout">Logout</button>
              </td>
              <td width="80%" className="content-pane" style={{ padding: '20px' }}>
                <div className="panel-header" style={{ marginBottom: '15px' }}>
                  <h2>User Administration Dashboard</h2>
                </div>
                <UserGrid />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
