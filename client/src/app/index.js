import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

//pages
import Landing from "pages/landing";
import Application from "pages/application";
import GenericNotFound from "pages/pagenotfound";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./App.scss";

//function component
function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#0277bd",
        contrastText: "#fff",
      },
      secondary: {
        main: "#37474f",
        contrastText: "#fff",
      },
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme} style={{ height: "100%", width: "100%" }}>
        <CssBaseline />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Application
                {...props}
                darkMode={darkMode}
                toggleTheme={setDarkMode}
              />
            )}
          />
          <Route path="/404" component={GenericNotFound} />
          <Redirect to="/404" />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
