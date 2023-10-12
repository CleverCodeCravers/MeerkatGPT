import React from 'react';
import logo from '../../../assets/logo.png';

export default function Header() {
  return (
    <header className="main-header">
      <img alt="MeerKat Logo" src={logo} width="120px" />
      <h2 className="test">MeerkatGPT, Your AI based RSS Feed Reader</h2>
    </header>
  );
}
