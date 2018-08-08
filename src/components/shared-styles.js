import { html } from '@polymer/lit-element';

const styles = html`
  <style>
    h1 {
      font-family: 'Pacifico';
      font-weight: normal;
    }
    h2 {
      font-family: 'Pacifico';
      font-size: 18px;
    }
    h3 {
      text-transform: uppercase;
      font-size: 18px;
    }
    h4 {
      text-transform: uppercase;
      font-size: 14px;
    }
    a {
      color: #408DBD;
      text-decoration: none;
    }

    .button,
    button {
      border: none;
      color: #fff;
      font-weight: bold;
      background-color: #FEE140;
      background-image: linear-gradient(60deg, #FEE140 0%, #FA709A 100%);
      background-image: linear-gradient(80deg, #fca272 0%, #FA709A 100%);
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
      text-transform: uppercase;
      padding: 6px 14px;
    }
    .button.dark,
    button.dark {
      background-image: linear-gradient(60deg, #fca272 0%, #FA709A 100%);
    }
    .button.light,
    button.light {
      background-image: linear-gradient(60deg, #FEE140 0%, #fca272 100%);
    }
  </style>
`;
export default styles;
