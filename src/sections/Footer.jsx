import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    © 2012 - {new Date().getFullYear()} Build with <span className="heart">❤️</span> by Zoran Panev &middot;
    <a
      href="https://github.com/zokipokidev"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
    >
      GitHub
    </a> 
    &middot;
    <a
      href="https://linkedin.com/in/zoranpanev"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
    >
      LinkedIn
    </a>
  </footer>
);

export default Footer;