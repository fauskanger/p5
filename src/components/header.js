import React from 'react';

import githubLogo from "../images/GitHub-Mark-Light-64px.png";


const repoUrl = 'https://www.github.com/fauskanger/p5';

const HeaderComponent = ({ title }) => (
    <header className="App-header" ref={(e => this.headerSection = e)}>
        <div className="title">
            { title }
        </div>
        <div className="github-logo">
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <span className="github-link-text">See code</span>
                <img src={githubLogo} alt="Visit repo on GitHub" />
            </a>
        </div>
    </header>
);

export default HeaderComponent;