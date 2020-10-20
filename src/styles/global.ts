import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

*:focus {
  outline: 0
}

html, body, #root {
  font: 14px 'Poppins', sans-serif;
}

body {
  -webkit-font-smoothing: antialiased !important;
  body, input, button {
    font: 14px 'Poppins', sans-serif;
  }
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
}

button {
  cursor: pointer;
  background-color: rgba(0,0,0,0);
  border: 0;
}
`;